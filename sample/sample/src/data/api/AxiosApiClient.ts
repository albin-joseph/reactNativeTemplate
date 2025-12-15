/**
 * Data Layer - Axios API Client Implementation
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IApiClient, ApiResponse, RequestConfig } from './IApiClient';
import { config } from '../../core/config/env';

export class AxiosApiClient implements IApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL?: string, timeout?: number) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || config.apiBaseUrl,
      timeout: timeout || config.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (requestConfig) => {
        // Add auth token or other headers here
        if (config.enableLogging) {
          console.log(`[API Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
        }
        return requestConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (config.enableLogging) {
          console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        if (config.enableLogging) {
          console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  private mapConfig(requestConfig?: RequestConfig): AxiosRequestConfig {
    return {
      headers: requestConfig?.headers,
      params: requestConfig?.params,
      signal: requestConfig?.signal,
      timeout: requestConfig?.timeout,
    };
  }

  async get<T>(url: string, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, this.mapConfig(requestConfig));
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T>(url: string, data?: any, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, this.mapConfig(requestConfig));
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T>(url: string, data?: any, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, this.mapConfig(requestConfig));
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T>(url: string, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, this.mapConfig(requestConfig));
    return {
      data: response.data,
      status: response.status,
    };
  }
}
