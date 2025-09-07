import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MigrationModule } from './core/migration/migration.module';
import { ContentModule } from './modules/content/content.module';
import { ProjectMemberModule } from './modules/project-member/project-member.module';
import { ProjectModule } from './modules/project/project.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from '@database/database.module';

import { ApiTokenModule } from './modules/api-token/api-token.module';

import { AssetModule } from './modules/asset/asset.module';
import { AuthModule } from './modules/auth/auth.module';
import { PublicApiModule } from './modules/public-api/public-api.module';
import { ErrorLoggerService } from './modules/error-log/error-logger.service';
import { ErrorLoggerModule } from './modules/error-log/error-logger.module';
import { GlobalExceptionFilter } from './core/handlers/global-exception.filter';

@Module({
  imports: [
    ConfigModule,
    AuthModule, 
    MigrationModule, 
    UserModule, 
    ProjectModule, 
    ProjectMemberModule, 
    ContentModule,
    ApiTokenModule,
    DatabaseModule,
    AssetModule,
    PublicApiModule,
    ErrorLoggerModule
  ],
  controllers: [AppController],
  providers: [AppService, GlobalExceptionFilter],
  exports: [AppService]
})
export class AppModule {}
