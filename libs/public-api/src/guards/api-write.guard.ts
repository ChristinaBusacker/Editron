import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

/**
 * Reads API token from request.
 * Returns if Token has write access
 */
@Injectable()
export class ApiWritePermissionGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { apiToken?: any }>();
    const token = (req as any).apiToken as ApiTokenEntity;

    if (!token.hasWriteAccess) {
      throw new ForbiddenException(
        'Insufficient permissions for this resource',
      );
    }

    return token.hasWriteAccess;
  }
}
