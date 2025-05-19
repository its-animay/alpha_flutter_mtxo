import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mtxo_labs_edtech/screens/auth/login_screen.dart';
import 'package:mtxo_labs_edtech/screens/auth/signup_screen.dart';
import 'package:mtxo_labs_edtech/screens/auth/forgot_password_screen.dart';
import 'package:mtxo_labs_edtech/screens/dashboard_screen.dart';
import 'package:mtxo_labs_edtech/screens/courses_screen.dart';
import 'package:mtxo_labs_edtech/screens/course_detail_screen.dart';
import 'package:mtxo_labs_edtech/screens/lesson_screen.dart';
import 'package:mtxo_labs_edtech/screens/module_quiz_screen.dart';
import 'package:mtxo_labs_edtech/screens/profile_screen.dart';
import 'package:mtxo_labs_edtech/screens/helpdesk_screen.dart';
import 'package:mtxo_labs_edtech/screens/chat_screen.dart';
import 'package:mtxo_labs_edtech/screens/checkout_screen.dart';
import 'package:mtxo_labs_edtech/screens/course_success_screen.dart';
import 'package:mtxo_labs_edtech/services/auth_service.dart';
import 'package:mtxo_labs_edtech/navigation/scaffold_with_nav_bar.dart';

// Create the router configuration
GoRouter createRouter(AuthService authService) {
  return GoRouter(
    initialLocation: '/',
    // Refresh the router when auth state changes
    refreshListenable: authService,
    redirect: (context, state) {
      // Check if the user is authenticated
      final isAuthenticated = authService.isAuthenticated;
      final isAuthenticating = state.matchedLocation.startsWith('/auth');
      
      // If not authenticated and not on an auth page, redirect to login
      if (!isAuthenticated && !isAuthenticating) {
        return '/auth/login';
      }
      
      // If authenticated and on an auth page, redirect to dashboard
      if (isAuthenticated && isAuthenticating) {
        return '/dashboard';
      }
      
      // No redirect needed
      return null;
    },
    routes: [
      // Auth routes
      GoRoute(
        path: '/auth/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/signup',
        name: 'signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/auth/forgot-password',
        name: 'forgotPassword',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      
      // Authenticated routes with Bottom Navigation
      ShellRoute(
        builder: (context, state, child) {
          return ScaffoldWithNavBar(child: child);
        },
        routes: [
          // Dashboard
          GoRoute(
            path: '/',
            redirect: (_, __) => '/dashboard',
          ),
          GoRoute(
            path: '/dashboard',
            name: 'dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          
          // Courses
          GoRoute(
            path: '/courses',
            name: 'courses',
            builder: (context, state) => const CoursesScreen(),
          ),
          
          // Profile
          GoRoute(
            path: '/profile',
            name: 'profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          
          // Helpdesk
          GoRoute(
            path: '/helpdesk',
            name: 'helpdesk',
            builder: (context, state) => const HelpdeskScreen(),
          ),
        ],
      ),
      
      // Course Detail (outside bottom nav)
      GoRoute(
        path: '/course/:courseId',
        name: 'courseDetail',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId'] ?? '';
          return CourseDetailScreen(courseId: courseId);
        },
      ),
      
      // Course Lesson (outside bottom nav)
      GoRoute(
        path: '/course/:courseId/lesson/:lessonId',
        name: 'lesson',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId'] ?? '';
          final lessonId = state.pathParameters['lessonId'] ?? '';
          final moduleId = state.queryParameters['moduleId'];
          return LessonScreen(
            courseId: courseId, 
            lessonId: lessonId,
            moduleId: moduleId,
          );
        },
      ),
      
      // Module Quiz (outside bottom nav)
      GoRoute(
        path: '/course/:courseId/module/:moduleId/quiz',
        name: 'moduleQuiz',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId'] ?? '';
          final moduleId = state.pathParameters['moduleId'] ?? '';
          return ModuleQuizScreen(courseId: courseId, moduleId: moduleId);
        },
      ),
      
      // Chat (outside bottom nav)
      GoRoute(
        path: '/chat/:conversationId',
        name: 'chat',
        builder: (context, state) {
          final conversationId = state.pathParameters['conversationId'] ?? '';
          return ChatScreen(conversationId: conversationId);
        },
      ),
      
      // Checkout (outside bottom nav)
      GoRoute(
        path: '/checkout/:courseId',
        name: 'checkout',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId'] ?? '';
          return CheckoutScreen(courseId: courseId);
        },
      ),
      
      // Course Success (outside bottom nav)
      GoRoute(
        path: '/course/:courseId/success',
        name: 'courseSuccess',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId'] ?? '';
          return CourseSuccessScreen(courseId: courseId);
        },
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.uri}'),
      ),
    ),
  );
}