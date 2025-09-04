import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { DatabaseService } from '@database/database.service';
import { PublicApiRequestLogEntity } from '@database/public-api-request-logger/public-api-request-logger.entity';

type LogRecord = Omit<PublicApiRequestLogEntity, 'id' | 'occurredAt'> & {
  occurredAt?: Date;
};

function envNum(name: string, dflt: number): number {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : dflt;
}

function envBool(name: string, dflt: boolean): boolean {
  const v = process.env[name];
  if (v == null) return dflt;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

@Injectable()
export class PublicApiRequestLoggerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PublicApiRequestLoggerService.name);

  private buffer: LogRecord[] = [];
  private timer?: NodeJS.Timeout;

  // Tunables (ENV overrideable)
  private readonly enabled = envBool('PUBLIC_API_LOGGING_ENABLED', true);
  private readonly sampleRate = Math.min(
    Math.max(Number(process.env.PUBLIC_API_LOGGING_SAMPLE_RATE ?? '1'), 0),
    1,
  );
  private readonly flushIntervalMs = envNum(
    'PUBLIC_API_LOGGING_FLUSH_INTERVAL_MS',
    1000,
  );
  private readonly batchMax = envNum('PUBLIC_API_LOGGING_BATCH_MAX', 100);

  constructor(private readonly databaseService: DatabaseService) {}

  onModuleInit() {
    if (this.enabled) {
      this.timer = setInterval(
        () => this.flush().catch(() => undefined),
        this.flushIntervalMs,
      );
      this.timer.unref?.(); // do not keep process alive
    }
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
    // Best effort sync flush
    return this.flush();
  }

  /** Fire-and-forget enqueue; no await on request path. */
  enqueue(rec: LogRecord) {
    if (!this.enabled) return;
    if (this.sampleRate < 1 && Math.random() > this.sampleRate) return;

    rec.occurredAt = rec.occurredAt ?? new Date();

    this.buffer.push(rec);
    if (this.buffer.length >= this.batchMax) {
      // Flush in background
      this.flush().catch(err =>
        this.logger.warn(`Flush error: ${err?.message ?? err}`),
      );
    }
  }

  private async flush() {
    if (!this.enabled) return;
    if (this.buffer.length === 0) return;

    const batch = this.buffer.splice(0, this.batchMax);
    try {
      await this.databaseService.publicApiRequestLog
        .createQueryBuilder()
        .insert()
        .into(PublicApiRequestLogEntity)
        .values(batch)
        .execute();
    } catch (err) {
      // Drop on floor to protect hot path; optionally requeue if desired
      this.logger.warn(
        `Failed to persist ${batch.length} public API logs: ${err?.message ?? err}`,
      );
    }
  }
}
