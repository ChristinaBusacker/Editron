import { NestFactory } from '@nestjs/core';
import { AssetModule } from './asset.module';
import { databaseReady } from '@database/database.source';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem'),
  };

  const app = await NestFactory.create(AssetModule, {
    httpsOptions,
  });

  const globalPrefix = 'asset';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.get<string>('FRONTEND_URL')],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, x-auth',
  });

  const config = new DocumentBuilder()
    .setTitle('Editron Asset Documentation')
    .setDescription('Die API Beschreibung')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = configService.get<number>('ASSET_PORT') ?? 3002;

  await app.listen(port);

  Logger.log(
    `🤖 🚀 Asset API is running on: https://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🤖 📚 Asset API Swagger is running on: https://localhost:${port}/swagger`,
  );
}
bootstrap();
