import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { API_KEY_SECURITY_NAME } from '@shared/constants/api-key.constant';

/**
 * Marks a route/controller as protected by ApiKeyAuthGuard.
 */
export const API_KEY_PROTECTED = 'api_key_protected';

export function ApiKeyProtected(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    SetMetadata(API_KEY_PROTECTED, true),
    // Swagger hint to show apiKey requirement
    ApiSecurity(API_KEY_SECURITY_NAME),
  );
}
