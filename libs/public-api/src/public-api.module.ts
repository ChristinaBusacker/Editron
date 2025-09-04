import { Module } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { PublicAuthModule } from './public-auth.module';
import { PublicApiController } from './public-api.controller';
import { DatabaseModule } from '@database/database.module';
import { PublicApiRequestLoggerService } from './public-api-request-logger.service';
import { PublicApiLoggingInterceptor } from './interceptors/public-api-logging.interceptor';
import { AuthModule } from '@auth';
import { PublicApiStatsService } from './public-api-stats.service';


@Module({
  imports: [PublicAuthModule, DatabaseModule, AuthModule],
  providers: [PublicApiService, PublicApiRequestLoggerService, PublicApiLoggingInterceptor, PublicApiStatsService],
  exports: [PublicApiService, PublicApiRequestLoggerService],
  controllers: [PublicApiController],
})
export class PublicApiModule {}
