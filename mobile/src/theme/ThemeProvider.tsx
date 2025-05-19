import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  primary: '#6366f1',
  background: '#ffffff',
  card: '#f8f9fa',
  text: '#1e293b',
  border: '#e2e8f0',
  notification: '#ef4444',
  secondary: '#8b5cf6',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#0ea5e9',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  glass: 'rgba(255, 255, 255, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  primary: '#818cf8',
  background: '#0f172a',
  card: '#1e293b',
  text: '#e2e8f0',
  border: '#334155',
  notification: '#ef4444',
  secondary: '#a78bfa',
  accent: '#60a5fa',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#38bdf8',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  glass: 'rgba(15, 23, 42, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.5)',
};

// Create theme context
type ThemeContextType = {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };

    loadThemePreference();
  }, []);

  // Toggle theme function
  const toggleTheme = async () => {
    try {
      const newThemeValue = !isDark;
      setIsDark(newThemeValue);
      await AsyncStorage.setItem('themePreference', newThemeValue ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  // Get current theme object
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};