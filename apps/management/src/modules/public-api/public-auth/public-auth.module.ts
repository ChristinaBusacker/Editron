import { Module } from '@nestjs/common';
import { PublicAuthService } from './public-auth.service';
import { DatabaseModule } from '@database/database.module';
import { ApiKeyAuthGuard } from '@management/core/guards/api-key.guard';
import { ApiManagementPermissionGuard } from '@management/core/guards/api-management.guard';
import { ApiReadPermissionGuard, ApiWritePermissionGuard } from '@management/core/guards/api-permission.guards';

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
