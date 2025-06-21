import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetService } from './asset.service';

import { UserEntity } from '@database/user/user.entity';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthGuard } from '@auth';
import { ALLOWED_MIME_TYPES } from './declarations/constants/allowed-mime-types.constant';
import { hashFile } from './utils/hash.utils';
import * as path from 'path';
import { assetUploadOptions } from './utils/upload.config';
import { AssetProcessor } from './asset.processor';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetController {
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
      id: processed.assetId,
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
