import { ApiResponseDto } from '@management/declarations/dtos/general/api-response.dto';

export function createApiResponse<T>(data: T, errors?: Array<Error>) {
  const response: ApiResponseDto<T> = {
    data,
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
}
