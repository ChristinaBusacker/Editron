import { Module } from '@nestjs/common';
import { PublicAuthService } from './public-auth.service';
import { DatabaseModule } from '@database/database.module';
import { ApiKeyAuthGuard } from '../guards/api-key.guard';
import { ApiManagementPermissionGuard } from '../guards/api-management.guard';
import { ApiReadPermissionGuard, ApiWritePermissionGuard } from '../guards/api-permission.guards';


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
