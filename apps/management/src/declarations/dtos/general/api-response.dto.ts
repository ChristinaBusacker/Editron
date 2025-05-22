import { ApiResponseProperty } from '@nestjs/swagger';
import { ApiResponse } from '@shared';

export class ApiResponseDto<T> implements ApiResponse<T> {
  @ApiResponseProperty({
    example: [],
  })
  data: T;

  @ApiResponseProperty({
    example: [],
  })
  errors?: Array<Error>;
}
