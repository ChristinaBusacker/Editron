import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { apiTokenProviders } from './api-token.providers';


@Module({
  providers: [...apiTokenProviders, ...databaseProviders],
  exports: [...apiTokenProviders, ...databaseProviders],
})
export class ApiTokenTableModule {}
