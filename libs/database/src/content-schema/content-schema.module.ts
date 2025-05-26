import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { contentSchemaProviders } from './content-schema.providers';

@Module({
  providers: [...contentSchemaProviders, ...databaseProviders],
  exports: [...contentSchemaProviders, ...databaseProviders],
})
export class ContentSchemaTableModule {}
