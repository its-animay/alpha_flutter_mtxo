import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../services/auth/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HelpdeskScreen from '../screens/HelpdeskScreen';

// Define the type for route parameters
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CourseDetail: { courseId: string };
  Lesson: { courseId: string; lessonId: string };
};

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type MainTabParamList = {
  Dashboard: undefined;
  Courses: undefined;
  Profile: undefined;
  Helpdesk: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth navigator component
const AuthNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: theme.background,
        },
      }}>
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Sign In' }}
      />
      <AuthStack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ title: 'Create Account' }}
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ title: 'Reset Password' }}
      />
    </AuthStack.Navigator>
  );
};

// Main app tabs navigator
const MainTabNavigator = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Helpdesk') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.gray[500],
        tabBarStyle: {
          backgroundColor: isDark ? theme.card : theme.background,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <MainTab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'My Learning' }}
      />
      <MainTab.Screen 
        name="Courses" 
        component={CoursesScreen} 
        options={{ title: 'Explore Courses' }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <MainTab.Screen 
        name="Helpdesk" 
        component={HelpdeskScreen} 
        options={{ title: 'Solve with Prof' }}
      />
    </MainTab.Navigator>
  );
};

// Main app navigator that handles auth state
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  
  if (isLoading) {
    // Return a loading screen here
    return null;
  }
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
      }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="CourseDetail" 
            component={CourseDetailScreen}
            options={{ 
              headerShown: true,
              title: 'Course Details',
              headerStyle: {
                backgroundColor: theme.primary,
              },
              headerTintColor: '#ffffff',
            }}
          />
          <Stack.Screen 
            name="Lesson" 
            component={LessonScreen}
            options={{ 
              headerShown: true,
              title: 'Lesson',
              headerStyle: {
                backgroundColor: theme.primary,
              },
              headerTintColor: '#ffffff',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;