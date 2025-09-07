import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/**
 * Base helper to read token or throw 401 if missing.
 */
function getTokenOrThrow(ctx: ExecutionContext): ApiTokenEntity {
  const req = ctx
    .switchToHttp()
    .getRequest<Request & { apiToken?: ApiTokenEntity }>();
  const token = (req as any).apiToken as ApiTokenEntity | undefined;
  if (!token)
    throw new UnauthorizedException('Missing API token in request context');
  return token;
}

/** Returns if Token has read access */
@Injectable()
export class ApiReadPermissionGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const token = getTokenOrThrow(ctx);
    if (!token.hasReadAccess) {
      throw new ForbiddenException(
        'Insufficient permissions for this resource',
      );
    }
    return true;
  }
}

/** Returns if Token has write access */
@Injectable()
export class ApiWritePermissionGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const token = getTokenOrThrow(ctx);
    if (!token.hasWriteAccess) {
      throw new ForbiddenException(
        'Insufficient permissions for this resource',
      );
    }
    return true;
  }
}

/** Returns if Token has management access */
@Injectable()
export class ApiManagementPermissionGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const token = getTokenOrThrow(ctx);
    if (!token.hasManagementAccess) {
      throw new ForbiddenException(
        'Insufficient permissions for this resource',
      );
    }
    return true;
  }
}
