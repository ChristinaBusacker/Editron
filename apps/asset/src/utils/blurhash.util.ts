import * as Sharp from 'sharp';
import { encode } from 'blurhash';

/**
 * Generate a blurhash string from an image.
 * @param imagePath Path to the image (should be jpg, png, webp etc.).
 */
export async function generateBlurhash(
  imagePath: string,
): Promise<string | null> {
  const image = Sharp(imagePath).ensureAlpha().raw();
  const { data, info } = await image.toBuffer({ resolveWithObject: true });

  if (info.width < 8 || info.height < 8) {
    // blurhash needs a minimum resolution
    return null;
  }

  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4,
  );
  return blurhash;
}
