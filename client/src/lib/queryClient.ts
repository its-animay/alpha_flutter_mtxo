import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useMock, API_BASE_URL } from './api/config';
import apiRequest from './api/apiService';

// Create a type-safe wrapper around our apiRequest for React Query
export async function queryRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest<T>(endpoint, method, data, config);
}

// Legacy wrapper for compatibility with existing code
export async function legacyApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  try {
    const response = await queryRequest(
      url,
      method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      data
    );
    
    // Create a Response-like object for compatibility
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response))
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Create a Response-like object for error cases
    return {
      ok: false,
      status: axiosError.response?.status || 500,
      statusText: axiosError.message,
      json: () => Promise.reject(error),
      text: () => Promise.resolve(axiosError.message)
    };
  }
}

// For backward compatibility
export { legacyApiRequest as apiRequest };

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // Extract endpoint from queryKey and use our API service
      const endpoint = queryKey[0] as string;
      const response = await queryRequest<T>(endpoint);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (unauthorizedBehavior === "returnNull" && axiosError.response?.status === 401) {
        return null;
      }
      
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
