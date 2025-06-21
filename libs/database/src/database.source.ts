import { DataSource } from 'typeorm';
import { LocalizationEntity } from './localization/localization.entity';
import { PasswordResetEntity } from './password-reset/password-reset.entity';
import { SessionEntity } from './session/session.entity';
import { UserEntity } from './user/user.entity';
import * as dotenv from 'dotenv';
import { MigrationEntity } from './migration/migration.entity';
import { ProjectEntity } from './project/project.entity';
import { ProjectMemberEntity } from './project-member/project-member.entity';
import { ContentEntryEntity } from './content-entry/content-entry.entity';
import { ContentSchemaEntity } from './content-schema/content-schema.entity';
import { ContentVersionEntity } from './content-version/content-version.entity';
import { ContentValueEntity } from './content-value/content-value.entity';
import { AssetEntity } from './asset/asset.entity';

dotenv.config();

export const entities = [
  UserEntity,
  PasswordResetEntity,
  SessionEntity,
  LocalizationEntity,
  MigrationEntity,
  ProjectEntity,
  ProjectMemberEntity,
  ContentEntryEntity,
  ContentSchemaEntity,
  ContentVersionEntity,
  ContentValueEntity,
  AssetEntity,
];

export const AppDataSource = new DataSource({
  type: (process.env['DB_TYPE'] || 'sqlite') as any,
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT'] || '5432'),
  username: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: `${process.env['DB_NAME']}`,
  synchronize: true,
  entities,
});

export const databaseReady = AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err);
  });
