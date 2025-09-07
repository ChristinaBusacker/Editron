/**
 * Parses a data URL and extracts the MIME type and buffer.
 *
 * Example input:
 *   data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
 */
export function parseDataUrl(dataUrl: string): {
  mimeType: string;
  buffer: Buffer;
} {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL format');
  }

  const mimeType = match[1]; // z. B. "image/png"
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');

  return { mimeType, buffer };
}
