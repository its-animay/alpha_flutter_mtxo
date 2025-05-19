import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/services/auth/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
    },
  },
});

export default function App() {
  // In a real app, you would get this from environment variables or a config service
  const STRIPE_PUBLIC_KEY = 'pk_test_yourStripePublicKey';

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
              <NavigationContainer>
                <AppNavigator />
                <StatusBar style="auto" />
              </NavigationContainer>
            </StripeProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}