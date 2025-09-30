export interface ApiResponse<T> {
  code: string;
  message: string;
  isSuccess: boolean;
  data: T;
  headers?: Record<string, string>;
  errors?: ApiErrorResponseData[];
  metaData?: { [key: string]: any };
}

export interface ApiErrorResponseData {
  message: string;
  code?: string | number;
}
