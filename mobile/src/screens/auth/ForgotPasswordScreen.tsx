import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../services/auth/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';

type ForgotPasswordScreenProps = {
  navigation: StackNavigationProp<any>;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { forgotPassword } = useAuth();
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  // Handle password reset request
  const handleResetPassword = async () => {
    // Clear previous error
    setError(null);
    
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await forgotPassword(email);
      
      if (success) {
        setIsSubmitted(true);
      } else {
        Alert.alert(
          'Request Failed',
          'Unable to process your request. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        
        <View style={styles.formContainer}>
          {!isSubmitted ? (
            <>
              <Text style={[styles.title, { color: theme.primary }]}>
                Reset Password
              </Text>
              
              <Text style={[styles.description, { color: theme.text }]}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                      color: theme.text,
                      borderColor: error ? theme.danger : theme.border
                    }
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.gray[500]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {error && (
                  <Text style={[styles.errorText, { color: theme.danger }]}>
                    {error}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.primary }]}
                onPress={handleResetPassword}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={[styles.title, { color: theme.primary }]}>
                Check Your Email
              </Text>
              
              <Text style={[styles.description, { color: theme.text }]}>
                We've sent instructions to reset your password to:
              </Text>
              
              <Text style={[styles.emailText, { color: theme.text }]}>
                {email}
              </Text>
              
              <Text style={[styles.description, { color: theme.text, marginTop: 20 }]}>
                Please check your email and follow the instructions to reset your password.
              </Text>
              
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.primary, marginTop: 30 }]}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.submitButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {!isSubmitted && (
            <TouchableOpacity 
              style={styles.backToLoginLink}
              onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.backToLoginText, { color: theme.primary }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginLink: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default ForgotPasswordScreen;