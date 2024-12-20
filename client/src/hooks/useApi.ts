import { useState, useCallback } from 'react';
import request from '@/utils/request';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

interface UseApiConfig<T, R = any> extends Omit<AxiosRequestConfig, 'url'> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  transform?: (data: R) => T;
}

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export const useApi = <T, R = any>(url: string, config: UseApiConfig<T, R> = {}) => {
  const { onSuccess, onError, transform, ...axiosConfig } = config;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  // 执行请求
  const execute = useCallback(
    async (data?: any) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response: AxiosResponse<ApiResponse<R>> = await request({
          url,
          ...axiosConfig,
          ...(data ? { data } : {}),
        });

        const transformedData = transform ? transform(response.data.data) : (response.data.data as unknown as T);
        setState((prev) => ({
          ...prev,
          data: transformedData,
          isLoading: false,
        }));

        onSuccess?.(transformedData);
        return transformedData;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          error: errorObj,
          isLoading: false,
        }));

        onError?.(errorObj);
        throw errorObj;
      }
    },
    [url, axiosConfig, transform, onSuccess, onError]
  );

  // 重置状态
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

// 创建GET请求hook
export const useGet = <T, R = any>(url: string, config: UseApiConfig<T, R> = {}) =>
  useApi<T, R>(url, { method: 'GET', ...config });

// 创建POST请求hook
export const usePost = <T, R = any>(url: string, config: UseApiConfig<T, R> = {}) =>
  useApi<T, R>(url, { method: 'POST', ...config });

// 创建PUT请求hook
export const usePut = <T, R = any>(url: string, config: UseApiConfig<T, R> = {}) =>
  useApi<T, R>(url, { method: 'PUT', ...config });

// 创建DELETE请求hook
export const useDelete = <T, R = any>(url: string, config: UseApiConfig<T, R> = {}) =>
  useApi<T, R>(url, { method: 'DELETE', ...config });

// 创建PATCH请求hook
export const usePatch = <T, R = any>(url: string, config: UseApiConfig<T, R> = {}) =>
  useApi<T, R>(url, { method: 'PATCH', ...config }); 