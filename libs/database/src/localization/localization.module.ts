import { Module } from '@nestjs/common';
import { localizationProviders } from './localization.providers';
import { databaseProviders } from '../database.providers';

@Module({
  providers: [...localizationProviders, ...databaseProviders],
  exports: [...localizationProviders, ...databaseProviders],
})
export class LocalizationTableModule {}
