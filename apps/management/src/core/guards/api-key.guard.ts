import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import { PublicAuthService } from '@management/modules/public-api/public-auth/public-auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  API_KEY_HEADER,
  API_KEY_QUERY,
} from '@shared/constants/api-key.constant';

import type { Request } from 'express';

/**
 * Reads API key from header "x-api-key" or query "?apiKey=".
 * Validates it and attaches the token to request as "apiToken".
 */
@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly auth: PublicAuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { apiToken?: ApiTokenEntity }>();

    const headerKey = (req.headers as any)?.[API_KEY_HEADER];
    const queryKey = new URL(req.url, 'http://internal').searchParams.get(
      API_KEY_QUERY,
    );
    const rawKey = (headerKey ?? queryKey) as string | null;

    const token = await this.auth.validateApiKey(rawKey ?? undefined);
    if (!token) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    (req as any).apiToken = token;
    return true;
  }
}
