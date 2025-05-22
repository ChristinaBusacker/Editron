import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../general/pagination.dto';

export class FilterDriversDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by name (firstname or lastname)',
  })
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by nationality' })
  nationality?: string;

  @ApiPropertyOptional({ description: 'Filter by maximum age' })
  maxAge?: number;

  @ApiPropertyOptional({ description: 'Filter by gender' })
  gender?: string;

  @ApiPropertyOptional({ description: 'Filter by perks' })
  perks?: string;

  @ApiPropertyOptional({ description: 'Filter by traits' })
  traits?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum average skillset score',
  })
  minAverageSkillset?: string;
}
