import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import { DatabaseService } from '@database/database.service';
import { ApiKeyOnly } from '@management/core/decorators/permission.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../auth/auth.guard';
import { ClientErrorDto } from './dto/client-error.dto';
import { ErrorLogDto } from './dto/error-log.dto';
import { ListErrorsQuery } from './dto/list-errors-query.dto';
import { PaginatedErrorLogsDto } from './dto/paginated-error-logs.dto';
import { ErrorLoggerService } from './error-logger.service';

@ApiTags('Error Logs')
@Controller('error')
export class ErrorLoggerController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly errorService: ErrorLoggerService,
  ) {}

  /**
   * Lists persisted error logs with optional filters (source, free-text).
   * @summary Paginated error log listing (admin)
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('BearerAuth')
  @ApiOperation({
    summary: 'List error logs',
    description:
      'Returns a paginated list of error logs. ' +
      'Use `source` to filter by origin (`server`/`client`) and `q` to search in message/context.',
  })
  @ApiQuery({ name: 'source', required: false, enum: ['server', 'client'] })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'ILIKE search across message/context',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { default: 1, minimum: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 50, minimum: 1, maximum: 200 },
  })
  @ApiOkResponse({
    description: 'Paginated error logs',
    type: PaginatedErrorLogsDto,
  })
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  async list(@Query() q: ListErrorsQuery): Promise<PaginatedErrorLogsDto> {
    const page = Math.max(1, Number(q.page ?? 1));
    const take = Math.min(200, Math.max(1, Number(q.limit ?? 50)));

    const qb = this.databaseService.errorLogRepository
      .createQueryBuilder('el')
      .orderBy('el.createdAt', 'DESC')
      .addOrderBy('el.id', 'DESC')
      .skip((page - 1) * take)
      .take(take);

    if (q.source) qb.andWhere('el.source = :source', { source: q.source });
    if (q.q)
      qb.andWhere('(el.message ILIKE :q OR el.context ILIKE :q)', {
        q: `%${q.q}%`,
      });

    const [items, total] = await qb.getManyAndCount();

    // Optional: mappe auf DTO falls nötig
    const mapped: ErrorLogDto[] = items.map((e) => ({
      id: e.id,
      source: e.source as any,
      context: (e as any).context ?? null,
      statusCode: (e as any).statusCode ?? null,
      message: e.message as any,
      stack: (e as any).stack ?? null,
      meta: (e as any).meta ?? null,
      createdAt: (e as any).createdAt,
    }));

    return { items: mapped, total, page, limit: take };
  }

  /**
   * Returns a single error log by ID.
   * @summary Get error log detail (admin)
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('BearerAuth')
  @ApiOperation({ summary: 'Get error log by id' })
  @ApiParam({ name: 'id', description: 'Error log UUID', format: 'uuid' })
  @ApiOkResponse({ description: 'Single error log', type: ErrorLogDto })
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  async get(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ErrorLogDto> {
    const e = await this.databaseService.errorLogRepository.findOneOrFail({
      where: { id },
    });
    return {
      id: e.id,
      source: e.source as any,
      context: (e as any).context ?? null,
      statusCode: (e as any).statusCode ?? null,
      message: e.message as any,
      stack: (e as any).stack ?? null,
      meta: (e as any).meta ?? null,
      createdAt: (e as any).createdAt,
    };
  }

  /**
   * Ingests a client-side error report.
   * Uses API key authentication; errors are stored asynchronously.
   * @summary Report client error (public ingestion)
   */
  @Post()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Report client error',
    description:
      'Accepts error reports from client applications. ' +
      'Requires a valid project API key in the `x-api-key` header.',
  })
  @ApiBody({
    type: ClientErrorDto,
    examples: {
      basic: {
        summary: 'Minimal example',
        value: {
          message: 'TypeError: Cannot read properties of undefined',
          context: 'https://app.customer-a.com/dashboard',
          origin: 'https://app.customer-a.com',
        },
      },
      withStack: {
        summary: 'With stack and metadata',
        value: {
          message: 'Error: Unexpected token < in JSON at position 0',
          stack: 'Error: Unexpected token < ...',
          context: 'https://app.customer-b.com/settings',
          origin: 'https://app.customer-b.com',
          meta: { userAgent: 'Mozilla/5.0', feature: 'billing' },
        },
      },
    },
  })
  @ApiNoContentResponse({ description: 'Client error accepted' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async report(@Body() dto: ClientErrorDto): Promise<void> {
    await this.errorService.log({
      source: 'client',
      message: dto.message,
      stack: dto.stack ?? null,
      context: dto.context ?? null,
      meta: {
        ...dto.meta,
        origin: dto.origin, // where the frontend lives
      },
    });
  }
}
