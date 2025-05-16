/**
 * API Configuration
 * 
 * This file contains the configuration for the API service.
 * Toggle between mock and real API by changing the useMock flag.
 */

// Set to true to use mock data, false to use real API
export const useMock = true;

// Base URL for the real API (when useMock is false)
export const API_BASE_URL = 'https://api.mtxolabs.com';

// Base path for mock data files
export const MOCK_BASE_PATH = '/mock';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // User endpoints
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GET_USER: (id: number) => `/users/${id}`,
    GET_ALL: '/users',
  },
  
  // Course endpoints
  COURSES: {
    GET_ALL: '/courses',
    GET_COURSE: (id: string) => `/courses/${id}`,
    GET_POPULAR: '/courses/popular',
    GET_FEATURED: '/courses/featured',
    GET_RECOMMENDATIONS: '/courses/recommendations',
  },
  
  // Enrollment endpoints
  ENROLLMENTS: {
    GET_USER_ENROLLMENTS: '/enrollments',
    ENROLL: '/enrollments',
    UPDATE_PROGRESS: (id: number) => `/enrollments/${id}/progress`,
  },
  
  // Subscription endpoints
  SUBSCRIPTIONS: {
    GET_USER_SUBSCRIPTION: '/subscriptions',
    CREATE: '/subscriptions',
    UPDATE: (id: number) => `/subscriptions/${id}`,
    CANCEL: (id: number) => `/subscriptions/${id}/cancel`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    CREATE_PAYMENT_INTENT: '/payments/create-intent',
    CREATE_SUBSCRIPTION: '/payments/create-subscription',
    GET_PAYMENT_HISTORY: '/payments/history',
  },
  
  // Chat/Helpdesk endpoints
  CONVERSATIONS: {
    GET_ALL: '/conversations',
    GET_CONVERSATION: (id: number) => `/conversations/${id}`,
    CREATE: '/conversations',
    SEND_MESSAGE: (id: number) => `/conversations/${id}/messages`,
    GET_MESSAGES: (id: number) => `/conversations/${id}/messages`,
  }
};