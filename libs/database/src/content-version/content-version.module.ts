import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { contentVersionProviders } from './content-version.providers';

@Module({
  providers: [...contentVersionProviders, ...databaseProviders],
  exports: [...contentVersionProviders, ...databaseProviders],
})
export class ContentVersionTableModule {}
