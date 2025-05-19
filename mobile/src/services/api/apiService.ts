import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMock, API_BASE_URL } from './config';
import { mockUsers, mockCourses, mockEnrollments, 
         mockSubscriptions, mockConversations } from './mockData';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: useMock ? '' : API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle different error statuses (401, 403, 404, 500, etc.)
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        // If token expired or invalid, clear local storage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        // Navigation will be handled by auth state change in AuthContext
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Makes an API request either to the real API or fetches mock data
 * @param endpoint - API endpoint path
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param data - Request data for POST, PUT requests
 * @param config - Additional axios request config
 * @returns Promise with response data
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response;
    
    if (useMock) {
      // Handle mock data requests
      if (method !== 'GET') {
        console.log(`[MOCK API] ${method} ${endpoint}`, data);
        // For non-GET requests, just return success response with the data
        return {
          success: true,
          data: data || {},
          ...getMockResponseData(endpoint)
        } as unknown as T;
      }
      
      // For GET requests, load mock data
      const mockData = loadMockData(endpoint);
      return mockData as T;
    } else {
      // Handle real API requests
      switch (method) {
        case 'GET':
          response = await axiosInstance.get(endpoint, config);
          break;
        case 'POST':
          response = await axiosInstance.post(endpoint, data, config);
          break;
        case 'PUT':
          response = await axiosInstance.put(endpoint, data, config);
          break;
        case 'DELETE':
          response = await axiosInstance.delete(endpoint, {
            ...config,
            data,
          });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    }
  } catch (error) {
    console.error(`API Request Error: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Load mock data 
 * @param endpoint API endpoint
 * @returns Mock data
 */
function loadMockData(endpoint: string): any {
  const mockFileName = getMockFileNameFromEndpoint(endpoint);
  
  // Return mock data based on endpoint
  switch (mockFileName) {
    case 'users.json':
      return mockUsers;
    case 'courses.json':
      return mockCourses;
    case 'enrollments.json':
      return mockEnrollments;
    case 'subscriptions.json':
      return mockSubscriptions;
    case 'conversations.json':
      return mockConversations;
    default:
      return { error: 'Mock data not found' };
  }
}

/**
 * Maps API endpoints to mock JSON file names
 * @param endpoint API endpoint
 * @returns Filename for the mock data
 */
function getMockFileNameFromEndpoint(endpoint: string): string {
  // Extract ID from endpoints with IDs like /users/123 -> /users/:id
  const normalizedEndpoint = endpoint.replace(/\/[0-9]+(\/.+)?$/, '/:id$1');
  
  // Map endpoint patterns to mock file paths
  const endpointMap: Record<string, string> = {
    // User endpoints
    '/users/profile': 'users.json',
    '/users': 'users.json',
    '/users/:id': 'users.json',
    
    // Course endpoints
    '/courses': 'courses.json',
    '/courses/:id': 'courses.json',
    '/courses/popular': 'courses.json',
    '/courses/featured': 'courses.json',
    '/courses/recommendations': 'courses.json',
    
    // Enrollment endpoints
    '/enrollments': 'enrollments.json',
    '/enrollments/:id/progress': 'enrollments.json',
    
    // Subscription endpoints
    '/subscriptions': 'subscriptions.json',
    '/subscriptions/:id': 'subscriptions.json',
    '/subscriptions/:id/cancel': 'subscriptions.json',
    
    // Payment endpoints - no mock data available for payment intents
    '/payments/history': 'subscriptions.json', // Reuse subscription data for payment history
    
    // Conversation endpoints
    '/conversations': 'conversations.json',
    '/conversations/:id': 'conversations.json',
    '/conversations/:id/messages': 'conversations.json',
  };
  
  return endpointMap[normalizedEndpoint] || 'error.json';
}

/**
 * Process responses for non-GET endpoints in mock mode
 * @param endpoint API endpoint
 * @returns Appropriate mock response data
 */
function getMockResponseData(endpoint: string): any {
  // Handle specific endpoints for mock responses
  if (endpoint.startsWith('/auth/login')) {
    return {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
      }
    };
  }
  
  if (endpoint.startsWith('/auth/signup')) {
    return {
      success: true,
      message: 'User registered successfully',
    };
  }
  
  if (endpoint.startsWith('/auth/forgot-password')) {
    return {
      success: true,
      message: 'Password reset email sent',
    };
  }
  
  // Default response for other endpoints
  return {
    success: true,
    message: 'Operation completed successfully',
  };
}

/**
 * Upload a file to the server
 * @param uri File URI
 * @param type File type
 * @param name File name
 * @param endpoint API endpoint
 * @returns Upload response
 */
export const uploadFile = async (
  uri: string, 
  type: string, 
  name: string, 
  endpoint: string
): Promise<any> => {
  if (useMock) {
    // Return mock response for file upload
    return {
      success: true,
      fileUrl: uri,
      fileName: name,
      fileType: type,
    };
  }
  
  const formData = new FormData();
  formData.append('file', {
    uri,
    type,
    name,
  } as any);
  
  try {
    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('File upload error', error);
    throw error;
  }
};

export default apiRequest;