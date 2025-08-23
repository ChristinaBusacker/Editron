import * as fs from 'fs';

export type HttpsOptions = { key: Buffer; cert: Buffer } | undefined;

export function readHttpsOptionsFromEnv(): HttpsOptions {
  const enabled = process.env.HTTPS_ENABLED === 'true';
  if (!enabled) return undefined;

  const keyPath = process.env.HTTPS_KEY_PATH ?? './ssl/localhost-key.pem';
  const certPath = process.env.HTTPS_CERT_PATH ?? './ssl/localhost.pem';

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}
