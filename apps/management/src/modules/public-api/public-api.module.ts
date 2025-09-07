import { Module } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { PublicApiController } from './public-api.controller';
import { DatabaseModule } from '@database/database.module';
import { PublicApiLoggingInterceptor } from './interceptors/public-api-logging.interceptor';
import { AuthModule } from '../auth/auth.module';
import { PublicAuthModule } from './public-auth/public-auth.module';
import { PublicApiRequestLoggerService } from './request-logger/public-api-request-logger.service';
import { PublicApiStatsService } from './stats/public-api-stats.service';



@Module({
  imports: [PublicAuthModule, DatabaseModule, AuthModule],
  providers: [PublicApiService, PublicApiRequestLoggerService, PublicApiLoggingInterceptor, PublicApiStatsService],
  exports: [PublicApiService, PublicApiRequestLoggerService],
  controllers: [PublicApiController],
})
export class PublicApiModule {}
