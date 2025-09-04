import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DatabaseService } from '@database/database.service';

import {
  HeatMapRow,
  PublicStatsResponseDto,
  CountBucketDto,
  ListStatsResponseDto,
  ListStatsItemDto,
  MetricsDto,
} from './dto/public-stats.dto';
import { PublicLogFilters, isoOrDefault } from './public-log-filters';
import { PublicApiRequestLogEntity } from '@database/public-api-request-logger/public-api-request-logger.entity';

function weekdayLabel(dow: number): string {
  const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  return map[dow] ?? String(dow);
}

@Injectable()
export class PublicApiStatsService {
  private repo: Repository<PublicApiRequestLogEntity>;
  constructor(private readonly db: DatabaseService) {}

  /** Apply WHERE clauses based on filters */
  private applyFilters(
    qb: SelectQueryBuilder<PublicApiRequestLogEntity>,
    f: PublicLogFilters,
    fromIso: string,
    toIso: string,
  ) {
    qb.where('l.occurredAt >= :from AND l.occurredAt < :to', {
      from: fromIso,
      to: toIso,
    });

    if (f.projectId && f.projectId !== 'all') {
      qb.andWhere('l.projectId = :pid', { pid: f.projectId });
    }
    if (f.routes?.length) {
      qb.andWhere('l.route IN (:...routes)', { routes: f.routes });
    }
    if (f.methods?.length) {
      qb.andWhere('l.method IN (:...methods)', { methods: f.methods });
    }
    if (f.statusCodes?.length) {
      qb.andWhere('l.statusCode IN (:...codes)', { codes: f.statusCodes });
    }
    if (f.origins?.length) {
      qb.andWhere('l.origin IN (:...origins)', { origins: f.origins });
    }
    if (f.ips?.length) {
      qb.andWhere('l.ip IN (:...ips)', { ips: f.ips });
    }
    if (typeof f.ok === 'boolean') {
      qb.andWhere('l.ok = :ok', { ok: f.ok });
    }
    if (f.languages?.length) {
      qb.andWhere('l.language IN (:...langs)', { langs: f.languages });
    }
    if (f.pathLike) {
      qb.andWhere('l.path ILIKE :plike', { plike: `%${f.pathLike}%` });
    }
    if (f.userAgentLike) {
      qb.andWhere('l.userAgent ILIKE :ualike', {
        ualike: `%${f.userAgentLike}%`,
      });
    }
    if (Number.isFinite(f.minDurationMs)) {
      qb.andWhere('l.durationMs >= :minDur', { minDur: f.minDurationMs });
    }
    if (Number.isFinite(f.maxDurationMs)) {
      qb.andWhere('l.durationMs <= :maxDur', { maxDur: f.maxDurationMs });
    }
    if (Number.isFinite(f.minResponseBytes)) {
      qb.andWhere('l.responseBytes >= :minBytes', {
        minBytes: f.minResponseBytes,
      });
    }
    if (Number.isFinite(f.maxResponseBytes)) {
      qb.andWhere('l.responseBytes <= :maxBytes', {
        maxBytes: f.maxResponseBytes,
      });
    }
    if (f.contentEncodings?.length) {
      qb.andWhere('l.contentEncoding IN (:...enc)', {
        enc: f.contentEncodings,
      });
    }
    if (f.controllers?.length) {
      qb.andWhere('l.controller IN (:...ctrl)', { ctrl: f.controllers });
    }
    if (f.handlers?.length) {
      qb.andWhere('l.handler IN (:...h)', { h: f.handlers });
    }
    if (f.requestId) {
      qb.andWhere('l.requestId = :rid', { rid: f.requestId });
    }
  }

  /** Compute P95 from a limited sample (fast approx) */
  private async approximateP95(
    qbBase: SelectQueryBuilder<PublicApiRequestLogEntity>,
  ): Promise<number | null> {
    const sample = await qbBase
      .clone()
      .select('l.durationMs', 'd')
      .orderBy('l.durationMs', 'ASC')
      .limit(1000)
      .getRawMany<{ d: string }>();
    if (!sample.length) return null;
    const idx = Math.floor(0.95 * (sample.length - 1));
    return Number(sample[idx].d) || 0;
  }

  private mapBucket(
    rows: { key: string | null; count: string }[],
  ): CountBucketDto[] {
    return rows
      .filter(r => r.key != null)
      .map(r => ({ key: String(r.key), count: Number(r.count) || 0 }));
  }

