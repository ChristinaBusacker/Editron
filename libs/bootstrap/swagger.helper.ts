import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  opts: {
    title: string;
    description?: string;
    version?: string;
    path?: string;
    include?: any[];
  },
) {
  const config = new DocumentBuilder()
    .setTitle(opts.title)
    .setDescription(opts.description ?? '')
    .setVersion(opts.version ?? '1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: opts.include,
  });
  SwaggerModule.setup(opts.path ?? 'swagger', app, document);
}
