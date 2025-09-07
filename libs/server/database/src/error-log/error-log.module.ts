import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { errorLogProviders } from './error-log.providers';


@Module({
  providers: [...errorLogProviders, ...databaseProviders],
  exports: [...errorLogProviders, ...databaseProviders],
})
export class ErrorLogTableModule {}
