import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page starting with 1 for the query',
    default: 1,
  })
  page?: string;

  @ApiPropertyOptional({
    description: 'How much results should be shown for each page',
    default: 20,
  })
  limit?: string;
}
