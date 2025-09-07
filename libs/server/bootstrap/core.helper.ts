import { INestApplication } from '@nestjs/common';

export function setupCors(app: INestApplication, origins: string | string[]) {
  const originArray = Array.isArray(origins)
    ? origins
    : origins
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);

  app.enableCors({
    origin: originArray,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, x-auth',
    credentials: true,
  });
}
