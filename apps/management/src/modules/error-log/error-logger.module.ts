import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { ErrorLoggerController } from './error-logger.controller';
import { ErrorLoggerService } from './error-logger.service';
import { AuthModule } from '../auth/auth.module';
import { PublicAuthModule } from '../public-api/public-auth/public-auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [DatabaseModule, AuthModule, PublicAuthModule,
    ThrottlerModule.forRoot([{ ttl: 60, limit: 30 }]),
  ],
  providers: [ErrorLoggerService],
  controllers: [ErrorLoggerController],
  exports: [ErrorLoggerService]
})
export class ErrorLoggerModule {}
