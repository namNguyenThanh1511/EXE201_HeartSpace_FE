export interface ApiResponse<T> {
  code: string;
  message: string;
  isSuccess: boolean;
  data: T;
  headers?: Record<string, string>;
  errors?: ApiErrorResponseData[];
}

export interface ApiErrorResponseData {
  message: string;
  code?: string | number;
  field?: string;
}
