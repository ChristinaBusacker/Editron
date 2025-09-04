import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import type { Request, Response } from 'express';

import { LANGUAGE_HEADER } from '@shared/constants/i18n.constants';
import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import { randomUUID } from 'crypto';
import { PublicApiRequestLoggerService } from '../public-api-request-logger.service';

function nowMs() {
  return typeof performance !== 'undefined' && performance.now
    ? performance.now()
    : Date.now();
}

function toIntOrNull(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function envBool(name: string, dflt: boolean) {
  const v = process.env[name];
  if (v == null) return dflt;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

@Injectable()
export class PublicApiLoggingInterceptor implements NestInterceptor {
  private readonly attachRequestId = envBool(
    'PUBLIC_API_LOGGING_ATTACH_REQUEST_ID',
    true,
  );
  private readonly measureSocketBytes = envBool(
    'PUBLIC_API_LOGGING_MEASURE_SOCKET_BYTES',
    true,
  );

  constructor(private readonly reqLogger: PublicApiRequestLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request & { apiToken?: ApiTokenEntity }>();
    const res = ctx.getResponse<Response>();

    const start = nowMs();
    const socket = res.socket;
    const startBytes = this.measureSocketBytes
      ? (socket?.bytesWritten ?? 0)
      : null;

    // Correlation / request id
    let requestId =
      (req.headers['x-request-id'] as string) ||
      (req.headers['x-correlation-id'] as string) ||
      null;
    if (!requestId && this.attachRequestId) {
      requestId = randomUUID();
      res.setHeader('x-request-id', requestId);
    }

    const method = req.method;
    const path = req.originalUrl || req.url || '';
    const routeTemplate =
      (req as any)?.route?.path ??
      `${context.getClass().name}.${context.getHandler().name}`;
    const controller = context.getClass().name ?? null;
    const handler = context.getHandler().name ?? null;

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.socket.remoteAddress ?? null);
    const userAgent = (req.headers['user-agent'] as string) ?? null;
    const referer = (req.headers['referer'] as string) ?? null;
    const origin = (req.headers['origin'] as string) ?? null;

    const languageHeaderRaw = (req.headers as any)?.[LANGUAGE_HEADER];
    const language =
      (Array.isArray(languageHeaderRaw)
        ? languageHeaderRaw[0]
        : languageHeaderRaw) ?? null;

    const token = (req as any).apiToken as ApiTokenEntity | undefined;
    const apiTokenId = token?.id ?? null;
    const projectId =
      (token as any)?.project?.id ?? (token as any)?.projectId ?? null;

    const reqContentLength = toIntOrNull(
      req.headers['content-length'] as string | undefined,
    );

    const routeParams =
      req.params && Object.keys(req.params).length ? { ...req.params } : null;
    const redactedQuery =
      req.query && Object.keys(req.query).length
        ? JSON.parse(JSON.stringify(req.query))
        : null;

    let statusCode = 200;
    let errorName: string | null = null;
    let errorMessage: string | null = null;

    return next.handle().pipe(
      tap({
        next: () => {
          statusCode = res.statusCode || 200;
        },
      }),
      catchError(err => {
        statusCode = (err?.status as number) || 500;
        errorName = err?.name ? String(err.name).slice(0, 128) : 'Error';
        // Avoid logging huge messages
        errorMessage = err?.message ? String(err.message).slice(0, 1024) : null;
        return throwError(() => err);
      }),
      finalize(() => {
        const durationMs = Math.max(0, Math.round(nowMs() - start));
        const contentLengthHeader = res.getHeader('content-length');
        const contentLength = toIntOrNull(
          contentLengthHeader as string | number | undefined,
        );
        const contentEncoding = res.getHeader('content-encoding');
        const etag = res.getHeader('etag');
        const cacheControl = res.getHeader('cache-control');

        let responseBytes: number | null = null;
        if (this.measureSocketBytes && socket) {
          const endBytes = socket.bytesWritten ?? 0;
          responseBytes = Math.max(0, endBytes - (startBytes ?? endBytes));
        }

        this.reqLogger.enqueue({
          occurredAt: new Date(),
          method,
          route: routeTemplate,
          path,
          statusCode,
          durationMs,
          apiTokenId,
          projectId,
          ip: ip ?? null,
          userAgent: userAgent ? String(userAgent).slice(0, 1024) : null,
          language: language ? String(language).slice(0, 64) : null,
          query: redactedQuery,

          // new fields
          responseContentLength: contentLength,
          responseBytes,
          contentEncoding: contentEncoding ? String(contentEncoding) : null,
          etag: etag ? String(etag) : null,
          cacheControl: cacheControl ? String(cacheControl) : null,
          requestContentLength: reqContentLength,
          referer: referer ?? null,
          origin: origin ?? null,
          routeParams,
          controller,
          handler,
          ok: statusCode < 400,
          errorName,
          errorMessage,
          requestId,
        });
      }),
    );
  }
}
