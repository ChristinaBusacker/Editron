import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListErrorsQuery {
  @ApiPropertyOptional({
    enum: ['server', 'client'],
    description: 'Filter by error source',
  })
  @IsOptional()
  @IsIn(['server', 'client'])
  source?: 'server' | 'client';

  @ApiPropertyOptional({
    description: 'Full-text search across message/context (ILIKE)',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Page number, 1-based',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 200,
    default: 50,
    description: 'Items per page',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  limit: number = 50;
}
