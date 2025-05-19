import apiRequest from './apiService';
import { API_ENDPOINTS } from './config';

// Types for User API service
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  role?: string;
  preferences?: {
    darkMode?: boolean;
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  preferences?: User['preferences'];
}

/**
 * User Service for authentication and profile management
 */
const UserService = {
  /**
   * Login user
   * @param credentials Login credentials
   * @returns Login response with token and user
   */
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiRequest(API_ENDPOINTS.AUTH.LOGIN, 'POST', credentials);
  },
  
  /**
   * Register new user
   * @param userData New user data
   * @returns Registration result
   */
  signup: (userData: SignupRequest): Promise<{success: boolean, message: string}> => {
    return apiRequest(API_ENDPOINTS.AUTH.SIGNUP, 'POST', userData);
  },
  
  /**
   * Request password reset
   * @param email User email
   * @returns Result of password reset request
   */
  forgotPassword: (email: string): Promise<{success: boolean, message: string}> => {
    return apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, 'POST', { email });
  },
  
  /**
   * Reset password with token
   * @param token Reset token
   * @param newPassword New password
   * @returns Result of password reset
   */
  resetPassword: (token: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    return apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, 'POST', { token, newPassword });
  },
  
  /**
   * Get current user profile
   * @returns User profile data
   */
  getProfile: (): Promise<User> => {
    return apiRequest(API_ENDPOINTS.USERS.GET_PROFILE);
  },
  
  /**
   * Update user profile
   * @param userData Updated user data
   * @returns Updated user profile
   */
  updateProfile: (userData: ProfileUpdateRequest): Promise<User> => {
    return apiRequest(API_ENDPOINTS.USERS.UPDATE_PROFILE, 'PUT', userData);
  },
  
  /**
   * Get user by ID
   * @param id User ID
   * @returns User data
   */
  getUser: (id: number): Promise<User> => {
    return apiRequest(API_ENDPOINTS.USERS.GET_USER(id));
  }
};

export default UserService;