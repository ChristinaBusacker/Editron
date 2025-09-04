import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PublicAuthService } from './public-auth.service';
import { ApiKeyAuthGuard } from './guards/api-key.guard';
import { ApiReadPermissionGuard } from './guards/api-read.guard';
import { ApiWritePermissionGuard } from './guards/api-write.guard';
import { ApiManagementPermissionGuard } from './guards/api-management.guard';
import { DatabaseService } from '@database/database.service';
import { DatabaseModule } from '@database/database.module';


@Module({
  imports: [
    DatabaseModule
  ],
  providers: [
    PublicAuthService,
    ApiKeyAuthGuard,
    ApiManagementPermissionGuard,
    ApiReadPermissionGuard,
    ApiWritePermissionGuard
  ],
  exports: [    
    ApiKeyAuthGuard,
    PublicAuthService,
    ApiManagementPermissionGuard,
    ApiReadPermissionGuard,
    ApiWritePermissionGuard
  ],
})
export class PublicAuthModule {}
