import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';

class MainLayout extends StatefulWidget {
  final Widget child;

  const MainLayout({
    required this.child,
    super.key,
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;
  
  final List<_NavigationItem> _navigationItems = [
    _NavigationItem(
      path: '/dashboard',
      label: 'Dashboard',
      icon: Icons.dashboard_outlined,
      activeIcon: Icons.dashboard,
    ),
    _NavigationItem(
      path: '/courses',
      label: 'Courses',
      icon: Icons.menu_book_outlined,
      activeIcon: Icons.menu_book,
    ),
    _NavigationItem(
      path: '/profile',
      label: 'Profile',
      icon: Icons.person_outline,
      activeIcon: Icons.person,
    ),
    _NavigationItem(
      path: '/helpdesk',
      label: 'Help',
      icon: Icons.support_agent_outlined,
      activeIcon: Icons.support_agent,
    ),
  ];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _updateSelectedIndex();
  }

  void _updateSelectedIndex() {
    final location = GoRouterState.of(context).location;
    
    // Find the matching navigation item for the current path
    int index = _navigationItems.indexWhere(
      (item) => location.startsWith(item.path),
    );
    
    // Default to dashboard if no match
    if (index == -1) {
      index = 0;
    }
    
    if (index != _currentIndex) {
      setState(() {
        _currentIndex = index;
      });
    }
  }

  void _onItemTapped(int index) {
    final item = _navigationItems[index];
    context.go(item.path);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: _onItemTapped,
            type: BottomNavigationBarType.fixed,
            backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
            selectedItemColor: theme.colorScheme.primary,
            unselectedItemColor: theme.colorScheme.onSurface.withOpacity(0.6),
            selectedLabelStyle: AppTextStyles.caption.copyWith(
              fontWeight: FontWeight.bold,
            ),
            unselectedLabelStyle: AppTextStyles.caption.copyWith(
              fontWeight: FontWeight.normal,
            ),
            elevation: 0,
            items: _navigationItems.map((item) {
              return BottomNavigationBarItem(
                icon: Icon(item.icon),
                activeIcon: Icon(item.activeIcon),
                label: item.label,
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}

class _NavigationItem {
  final String path;
  final String label;
  final IconData icon;
  final IconData activeIcon;

  const _NavigationItem({
    required this.path,
    required this.label,
    required this.icon,
    required this.activeIcon,
  });
}