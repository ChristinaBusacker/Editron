import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as express from 'express';
import * as fs from 'fs';
import { join } from 'path';

import { databaseReady } from '@database/database.source';
import { MigrationService } from './core/migration/migration.service';
import { AppService } from './app.service';
import {
  readHttpsOptionsFromEnv,
  setupCors,
  setupSwagger,
  mountSpa,
} from 'libs/server/bootstrap';
import { ErrorLoggerService } from './modules/error-log/error-logger.service';
import { GlobalExceptionFilter } from './core/handlers/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: readHttpsOptionsFromEnv(),
  });

  const config = app.get(ConfigService);
  const globalPrefix = config.get<string>('GLOBAL_PREFIX') ?? 'api';
  app.setGlobalPrefix(globalPrefix);

  const errors = app.get(ErrorLoggerService);
  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  process.on('uncaughtException', (err) => {
    void errors.log({
      source: 'server',
      message: err.message,
      stack: err.stack,
      context: 'uncaughtException',
    });
  });
  process.on('unhandledRejection', (reason: any) => {
    const msg =
      typeof reason === 'string'
        ? reason
        : (reason?.message ?? 'unhandledRejection');
    const stack = reason?.stack ?? null;
    void errors.log({
      source: 'server',
      message: msg,
      stack,
      context: 'unhandledRejection',
    });
  });

  const corsOrigins =
    config.get<string>('CORS_ORIGINS') ??
    config.get<string>('FRONTEND_URL') ??
    '';
  setupCors(app, corsOrigins);

  const enableSwagger = config.get<string>('ENABLE_SWAGGER') !== 'false';
  const swaggerPath = 'swagger';
  if (enableSwagger) {
    setupSwagger(app, {
      title: 'Editron Management Documentation',
      description: 'API description',
      version: '1.0',
      path: swaggerPath,
    });
  }

  const ex = app.getHttpAdapter().getInstance() as express.Express;

  const findBrowserDir = (...candidates: string[]) =>
    candidates
      .map((rel) => join(process.cwd(), rel))
      .find((abs) => fs.existsSync(abs));

  const frontendBrowser =
    findBrowserDir('dist/apps/frontend/browser', 'dist/frontend/browser') ?? '';
  const cmsBrowser =
    findBrowserDir('dist/apps/cms/browser', 'dist/cms/browser') ?? '';

  if (frontendBrowser) {
    mountSpa(ex, '/', frontendBrowser, globalPrefix, swaggerPath);
  } else {
    Logger.warn(
      '⚠️ No frontend browser bundle found (looked for dist/apps/frontend/browser or dist/frontend/browser).',
    );
  }

  if (cmsBrowser) {
    mountSpa(ex, '/', cmsBrowser, globalPrefix, swaggerPath);
  }

  await app.init();

  if (process.env.RUN_MIGRATIONS_ON_BOOT === 'true') {
    try {
      await databaseReady;

      try {
        const migration = app.get(MigrationService);
        await migration.migrate();
      } catch {
        Logger.warn('⚠️ MigrationService not found — skipping migrations.');
      }

      try {
        const appSvc = app.get(AppService);
        if (appSvc?.initCMSModules) {
          await appSvc.initCMSModules();
        } else {
          Logger.warn(
            '⚠️ AppService.initCMSModules not found — skipping init.',
          );
        }
      } catch {
        Logger.warn('⚠️ AppService not found — skipping init.');
      }

      Logger.log('✅ Migrations & CMS init completed');
    } catch (e: any) {
      Logger.error('❌ Migration/Init failed', e?.stack ?? String(e));
      if (process.env.FAIL_ON_MIGRATION_ERROR === 'true') throw e;
    }
  }

  const port = config.get<number>('MANAGEMENT_PORT') ?? 3000;

  await app.listen(port);

  const proto = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
  Logger.log(
    `🤖 🚀 Server is running on: ${proto}://localhost:${port}/${globalPrefix}`,
  );
  if (enableSwagger) {
    Logger.log(`🤖 📚 Swagger: ${proto}://localhost:${port}/${swaggerPath}`);
  }
}
bootstrap();
