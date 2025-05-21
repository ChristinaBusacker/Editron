import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { databaseProviders } from '../database.providers';

@Module({
  providers: [...userProviders, ...databaseProviders],
  exports: [...userProviders, ...databaseProviders],
})
export class UserTableModule {}
