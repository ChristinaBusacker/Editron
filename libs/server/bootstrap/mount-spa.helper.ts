import * as express from 'express';
import { join } from 'path';
import { Logger } from '@nestjs/common';

export function mountSpa(
  ex: express.Express,
  basePath: string,
  browserDir: string,
  globalPrefix: string,
  swaggerPath: string,
) {
  ex.use(
    basePath,
    express.static(browserDir, {
      index: false,
      fallthrough: true,
      etag: true,
      maxAge: '1y',
    }),
  );

  const excludeApiSwagger = new RegExp(
    `^(?!\\/${globalPrefix}(?:\\/|$)|\\/${swaggerPath}(?:\\/|$)).*$`,
  );
  const pathRegex =
    basePath === '/'
      ? excludeApiSwagger
      : new RegExp(`^${basePath}(?:\\/.*)?$`);

  ex.get(pathRegex, (req, res, next) => {
    const accept = String(req.headers.accept || '*/*');
    const wantsHtml =
      req.method === 'GET' &&
      (accept.includes('text/html') ||
        accept.includes('application/xhtml+xml') ||
        accept.includes('*/*'));

    if (!wantsHtml) return next();

    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(join(browserDir, 'index.html'));
  });

  Logger.log(`✅ SPA fallback enabled for "${basePath}" from "${browserDir}"`);
}
