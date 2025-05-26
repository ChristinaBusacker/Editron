import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { isUUID } from 'class-validator';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const auth = req.headers['x-auth'];
    if (!auth && typeof auth === 'string') {
      res.status(404).send({ error: 'Session required' });
      return false;
    }

    if (!isUUID(auth)) {
      res.status(418).send({ error: 'Invalid session ID format' });
      return false;
    }

    const session = await this.authService.getValidSession(
      typeof auth === 'string' ? auth : auth[0],
    );

    if (!session) {
      res.status(418).send({ error: 'Invalid or expired session' });
      return false;
    }

    req.user = session.user;
    (req as any).session = session;

    return true;
  }
}
