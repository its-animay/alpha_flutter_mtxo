import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../services/auth/AuthContext';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  React.useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Background with animated particles/gradient effect */}
          <View style={styles.backgroundContainer}>
            <LinearGradient
              colors={isDark ? 
                ['#0f172a', '#1e293b', '#0f172a'] : 
                ['#f8fafc', '#e2e8f0', '#f8fafc']}
              style={styles.gradient}
            />
            
            {/* Animated particles would be implemented here */}
            {/* This is a simplified version for demonstration */}
            <View style={styles.particlesContainer}>
              {Array(20).fill(0).map((_, i) => (
                <View 
                  key={i}
                  style={[
                    styles.particle,
                    {
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: Math.random() * 5 + 2,
                      height: Math.random() * 5 + 2,
                      backgroundColor: theme.primary,
                      opacity: Math.random() * 0.3 + 0.1,
                    }
                  ]}
                />
              ))}
            </View>
          </View>
          
          {/* Theme toggle */}
          <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: theme.card }]} 
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Feather 
              name={isDark ? 'sun' : 'moon'} 
              size={20} 
              color={theme.text} 
            />
          </TouchableOpacity>
          
          {/* Content */}
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Logo and Title */}
            <View style={styles.logoContainer}>
              <Text style={[styles.logo, { color: theme.primary }]}>MTXO</Text>
              <Text style={[styles.logoText, { color: theme.text }]}>LABS</Text>
            </View>
            
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome back
            </Text>
            <Text style={[styles.subtitle, { color: theme.gray[500] }]}>
              Sign in to continue your learning journey
            </Text>
            
            {/* Error message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
              </View>
            ) : null}
            
            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Username or Email"
                placeholder="Enter your username or email"
                value={username}
                onChangeText={setUsername}
                leftIcon={<Feather name="user" size={18} color={theme.gray[400]} />}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                leftIcon={<Feather name="lock" size={18} color={theme.gray[400]} />}
                isPassword
                secureTextEntry
              />
              
              {/* Remember Me and Forgot Password */}
              <View style={styles.formOptions}>
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.checkbox, 
                      { 
                        backgroundColor: rememberMe ? theme.primary : 'transparent',
                        borderColor: rememberMe ? theme.primary : theme.gray[400]
                      }
                    ]}
                  >
                    {rememberMe && (
                      <Feather name="check" size={14} color="white" />
                    )}
                  </View>
                  <Text style={[styles.checkboxLabel, { color: theme.text }]}>
                    Remember me
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => navigation.navigate('ForgotPassword')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.forgotPassword, { color: theme.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Login Button */}
              <Button 
                title="Sign In" 
                onPress={handleLogin} 
                fullWidth
                isLoading={isLoading}
                style={styles.loginButton}
              />
              
              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={[styles.signupText, { color: theme.gray[500] }]}>
                  Don't have an account?
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Signup')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.signupLink, { color: theme.primary }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  formOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;