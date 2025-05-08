import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
  .setTitle('Editron Management Documentation')
  .setDescription('Die API Beschreibung')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);


  const port = process.env.PORT ?? 3001;

  await app.listen(port);

  Logger.log(
    `🤖 🚀 Management API is running on: https://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🤖 📚 Management API Swagger is running on: https://localhost:${port}/swagger`,
  );
}
bootstrap();
