import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { API_KEY_SECURITY_NAME } from '@shared/constants/api-key.constant';
import { ApiKeyAuthGuard } from '../guards/api-key.guard';
import { ApiManagementPermissionGuard } from '../guards/api-management.guard';
import {
  ApiReadPermissionGuard,
  ApiWritePermissionGuard,
} from '../guards/api-permission.guards';

/** Protects route with API key only */
export function ApiKeyOnly(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiSecurity(API_KEY_SECURITY_NAME),
    UseGuards(ApiKeyAuthGuard),
  );
}

/** Protects route requiring read permission */
export function ApiReadAccess(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiSecurity(API_KEY_SECURITY_NAME),
    UseGuards(ApiKeyAuthGuard, ApiReadPermissionGuard),
  );
}

/** Protects route requiring write permission */
export function ApiWriteAccess(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiSecurity(API_KEY_SECURITY_NAME),
    UseGuards(ApiKeyAuthGuard, ApiWritePermissionGuard),
  );
}

/** Protects route requiring management permission */
export function ApiManagementAccess(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiSecurity(API_KEY_SECURITY_NAME),
    UseGuards(ApiKeyAuthGuard, ApiManagementPermissionGuard),
  );
}
