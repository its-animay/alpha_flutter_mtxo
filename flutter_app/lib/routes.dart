import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/signup_screen.dart';
import 'screens/auth/forgot_password_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/courses_screen.dart';
import 'screens/course_detail_screen.dart';
import 'screens/lesson_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/helpdesk_screen.dart';
import 'widgets/main_layout.dart';
import 'services/auth_service.dart';
import 'package:provider/provider.dart';

class AppRouter {
  static GoRouter getRouter(BuildContext context) {
    final AuthService authService = Provider.of<AuthService>(context, listen: false);
    
    return GoRouter(
      initialLocation: '/',
      debugLogDiagnostics: true,
      redirect: (context, state) {
        final bool isLoggedIn = authService.isAuthenticated;
        final bool isGoingToAuth = state.uri.path.startsWith('/auth');
        
        // If not logged in and not going to auth page, redirect to login
        if (!isLoggedIn && !isGoingToAuth) {
          return '/auth/login';
        }
        
        // If logged in and going to auth page, redirect to home
        if (isLoggedIn && isGoingToAuth) {
          return '/';
        }
        
        // No redirect needed
        return null;
      },
      routes: [
        // Root route redirects to dashboard
        GoRoute(
          path: '/',
          redirect: (_, __) => '/dashboard',
        ),
        
        // Main layout with bottom navigation
        ShellRoute(
          builder: (context, state, child) {
            return MainLayout(child: child);
          },
          routes: [
            // Dashboard
            GoRoute(
              path: '/dashboard',
              pageBuilder: (context, state) => _buildPageTransition(
                context,
                state,
                const DashboardScreen(),
              ),
            ),
            
            // Courses
            GoRoute(
              path: '/courses',
              pageBuilder: (context, state) => _buildPageTransition(
                context,
                state,
                const CoursesScreen(),
              ),
            ),
            
            // Course Detail
            GoRoute(
              path: '/course/:courseId',
              pageBuilder: (context, state) => _buildPageTransition(
                context,
                state,
                CourseDetailScreen(courseId: state.pathParameters['courseId']!),
              ),
            ),
            
            // Lesson Screen
            GoRoute(
              path: '/course/:courseId/lesson/:lessonId',
              pageBuilder: (context, state) {
                final courseId = state.pathParameters['courseId']!;
                final lessonId = state.pathParameters['lessonId']!;
                final moduleId = state.uri.queryParameters['moduleId'];
                
                return _buildPageTransition(
                  context,
                  state,
                  LessonScreen(
                    courseId: courseId,
                    lessonId: lessonId,
                    moduleId: moduleId,
                  ),
                );
              },
            ),
            
            // Profile
            GoRoute(
              path: '/profile',
              pageBuilder: (context, state) => _buildPageTransition(
                context,
                state,
                const ProfileScreen(),
              ),
            ),
            
            // Helpdesk
            GoRoute(
              path: '/helpdesk',
              pageBuilder: (context, state) => _buildPageTransition(
                context,
                state,
                const HelpdeskScreen(),
              ),
            ),
          ],
        ),
        
        // Authentication routes
        GoRoute(
          path: '/auth/login',
          pageBuilder: (context, state) => _buildPageTransition(
            context,
            state,
            const LoginScreen(),
          ),
        ),
        
        GoRoute(
          path: '/auth/signup',
          pageBuilder: (context, state) => _buildPageTransition(
            context,
            state,
            const SignupScreen(),
          ),
        ),
        
        GoRoute(
          path: '/auth/forgot-password',
          pageBuilder: (context, state) => _buildPageTransition(
            context,
            state,
            const ForgotPasswordScreen(),
          ),
        ),
      ],
      errorPageBuilder: (context, state) {
        return _buildPageTransition(
          context,
          state,
          Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.error_outline,
                    size: 80,
                    color: Colors.red,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Page Not Found',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Could not find a page at: ${state.location}',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => context.go('/'),
                    child: const Text('Go Home'),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
  
  // Create a custom page transition
  static CustomTransitionPage _buildPageTransition(
    BuildContext context,
    GoRouterState state,
    Widget child,
  ) {
    return CustomTransitionPage(
      key: state.pageKey,
      child: child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOutCubic;
        
        var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
        var offsetAnimation = animation.drive(tween);
        
        return SlideTransition(
          position: offsetAnimation,
          child: child,
        );
      },
    );
  }
}