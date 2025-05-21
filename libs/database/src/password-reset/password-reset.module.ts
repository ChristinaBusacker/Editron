import { Module } from '@nestjs/common';
import { passwordResetProviders } from './password-reset.providers';
import { databaseProviders } from '../database.providers';

@Module({
  providers: [...passwordResetProviders, ...databaseProviders],
  exports: [...passwordResetProviders, ...databaseProviders],
})
export class PasswordResetTableModule {}
