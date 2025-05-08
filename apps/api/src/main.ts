import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

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
  .setTitle('Editron API Documentation')
  .setDescription('Die API Beschreibung')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);


  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  Logger.log(
    `🤖 🚀 Editron API is running on: https://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🤖 📚 Editron API Swagger is running on: https://localhost:${port}/swagger`,
  );
}
bootstrap();
