import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as crypto from 'crypto';
import { Response } from 'express';
import * as fs from 'fs';
import { customAlphabet } from 'nanoid';
import * as path from 'path';

import { AssetProcessor } from './asset.processor';
import { AssetService } from './asset.service';
import { UploadAssetFromDataDto } from './dto/upload-asset-from-data.dto';

import { AuthGuard } from '@auth';
import { UserEntity } from '@database/user/user.entity';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { ALLOWED_MIME_TYPES } from './declarations/constants/allowed-mime-types.constant';
import { assetUploadOptions } from './utils/upload.config';
import { detectMimeTypeFromUrlLegacy } from './utils/detect-mime-type.util';
import { parseDataUrl } from './utils/parse-data-url.util';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller()
export class AssetController {
  private generateId = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    12,
  );

  constructor(
    private readonly assetService: AssetService,
    private readonly assetProcessor: AssetProcessor,
  ) {}

  // === Upload via Form ===
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', assetUploadOptions))
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'x-auth', required: true, description: 'Session token' })
  @ApiOperation({ summary: 'Upload asset via file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Asset uploaded' })
  async uploadAsset(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserEntity,
  ) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }

    const buffer = await fs.promises.readFile(file.path);
    return this.handleAssetBufferUpload(buffer, {
      filename: file.originalname,
      mimetype: file.mimetype,
      storedFilename: file.filename,
      user,
    });
  }

  // === Upload via Base64 or URL ===
  @Post('from-data')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'x-auth', required: true, description: 'Session token' })
  @ApiOperation({
    summary: 'Upload asset from base64, data URL or external URL',
  })
  @ApiResponse({ status: 201, description: 'Asset uploaded' })
  async uploadFromData(
    @Body() dto: UploadAssetFromDataDto,
    @CurrentUser() user: UserEntity,
  ) {
    let buffer: Buffer;
    let mimeType = dto.mimeType;

    if (dto.data) {
      buffer = Buffer.from(dto.data, 'base64');
      if (!mimeType) {
        throw new BadRequestException('Missing MIME type for base64 upload');
      }
    } else if (dto.url) {
      if (dto.url.startsWith('data:')) {
        try {
          const result = parseDataUrl(dto.url);
          buffer = result.buffer;
          mimeType = result.mimeType;
        } catch (err) {
          throw new BadRequestException('Invalid data URL');
        }
      } else {
        const result = await detectMimeTypeFromUrlLegacy(dto.url);
        buffer = result.buffer;
        mimeType = result.mimeType;
      }
    } else {
      throw new BadRequestException('Either data or url must be provided');
    }

    const ext = path.extname(dto.filename || 'file.png') || '.png';
    const storedFilename = `${this.generateId()}${ext}`;

    return this.handleAssetBufferUpload(buffer, {
      filename: dto.filename || 'upload' + ext,
      mimetype: mimeType,
      storedFilename,
      user,
    });
  }

  @Post('validate-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate URL or data URL and detect MIME type' })
  @ApiResponse({ status: 200, description: 'Detected MIME type and file info' })
  async validateUrl(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    try {
      let mimeType: string;

      if (url.startsWith('data:')) {
        const result = parseDataUrl(url);
        mimeType = result.mimeType;
      } else {
        const result = await detectMimeTypeFromUrlLegacy(url);
        mimeType = result.mimeType;
      }

      const allowed = ['image/', 'video/'];
      const isAllowed = allowed.some(prefix => mimeType.startsWith(prefix));

      return {
        valid: isAllowed,
        mimeType,
      };
    } catch (error) {
      throw new BadRequestException(
        `URL check failed: ${(error as Error).message}`,
      );
    }
  }

  // === List All Assets ===
  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'x-auth', required: true })
  @ApiOperation({ summary: 'List all assets' })
  @ApiResponse({ status: 200, description: 'Returns asset list' })
  async listAssets() {
    return this.assetService.findAllWithUser();
  }

  // === Get Asset Metadata ===
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get asset metadata' })
  @ApiResponse({ status: 200, description: 'Asset metadata returned' })
  async getAsset(@Param('id') id: string) {
    const asset = await this.assetService.findByIdWithUser(id);
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  // === Download Original File ===
  @Get(':id/download')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Download original asset file' })
  @ApiResponse({ status: 200, description: 'Returns original file' })
  async downloadAsset(@Param('id') id: string, @Res() res: Response) {
    const asset = await this.assetService.findById(id);
    if (!asset) throw new NotFoundException('Asset not found');

    const filePath = path.resolve('uploads/originals', asset.storedFilename);
    res.sendFile(filePath);
  }

  // === Serve Variant ===
  @Get(':id/:variant')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get asset variant (e.g. thumbnail)' })
  @ApiResponse({ status: 200, description: 'Returns variant file' })
  async getVariant(
    @Param('id') id: string,
    @Param('variant') variant: string,
    @Query('webp') webp: string,
    @Res() res: Response,
  ) {
    const asset = await this.assetService.findById(id);
    if (!asset) throw new NotFoundException('Asset not found');

    const entry = asset.variants?.[variant];
    if (!entry) {
      throw new NotFoundException(`Variant '${variant}' not found`);
    }

    const filePath = path.resolve(
      webp === 'true' ? entry.webp : entry.fallback,
    );

    res.sendFile(filePath);
  }

  // === Internal helper ===
  private async handleAssetBufferUpload(
    buffer: Buffer,
    opts: {
      filename: string;
      mimetype: string;
      storedFilename: string;
      user: UserEntity;
    },
  ) {
    const id = this.generateId();
    const originalPath = path.join('uploads/originals', opts.storedFilename);
    await fs.promises.writeFile(originalPath, buffer);

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const existing = await this.assetService.findByHash(hash);
    if (existing) {
      return {
        id: existing.id,
        filename: existing.originalFilename,
        note: 'duplicate',
      };
    }

    const processed = await this.assetProcessor.process({
      buffer,
      mimetype: opts.mimetype,
      originalname: opts.filename,
      path: originalPath,
      filename: opts.storedFilename,
    } as any);

    const asset = await this.assetService.create({
      id,
      originalFilename: opts.filename,
      storedFilename: opts.storedFilename,
      mimeType: opts.mimetype,
      size: buffer.length,
      uploadedBy: opts.user,
      hash,
      variants: processed.variants,
      blurhash: processed.blurhash,
    });

    return {
      id: asset.id,
      filename: asset.originalFilename,
      variants: asset.variants,
    };
  }

  private async downloadFromUrl(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https')
        ? require('https')
        : require('http');
      client
        .get(url, res => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Failed to fetch: ${res.statusCode}`));
          }
          const chunks: Uint8Array[] = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        })
        .on('error', reject);
    });
  }
}
