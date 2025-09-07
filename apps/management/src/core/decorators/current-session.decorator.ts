import { SessionEntity } from '@database/session/session.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SessionEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
