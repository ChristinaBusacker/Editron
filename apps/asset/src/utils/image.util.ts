import * as Sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { IMAGE_VARIANTS } from '../declarations/constants/image-variants.contant';

/**
 * Creates resized image variants in both WebP and fallback format (jpeg/png).
 * @param inputPath Absolute path to original uploaded image.
 * @param outputDir Directory to store the generated variants.
 * @param fallbackFormat The fallback format to generate alongside webp (jpeg or png).
 * @returns Map of variant keys to paths { webp: string; fallback: string }
 */
export async function processImageVariants(
  inputPath: string,
  outputDir: string,
  fallbackFormat: 'jpeg' | 'png',
): Promise<Record<string, { webp: string; fallback: string }>> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const result: Record<string, { webp: string; fallback: string }> = {};

  for (const [variant, width] of Object.entries(IMAGE_VARIANTS)) {
    const baseName = variant;
    const webpPath = path.join(outputDir, `${baseName}.webp`);
    const fallbackPath = path.join(outputDir, `${baseName}.${fallbackFormat}`);

    const pipeline = Sharp(inputPath).resize({ width });

    await pipeline.clone().webp({ quality: 85 }).toFile(webpPath);

    if (fallbackFormat === 'jpeg') {
      await pipeline.clone().jpeg({ quality: 90 }).toFile(fallbackPath);
    } else {
      await pipeline.clone().png({ compressionLevel: 9 }).toFile(fallbackPath);
    }

    result[variant] = {
      webp: webpPath,
      fallback: fallbackPath,
    };
  }

  return result;
}
