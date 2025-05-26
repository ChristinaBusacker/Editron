import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { contentValueProviders } from './content-value.providers';

@Module({
  providers: [...contentValueProviders, ...databaseProviders],
  exports: [...contentValueProviders, ...databaseProviders],
})
export class ContentValueTableModule {}
