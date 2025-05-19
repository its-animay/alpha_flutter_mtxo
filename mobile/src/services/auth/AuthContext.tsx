import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserService } from '../api';

// Define user type
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  role?: string;
}

// Authentication context type
type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: { username: string; email: string; password: string; fullName: string }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  forgotPassword: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          }
        }
      } catch (error) {
        console.error('Failed to restore authentication state', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await UserService.login({ username, password });
      
      // Save auth state
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setToken(response.token);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear stored auth state
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      // Reset state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: { username: string; email: string; password: string; fullName: string }) => {
    try {
      setIsLoading(true);
      await UserService.signup(userData);
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Password recovery function
  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await UserService.forgotPassword(email);
      return true;
    } catch (error) {
      console.error('Password recovery failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        register,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};