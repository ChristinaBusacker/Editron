import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ErrorLogDto } from './error-log.dto';

@ApiExtraModels(ErrorLogDto)
export class PaginatedErrorLogsDto {
  @ApiProperty({ type: [ErrorLogDto] }) items!: ErrorLogDto[];
  @ApiProperty({ example: 123 }) total!: number;
  @ApiProperty({ example: 1 }) page!: number;
  @ApiProperty({ example: 50 }) limit!: number;
}
