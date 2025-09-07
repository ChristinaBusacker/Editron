import { AppService } from '@management/app.service';
import { MigrationService } from '@management/core/migration/migration.service';
import { INestApplication, Logger } from '@nestjs/common';

export async function runAppMigrationsAndInit(app: INestApplication) {
  try {
    if (process.env.RUN_MIGRATIONS_ON_BOOT !== 'true') return;

    const ready = global.databaseReady as Promise<void> | undefined;
    if (ready) await ready;

    const migrationService = app.get<MigrationService>('MigrationService', {
      strict: false,
    });
    const appService = app.get<AppService>('AppService', { strict: false });

    if (migrationService?.migrate) await migrationService.migrate();
    if (appService?.initCMSModules) await appService.initCMSModules();

    Logger.log('✅ Migrations & CMS init completed');
  } catch (e) {
    Logger.error('❌ Migration/Init failed', (e as Error).stack);
    if (process.env.FAIL_ON_MIGRATION_ERROR === 'true') {
      throw e;
    }
  }
}
