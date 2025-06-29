import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';
import { LocalizationTableModule } from './localization/localization.module';
import { PasswordResetTableModule } from './password-reset/password-reset.module';
import { SessionTableModule } from './session/session.module';
import { UserTableModule } from './user/user.module';
import { MigrationTableModule } from './migration/migration.module';
import { ProjectTableModule } from './project/project.module';
import { ProjectMemberTableModule } from './project-member/project-member.module';
import { ContentEntryTableModule } from './content-entry/content-entry.module';
import { ContentSchemaEntity } from './content-schema/content-schema.entity';
import { ContentVersionTableModule } from './content-version/content-version.module';
import { ContentValueTableModule } from './content-value/content-value.module';
import { ContentSchemaTableModule } from './content-schema/content-schema.module';
import { AssetTableModule } from './asset/asset.module';
import { UserInviteTableModule } from './user-invite/user-invite.module';

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
    UserInviteTableModule
  ],
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders, DatabaseService],
})
export class DatabaseModule {}
