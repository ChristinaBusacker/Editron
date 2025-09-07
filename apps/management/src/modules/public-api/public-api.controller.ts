import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { API_KEY_HEADER } from '@shared/constants/api-key.constant';
import { LANGUAGE_HEADER } from '@shared/constants/i18n.constants';

import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import { PublicApiService } from './public-api.service';
import { PublicApiLoggingInterceptor } from './interceptors/public-api-logging.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import {
  ListStatsResponseDto,
  PublicStatsResponseDto,
} from './dto/public-stats.dto';
import {
  parseBool,
  parseCsv,
  parseIntCsv,
} from './request-logger/public-log-filters';
import { ApiReadAccess } from '@management/core/decorators/permission.decorator';
import { PublicApiStatsService } from './stats/public-api-stats.service';

function buildFilters(projectId: string, q: any) {
  return {
    projectId,
    fromIso: q.from,
    toIso: q.to,
    routes: parseCsv(q.route),
    methods: parseCsv(q.method),
    statusCodes: parseIntCsv(q.status),
    origins: parseCsv(q.origin),
    ips: parseCsv(q.ip),
    ok: parseBool(q.ok),
    languages: parseCsv(q.language),
    pathLike: q.pathLike,
    userAgentLike: q.userAgentLike,
    minDurationMs:
      q.minDurationMs != null ? Number(q.minDurationMs) : undefined,
    maxDurationMs:
      q.maxDurationMs != null ? Number(q.maxDurationMs) : undefined,
    minResponseBytes: q.minBytes != null ? Number(q.minBytes) : undefined,
    maxResponseBytes: q.maxBytes != null ? Number(q.maxBytes) : undefined,
    contentEncodings: parseCsv(q.contentEncoding),
    controllers: parseCsv(q.controller),
    handlers: parseCsv(q.handler),
    requestId: q.requestId,
  } as const;
}

export class StatsQueryDoc {} // (optional) Keep Swagger slim by listing the main ones below

export class ListQueryDoc {} // same

@ApiTags('Public API')
@Controller('public')
@UseInterceptors(PublicApiLoggingInterceptor)
@ApiHeader({
  name: API_KEY_HEADER,
  description: 'Authentication token for the request',
  required: true,
})
@ApiHeader({
  name: LANGUAGE_HEADER,
  description:
    'Preferred language (e.g., "de-DE"). Falls back to project settings.defaultLanguage.',
  required: false,
})
export class PublicApiController {
  constructor(
    private readonly publicApi: PublicApiService,
    private readonly stats: PublicApiStatsService,
  ) {}

  private resolveLang(req: Request & { apiToken?: ApiTokenEntity }) {
    const token = (req as any).apiToken as ApiTokenEntity;
    const headerLangRaw = (req.headers as any)?.[LANGUAGE_HEADER];
    const headerLang = Array.isArray(headerLangRaw)
      ? headerLangRaw[0]
      : headerLangRaw;
    const lang =
      typeof headerLang === 'string' && headerLang.trim()
        ? headerLang.trim()
        : null;

    const fallbackLang =
      (token as any)?.project?.settings?.defaultLanguage &&
      String((token as any).project.settings.defaultLanguage).trim()
        ? String((token as any).project.settings.defaultLanguage).trim()
        : null;

    return { lang, fallbackLang, token };
  }

