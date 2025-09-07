import { Module } from '@nestjs/common';
import { ApiTokenTableModule } from './api-token/api-token.module';
import { AssetTableModule } from './asset/asset.module';
import { ContentEntryTableModule } from './content-entry/content-entry.module';
import { ContentSchemaTableModule } from './content-schema/content-schema.module';
import { ContentValueTableModule } from './content-value/content-value.module';
import { ContentVersionTableModule } from './content-version/content-version.module';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';
import { LocalizationTableModule } from './localization/localization.module';
import { MigrationTableModule } from './migration/migration.module';
import { PasswordResetTableModule } from './password-reset/password-reset.module';
import { ProjectMemberTableModule } from './project-member/project-member.module';
import { ProjectTableModule } from './project/project.module';
import { PublicApiRequestLoggerTableModule } from './public-api-request-logger/public-api-request-logger.module';
import { SessionTableModule } from './session/session.module';
import { UserInviteTableModule } from './user-invite/user-invite.module';
import { UserTableModule } from './user/user.module';
import { ErrorLogTableModule } from './error-log/error-log.module';

@Module({
  imports: [
    SessionTableModule,
    PasswordResetTableModule,
    UserTableModule,
    LocalizationTableModule,
    MigrationTableModule,
    ProjectTableModule,
    ProjectMemberTableModule,
    ContentEntryTableModule,
    ContentSchemaTableModule,
    ContentVersionTableModule,
    ContentValueTableModule,
    AssetTableModule,
    UserInviteTableModule,
    ApiTokenTableModule,
    PublicApiRequestLoggerTableModule,
    ErrorLogTableModule
  ],
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders, DatabaseService],
})
export class DatabaseModule {}
