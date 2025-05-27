import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.get<string>('FRONTEND_URL')],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, x-auth',
  });

  const config = new DocumentBuilder()
    .setTitle('Editron Management Documentation')
    .setDescription('Die API Beschreibung')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = configService.get<number>('MANAGEMENT_PORT') ?? 3001;

  await app.listen(port);

  Logger.log(
    `🤖 🚀 Management API is running on: https://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🤖 📚 Management API Swagger is running on: https://localhost:${port}/swagger`,
  );
}
bootstrap();