  /** Stats with heatmap + buckets + metrics */
  async getStats(
    filters: PublicLogFilters & { top?: number },
  ): Promise<PublicStatsResponseDto> {
    const fromIso = isoOrDefault(filters.fromIso, -30 * 24 * 60 * 60 * 1000);
    const toIso = isoOrDefault(filters.toIso, 0);
    const top = Math.max(1, Math.min(500, filters.top ?? 50));

    // Heatmap (Mon-first)
    const heatQb = this.db.publicApiRequestLog.createQueryBuilder('l');
    this.applyFilters(heatQb, filters, fromIso, toIso);
    const heatRaw = await heatQb
      .select('EXTRACT(DOW FROM l.occurredAt)', 'dow')
      .addSelect('EXTRACT(HOUR FROM l.occurredAt)', 'hour')
      .addSelect('COUNT(*)', 'count')
      .groupBy('1,2')
      .getRawMany<{ dow: string; hour: string; count: string }>();

    const dowOrderPg = [1, 2, 3, 4, 5, 6, 0];
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const idx = new Map<string, number>();
    for (const r of heatRaw)
      idx.set(`${r.dow}-${r.hour}`, Number(r.count) || 0);

    const heatmap: HeatMapRow[] = dowOrderPg.map(dow => ({
      name: weekdayLabel(dow),
      series: hours.map(h => ({
        name: h.toString().padStart(2, '0'),
        value: idx.get(`${dow}-${h}`) ?? 0,
      })),
    }));

    // Routes
    const routesQb = this.db.publicApiRequestLog.createQueryBuilder('l');
    this.applyFilters(routesQb, filters, fromIso, toIso);
    const routes = this.mapBucket(
      await routesQb
        .select('l.route', 'key')
        .addSelect('COUNT(*)', 'count')
        .groupBy('l.route')
        .orderBy('COUNT(*)', 'DESC')
        .limit(top)
        .getRawMany(),
    );

    // Statuses
    const statusQb = this.db.publicApiRequestLog.createQueryBuilder('l');
    this.applyFilters(statusQb, filters, fromIso, toIso);
    const statuses = this.mapBucket(
      await statusQb
        .select('CAST(l.statusCode AS text)', 'key')
        .addSelect('COUNT(*)', 'count')
        .groupBy('l.statusCode')
        .orderBy('l.statusCode', 'ASC')
        .getRawMany(),
    );

    // Origins
    const originQb = this.db.publicApiRequestLog.createQueryBuilder('l');
    const origins = this.mapBucket(
      await originQb
        .select('l.origin', 'key')
        .addSelect('COUNT(*)', 'count')
        .where(qb => {
          this.applyFilters(qb, filters, fromIso, toIso);
          return '';
        })
        .groupBy('l.origin')
        .orderBy('COUNT(*)', 'DESC')
        .limit(top)
        .getRawMany(),
    );

    // Methods
    const methodQb = this.db.publicApiRequestLog.createQueryBuilder('l');
    this.applyFilters(methodQb, filters, fromIso, toIso);
    const methods = this.mapBucket(
      await methodQb
        .select('l.method', 'key')
        .addSelect('COUNT(*)', 'count')
        .groupBy('l.method')
        .orderBy('COUNT(*)', 'DESC')
        .getRawMany(),
    );

    // Metrics (total/ok/error/avg/p95/avgBytes)
    const baseQb = this.db.publicApiRequestLog.createQueryBuilder('l');
    this.applyFilters(baseQb, filters, fromIso, toIso);

    const { total, ok } = (await baseQb
      .clone()
      .select('COUNT(*)::int', 'total')
      .addSelect(`SUM(CASE WHEN l.ok THEN 1 ELSE 0 END)::int`, 'ok')
      .getRawOne<{ total: string; ok: string }>()) ?? { total: '0', ok: '0' };

    const { avgDur } = (await baseQb
      .clone()
      .select('AVG(l.durationMs)', 'avgDur')
      .getRawOne<{ avgDur: string }>()) ?? { avgDur: null as any };

    const { avgBytes } = (await baseQb
      .clone()
      .select('AVG(l.responseBytes)', 'avgBytes')
      .getRawOne<{ avgBytes: string }>()) ?? { avgBytes: null as any };

    const p95 = await this.approximateP95(baseQb);

    const metrics: MetricsDto = {
      total: Number(total) || 0,
      ok: Number(ok) || 0,
      error: Math.max(0, (Number(total) || 0) - (Number(ok) || 0)),
      avgDurationMs: avgDur != null ? Math.round(Number(avgDur)) : null,
      p95DurationMs: p95 != null ? Math.round(p95) : null,
      avgResponseBytes: avgBytes != null ? Math.round(Number(avgBytes)) : null,
    };

    return {
      heatmap,
      buckets: { routes, statuses, origins, methods },
      metrics,
      range: { from: fromIso, to: toIso },
    };
  }

  /** Paginated raw list with the same filters */
  async listStats(
    filters: PublicLogFilters & {
      page?: number;
      limit?: number;
      orderBy?: keyof PublicApiRequestLogEntity;
      orderDir?: 'ASC' | 'DESC';
    },
  ): Promise<ListStatsResponseDto> {
    const fromIso = isoOrDefault(filters.fromIso, -7 * 24 * 60 * 60 * 1000);
    const toIso = isoOrDefault(filters.toIso, 0);
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.max(1, Math.min(500, filters.limit ?? 100));
    const offset = (page - 1) * limit;

    const qb = this.db.publicApiRequestLog.createQueryBuilder('l');
    this.applyFilters(qb, filters, fromIso, toIso);

    const orderBy = (filters.orderBy ?? 'occurredAt') as string;
    const orderDir = filters.orderDir ?? 'DESC';
    qb.orderBy(`l.${orderBy}`, orderDir).offset(offset).limit(limit);

    const [rows, total] = await qb.getManyAndCount();

    const items: ListStatsItemDto[] = rows.map(r => ({
      id: r.id,
      occurredAt: r.occurredAt.toISOString(),
      method: r.method,
      route: r.route,
      path: r.path,
      statusCode: r.statusCode,
      durationMs: r.durationMs,
      origin: r.origin ?? null,
      referer: r.referer ?? null,
      language: r.language ?? null,
      apiTokenId: r.apiTokenId ?? null,
      projectId: r.projectId ?? null,
      ip: r.ip ?? null,
      userAgent: r.userAgent ?? null,
      responseContentLength: r.responseContentLength ?? null,
      responseBytes: r.responseBytes ?? null,
      contentEncoding: r.contentEncoding ?? null,
      cacheControl: r.cacheControl ?? null,
      ok: r.ok,
      controller: r.controller ?? null,
      handler: r.handler ?? null,
      requestId: r.requestId ?? null,
    }));

    return { items, page, limit, total, range: { from: fromIso, to: toIso } };
  }
}
