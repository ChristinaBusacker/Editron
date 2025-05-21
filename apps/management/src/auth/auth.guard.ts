import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) {
      res.status(418).send({ error: 'Session required' });
      return false;
    }

    const sessionId = auth.replace('Bearer ', '');
    const session = await this.authService.getValidSession(sessionId);

    if (!session) {
      res.status(418).send({ error: 'Invalid or expired session' });
      return false;
    }

    req.user = session.user;
    (req as any).session = session;

    return true;
  }
}
