import { Injectable } from '@nestjs/common';

import * as path from 'path';
import { generateBlurhash } from './utils/blurhash.util';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { processImageVariants } from './utils/image.util';

@Injectable()
export class AssetProcessor {
  /**
   * Processes an uploaded image:
   * - Generates a random assetId
   * - Creates image variants (webp + fallback)
   * - Generates blurhash
   */
  async process(file: Express.Multer.File): Promise<{
    assetId: string;
    variants: Record<string, { webp: string; fallback: string }>;
    blurhash: string;
  }> {
    const assetId = uuidv4(); // ID used as folder name

    const ext = path.extname(file.originalname).toLowerCase();
    const isWebp = ext === '.webp' || file.mimetype === 'image/webp';

    const fallbackFormat: 'jpeg' | 'png' = isWebp
      ? 'png'
      : (mime.extension(file.mimetype) as 'jpeg' | 'png');

    const outputDir = path.join('uploads/variants', assetId);
    const inputPath = path.join('uploads/originals', file.filename);

    const variants = await processImageVariants(
      inputPath,
      outputDir,
      fallbackFormat,
    );

    const blurhash = await generateBlurhash(inputPath);

    return {
      assetId,
      variants,
      blurhash,
    };
  }
}
