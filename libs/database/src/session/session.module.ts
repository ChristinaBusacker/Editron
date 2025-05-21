import { Module } from '@nestjs/common';
import { sessionProviders } from './session.providers';
import { databaseProviders } from '../database.providers';

@Module({
  providers: [...sessionProviders, ...databaseProviders],
  exports: [...sessionProviders, ...databaseProviders],
})
export class SessionTableModule {}
