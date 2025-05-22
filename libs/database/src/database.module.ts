import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';
import { LocalizationTableModule } from './localization/localization.module';
import { PasswordResetTableModule } from './password-reset/password-reset.module';
import { SessionTableModule } from './session/session.module';
import { UserTableModule } from './user/user.module';
import { MigrationTableModule } from './migration/migration.module';

@Module({
  imports: [
    SessionTableModule,
    PasswordResetTableModule,
    UserTableModule,
    LocalizationTableModule,
    MigrationTableModule
  ],
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders, DatabaseService],
})
export class DatabaseModule {}
