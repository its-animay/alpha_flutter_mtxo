import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../services/auth/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';

type SignupScreenProps = {
  navigation: StackNavigationProp<any>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const { theme, isDark } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Update form data
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      
      if (success) {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully. Please log in.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert(
          'Registration Failed',
          'Failed to create your account. Please try again.',
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
        
        <Text style={[styles.header, { color: theme.primary }]}>
          Create Account
        </Text>
        <Text style={[styles.subheader, { color: theme.text }]}>
          Join MTXO Labs to access our cutting-edge courses
        </Text>

        <View style={styles.formContainer}>
          {/* Username field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Username</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                  color: theme.text,
                  borderColor: errors.username ? theme.danger : theme.border
                }
              ]}
              placeholder="Choose a username"
              placeholderTextColor={theme.gray[500]}
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
              autoCapitalize="none"
            />
            {errors.username && (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.username}
              </Text>
            )}
          </View>

          {/* Email field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                  color: theme.text,
                  borderColor: errors.email ? theme.danger : theme.border
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={theme.gray[500]}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Full Name field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                  color: theme.text,
                  borderColor: errors.fullName ? theme.danger : theme.border
                }
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={theme.gray[500]}
              value={formData.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
            />
            {errors.fullName && (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.fullName}
              </Text>
            )}
          </View>

          {/* Password field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                  color: theme.text,
                  borderColor: errors.password ? theme.danger : theme.border
                }
              ]}
              placeholder="Create a password"
              placeholderTextColor={theme.gray[500]}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
            />
            {errors.password && (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                  color: theme.text,
                  borderColor: errors.confirmPassword ? theme.danger : theme.border
                }
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={theme.gray[500]}
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.signupButton, { backgroundColor: theme.primary }]}
            onPress={handleSignup}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.text }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 16,
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
    marginTop: 4,
  },
  signupButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;