import { DataSource } from 'typeorm';
import { LocalizationEntity } from './localization/localization.entity';
import { PasswordResetEntity } from './password-reset/password-reset.entity';
import { SessionEntity } from './session/session.entity';
import { UserEntity } from './user/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const entities = [
  UserEntity,
  PasswordResetEntity,
  SessionEntity,
  LocalizationEntity,
];

export const AppDataSource = new DataSource({
  type: (process.env['DB_TYPE'] || 'sqlite') as any,
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT'] || '5432'),
  username: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: `${process.env['DB_NAME']}`,
  synchronize: !process.env['IS_PROD'],
  entities,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err);
  });
