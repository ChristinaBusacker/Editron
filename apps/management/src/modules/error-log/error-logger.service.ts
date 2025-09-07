import { DatabaseService } from '@database/database.service';
import { ErrorSource } from '@database/error-log/error-log.entity';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Writes errors to DB in a non-blocking way.
 * In production consider adding a queue (e.g., BullMQ) if write volume is high.
 */
@Injectable()
export class ErrorLoggerService {
  private readonly logger = new Logger(ErrorLoggerService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async log(opts: {
    source: ErrorSource;
    message: string;
    stack?: string | null;
    context?: string | null;
    statusCode?: number | null;
    meta?: Record<string, any> | null;
  }): Promise<void> {
    // Best effort: never throw from here
    try {
      const row = this.databaseService.errorLogRepository.create({
        source: opts.source,
        message: opts.message,
        stack: opts.stack ?? null,
        context: opts.context ?? null,
        statusCode: opts.statusCode ?? null,
        meta: opts.meta ?? null,
      });
      await this.databaseService.errorLogRepository.save(row);
    } catch (e) {
      this.logger.error('Failed to persist error log', e as any);
    }
  }
}
