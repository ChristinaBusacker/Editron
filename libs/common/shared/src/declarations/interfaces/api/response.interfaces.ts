export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  limit: number;
  page: number;
  total: number;
}
