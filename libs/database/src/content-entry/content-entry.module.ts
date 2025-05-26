import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { contentEntryProviders } from './content-entry.providers';

@Module({
  providers: [...contentEntryProviders, ...databaseProviders],
  exports: [...contentEntryProviders, ...databaseProviders],
})
export class ContentEntryTableModule {}
