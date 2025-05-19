import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Scaffold with bottom navigation bar that works with GoRouter
class ScaffoldWithNavBar extends StatelessWidget {
  /// Constructor
  const ScaffoldWithNavBar({
    required this.child,
    super.key,
  });

  /// The child widget
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _calculateSelectedIndex(context),
        onTap: (index) => _onItemTapped(index, context),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book_outlined),
            activeIcon: Icon(Icons.menu_book),
            label: 'Courses',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline),
            activeIcon: Icon(Icons.chat_bubble),
            label: 'Helpdesk',
          ),
        ],
      ),
    );
  }

  /// Calculate the selected index based on the current route
  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).matchedLocation;
    
    if (location.startsWith('/dashboard')) {
      return 0;
    }
    if (location.startsWith('/courses')) {
      return 1;
    }
    if (location.startsWith('/profile')) {
      return 2;
    }
    if (location.startsWith('/helpdesk')) {
      return 3;
    }
    
    // Default to dashboard tab
    return 0;
  }

  /// Handle bottom navigation item tap
  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        GoRouter.of(context).go('/dashboard');
        break;
      case 1:
        GoRouter.of(context).go('/courses');
        break;
      case 2:
        GoRouter.of(context).go('/profile');
        break;
      case 3:
        GoRouter.of(context).go('/helpdesk');
        break;
    }
  }
}