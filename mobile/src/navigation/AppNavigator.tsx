import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../services/auth/AuthContext';
import { useTheme } from '../theme/ThemeProvider';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CoursesScreen from '../screens/courses/CoursesScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import LessonScreen from '../screens/courses/LessonScreen';
import ModuleQuizScreen from '../screens/courses/ModuleQuizScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HelpdeskScreen from '../screens/helpdesk/HelpdeskScreen';
import ChatScreen from '../screens/helpdesk/ChatScreen';
import CheckoutScreen from '../screens/payments/CheckoutScreen';
import CourseSuccessScreen from '../screens/payments/CourseSuccessScreen';

// Define parameter types for navigation
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Lesson: { courseId: string; moduleId: string; lessonId: string };
  Quiz: { courseId: string; moduleId: string };
  CourseDetail: { courseId: string };
  Checkout: { courseId: string; planType: 'one-time' | 'monthly' | 'yearly' };
  CourseSuccess: { courseId: string };
  Chat: { conversationId: number };
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Courses: undefined;
  Helpdesk: undefined;
  Profile: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
const AuthNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.primary,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'MTXO Labs',
          headerShown: false,
        }} 
      />
      <AuthStack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ 
          title: 'Create Account',
        }} 
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ 
          title: 'Reset Password',
        }} 
      />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <MainTab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.gray[400],
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 5,
        },
      }}
    >
      <MainTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          title: 'Dashboard',
        }}
      />
      <MainTab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
          title: 'Courses',
        }}
      />
      <MainTab.Screen
        name="Helpdesk"
        component={HelpdeskScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
          title: 'Solve with Prof',
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
          title: 'Profile',
        }}
      />
    </MainTab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  // Show loading screen while checking authentication
  if (isLoading) {
    return null; // Or a splash screen component
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.primary,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ headerShown: false }} 
        />
      ) : (
        <>
          <Stack.Screen 
            name="Main" 
            component={MainNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Lesson" 
            component={LessonScreen} 
            options={{ 
              title: '', // Will be set dynamically
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="Quiz" 
            component={ModuleQuizScreen} 
            options={{ 
              title: 'Module Quiz',
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="CourseDetail" 
            component={CourseDetailScreen} 
            options={{ 
              title: '', // Will be set dynamically
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen} 
            options={{ 
              title: 'Complete Purchase',
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="CourseSuccess" 
            component={CourseSuccessScreen} 
            options={{ 
              title: 'Enrollment Complete',
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={{ 
              title: '', // Will be set dynamically
              headerBackTitleVisible: false,
            }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;