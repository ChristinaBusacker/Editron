import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { projectProviders } from './project.providers';

@Module({
  providers: [...projectProviders, ...databaseProviders],
  exports: [...projectProviders, ...databaseProviders],
})
export class ProjectTableModule {}
