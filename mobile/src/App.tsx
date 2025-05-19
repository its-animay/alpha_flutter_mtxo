import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';

import ThemeProvider from './theme/ThemeProvider';
import AuthProvider from './services/auth/AuthContext';
import AppNavigator from './navigation/AppNavigator';

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

const App = () => {
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
              </NavigationContainer>
            </StripeProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;