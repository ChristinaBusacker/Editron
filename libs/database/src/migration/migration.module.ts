import { Module } from '@nestjs/common';

import { databaseProviders } from '../database.providers';
import { migrationProviders } from './migration.providers';

@Module({
  providers: [...migrationProviders, ...databaseProviders],
  exports: [...migrationProviders, ...databaseProviders],
})
export class MigrationTableModule {}