  @Get('list/:moduleSlug')
  @ApiReadAccess()
  @ApiOperation({
    summary:
      'List all published entries for a module (project-scoped, flattened & localized)',
  })
  @ApiParam({ name: 'moduleSlug', type: String })
  @ApiResponse({ status: 200, description: 'Array of flat, localized entries' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  async listByModule(
    @Param('moduleSlug') moduleSlug: string,
    @Req() req: Request & { apiToken?: ApiTokenEntity },
  ) {
    const { lang, fallbackLang, token } = this.resolveLang(req);
    return this.publicApi.listPublishedByModule(
      moduleSlug,
      token,
      lang,
      fallbackLang,
    );
  }

  @Get('get/:moduleSlug/:fieldName/:value')
  @ApiReadAccess()
  @ApiOperation({
    summary:
      'Get a single published entry for a module by a field/value pair (e.g., id=xyz or slug=imprint). Flattened & localized.',
  })
  @ApiParam({ name: 'moduleSlug', type: String })
  @ApiParam({ name: 'fieldName', type: String })
  @ApiParam({ name: 'value', type: String })
  @ApiResponse({ status: 200, description: 'Flat, localized entry' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getByField(
    @Param('moduleSlug') moduleSlug: string,
    @Param('fieldName') fieldName: string,
    @Param('value') value: string,
    @Req() req: Request & { apiToken?: ApiTokenEntity },
  ) {
    const { lang, fallbackLang, token } = this.resolveLang(req);
    return this.publicApi.getPublishedByField(
      moduleSlug,
      fieldName,
      value,
      token,
      lang,
      fallbackLang,
    );
  }

  @Get(':projectId/stats')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      'Aggregated request stats with filters (heatmap + buckets + metrics)',
  })
  @ApiParam({ name: 'projectId', description: 'Project ID or "all"' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({
    name: 'route',
    required: false,
    description: 'CSV of route templates',
  })
  @ApiQuery({
    name: 'method',
    required: false,
    description: 'CSV of HTTP methods',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'CSV of status codes',
  })
  @ApiQuery({ name: 'origin', required: false, description: 'CSV of origins' })
  @ApiQuery({ name: 'ip', required: false, description: 'CSV of ip addresses' })
  @ApiQuery({ name: 'ok', required: false, description: 'true/false' })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'CSV of language headers',
  })
  @ApiQuery({
    name: 'pathLike',
    required: false,
    description: 'ILIKE filter for path',
  })
  @ApiQuery({
    name: 'userAgentLike',
    required: false,
    description: 'ILIKE filter for UA',
  })
  @ApiQuery({ name: 'minDurationMs', required: false })
  @ApiQuery({ name: 'maxDurationMs', required: false })
  @ApiQuery({ name: 'minBytes', required: false })
  @ApiQuery({ name: 'maxBytes', required: false })
  @ApiQuery({
    name: 'contentEncoding',
    required: false,
    description: 'CSV (gzip,br,...)',
  })
  @ApiQuery({
    name: 'controller',
    required: false,
    description: 'CSV controller names',
  })
  @ApiQuery({
    name: 'handler',
    required: false,
    description: 'CSV handler names',
  })
  @ApiQuery({ name: 'requestId', required: false })
  @ApiQuery({
    name: 'top',
    required: false,
    description: 'Bucket size (default 50, max 500)',
  })
  @ApiResponse({ status: 200, type: PublicStatsResponseDto })
  async getStats(
    @Param('projectId') projectId: string,
    @Query() q: any,
  ): Promise<PublicStatsResponseDto> {
    const f = buildFilters(projectId, q);
    return this.stats.getStats({
      ...f,
      top: q.top ? Number(q.top) : undefined,
    });
  }

  @Get(':projectId/stats/list')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Paginated raw logs with the same filters' })
  @ApiParam({ name: 'projectId', description: 'Project ID or "all"' })
  @ApiQuery({ name: 'page', required: false, description: 'Default 1' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Default 100, max 500',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Column (occurredAt default)',
  })
  @ApiQuery({
    name: 'orderDir',
    required: false,
    description: 'ASC|DESC (DESC default)',
  })
  // (reuse all filter queries from getStats)
  @ApiResponse({ status: 200, type: ListStatsResponseDto })
  async listStats(
    @Param('projectId') projectId: string,
    @Query() q: any,
  ): Promise<ListStatsResponseDto> {
    const f = buildFilters(projectId, q);
    return this.stats.listStats({
      ...f,
      page: q.page ? Number(q.page) : undefined,
      limit: q.limit ? Number(q.limit) : undefined,
      orderBy: q.orderBy,
      orderDir: q.orderDir === 'ASC' ? 'ASC' : 'DESC',
    });
  }
}
