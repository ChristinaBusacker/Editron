import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { publicApiRequestLogProviders } from './public-api-request-logger.providers';

@Module({
  providers: [...publicApiRequestLogProviders, ...databaseProviders],
  exports: [...publicApiRequestLogProviders, ...databaseProviders],
})
export class PublicApiRequestLoggerTableModule {}
