/**
 * Data Layer - API Client Interface
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface IApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
  timeout?: number;
}
