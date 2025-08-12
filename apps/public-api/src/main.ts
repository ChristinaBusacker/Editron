import { NestFactory } from '@nestjs/core';
import { PublicApiModule } from './public-api.module';

async function bootstrap() {
  const app = await NestFactory.create(PublicApiModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
