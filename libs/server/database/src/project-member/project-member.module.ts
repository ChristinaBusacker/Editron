import { Module } from '@nestjs/common';
import { projectMemberProviders } from './project-member.providers';
import { databaseProviders } from '../database.providers';

@Module({
  providers: [...projectMemberProviders, ...databaseProviders],
  exports: [...projectMemberProviders, ...databaseProviders],
})
export class ProjectMemberTableModule {}
