import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { PublicApiModule } from './public-api.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem'),
  };

  const app = await NestFactory.create(PublicApiModule, {
    httpsOptions,
  });

  const globalPrefix = 'public';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.get<string>('FRONTEND_URL')],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, x-auth',
  });

  const config = new DocumentBuilder()
    .setTitle('Editron Public Documentation')
    .setDescription('Die API Beschreibung')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = configService.get<number>('ASSET_PORT') ?? 3002;

  await app.listen(port);

  Logger.log(
    `🤖 🚀 Public API is running on: https://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🤖 📚 Public API Swagger is running on: https://localhost:${port}/swagger`,
  );
}
bootstrap();
