import { ApiResponseProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';
import { PaginatedResponse } from '@shared';

export class PaginatedResponseDto<T>
  extends ApiResponseDto<T>
  implements PaginatedResponse<T>
{
  @ApiResponseProperty({
    example: 20,
  })
  limit: number;

  @ApiResponseProperty({
    example: 1,
  })
  page: number;

  @ApiResponseProperty({
    example: 50,
  })
  total: number;
}
