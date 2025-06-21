import {
  BadRequestException,
  Controller,
  Get,
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
import { AssetService } from './asset.service';

import { AuthGuard } from '@auth';
import { UserEntity } from '@database/user/user.entity';
import { Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Response } from 'express';
import { customAlphabet } from 'nanoid';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AssetProcessor } from './asset.processor';
import { ALLOWED_MIME_TYPES } from './declarations/constants/allowed-mime-types.constant';
import { UploadAssetFromDataDto } from './dto/upload-asset-from-data.dto';
import { hashFile } from './utils/hash.utils';
import { assetUploadOptions } from './utils/upload.config';
import axios from 'axios';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetController {
  private generateId = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    12,
  );

  constructor(
    private readonly assetService: AssetService,
    private readonly assetProcessor: AssetProcessor,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @UseInterceptors(FileInterceptor('file', assetUploadOptions))
  @ApiOperation({ summary: 'Upload an asset file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Asset uploaded successfully' })
  async uploadAsset(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserEntity,
  ) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    const fullPath = path.join('uploads/originals', file.filename);
    const hash = await hashFile(fullPath);

    const existing = await this.assetService.findByHash(hash);
    if (existing) {
      return {
        id: existing.id,
        filename: existing.originalFilename,
        note: 'duplicate',
      };
    }

    const processed = await this.assetProcessor.process(file);

    const asset = await this.assetService.create({
      id: processed.id,
      originalFilename: file.originalname,
      storedFilename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: user,
      hash,
      variants: processed.variants,
      blurhash: processed.blurhash,
    });

    return {
      id: processed.id,
      filename: asset.originalFilename,
      variants: asset.variants,
    };
  }

  @Post('from-data')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'Upload an asset from base64 or URL' })
  @ApiResponse({ status: 201, description: 'Asset created from data' })
  async uploadFromData(
    @Body() dto: UploadAssetFromDataDto,
    @CurrentUser() user: UserEntity,
  ) {
    const id = this.generateId();
    const ext = path.extname(dto.filename) || '.png';
    const storedFilename = `${id}${ext}`;
    const originalPath = path.join('uploads/originals', storedFilename);

    let buffer: Buffer;
    if (dto.data) {
      buffer = Buffer.from(dto.data, 'base64');
    } else if (dto.url) {
      const response = await axios.get(dto.url, {
        responseType: 'arraybuffer',
      });
      buffer = Buffer.from(response.data);
    } else {
      throw new BadRequestException('Either data or url must be provided');
    }

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
      mimetype: dto.mimeType,
      originalname: dto.filename,
      path: originalPath,
      filename: storedFilename,
    } as any);

    console.log(dto.filename);
    const asset = await this.assetService.create({
      id,
      originalFilename: dto.filename,
      storedFilename,
      mimeType: dto.mimeType,
      size: buffer.length,
      uploadedBy: user,
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

  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @ApiOperation({ summary: 'List all uploaded assets' })
  @ApiResponse({ status: 200, description: 'Array of assets' })
  async listAssets() {
    return this.assetService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset metadata by ID' })
  @ApiResponse({ status: 200, description: 'Asset metadata' })
  async getAsset(@Param('id') id: string) {
    const asset = await this.assetService.findById(id);
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  @Get(':id/:variant')
  @ApiOperation({ summary: 'Get a specific variant of an asset' })
  @ApiResponse({ status: 200, description: 'Serves the file variant' })
  async getVariant(
    @Param('id') id: string,
    @Param('variant') variant: string,
    @Query('webp') webp: string,
    @Res() res: Response,
  ) {
    const asset = await this.assetService.findById(id);
    if (!asset) throw new NotFoundException('Asset not found');

    const variantEntry = asset.variants?.[variant];
    if (!variantEntry) {
      throw new NotFoundException(`Variant '${variant}' not found for asset.`);
    }

    const finalPath = path.resolve(
      webp === 'true' ? variantEntry.webp : variantEntry.fallback,
    );

    if (!path.isAbsolute(finalPath)) {
      throw new NotFoundException(`Path for variant '${variant}' is invalid.`);
    }

    res.sendFile(path.resolve(finalPath));
  }
}
