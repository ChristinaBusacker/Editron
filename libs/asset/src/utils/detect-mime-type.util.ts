import * as http from 'http';
import * as https from 'https';
import { fileTypeFromBuffer } from 'file-type';

export async function detectMimeTypeFromUrlLegacy(
  url: string,
): Promise<{ mimeType: string; buffer: Buffer }> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, res => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to fetch: ${res.statusCode}`));
        }

        const chunks: Uint8Array[] = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', async () => {
          const buffer = Buffer.concat(chunks);

          let mimeType = res.headers['content-type'] ?? '';
          const detected = await fileTypeFromBuffer(buffer);

          if (detected?.mime) {
            mimeType = detected.mime;
          }

          // Fallback
          if (!mimeType) {
            mimeType = 'application/octet-stream';
          }

          resolve({ mimeType, buffer });
        });
      })
      .on('error', reject);
  });
}
