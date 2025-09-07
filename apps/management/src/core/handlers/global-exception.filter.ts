import { ErrorLoggerService } from '@management/modules/error-log/error-logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Catches all thrown errors in HTTP layer and converts them to safe JSON.
 * Persists the error to DB without crashing the process.
 */
@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly errors: ErrorLoggerService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttp
      ? (exception as HttpException).message
      : ((exception as any)?.message ?? 'Internal Server Error');

    const stack = (exception as any)?.stack ?? null;

    // Persist error (non-blocking for the response path)
    void this.errors.log({
      source: 'server',
      message,
      stack,
      statusCode: status,
      context: `${req.method} ${req.originalUrl}`,
      meta: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        body: sanitize(req.body),
        query: req.query,
        params: req.params,
        // add correlationId if you have one
      },
    });

    // Uniform safe response
    res.status(status).json({
      statusCode: status,
      error: isHttp
        ? ((exception as any)?.response?.error ?? 'Error')
        : 'Internal Server Error',
      message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  }
}

function sanitize(body: any) {
  if (!body) return body;
  // TODO: redact secrets or large payloads
  const clone = { ...body };
  if (clone.password) clone.password = '[redacted]';
  if (clone.token) clone.token = '[redacted]';
  return clone;
}
