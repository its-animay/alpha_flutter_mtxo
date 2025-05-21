import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';
import 'mtxo_logo.dart';
import 'theme_toggle_button.dart';

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
    final location = GoRouterState.of(context).uri.path;
    
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
      // AppBar with logo and theme toggle
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: _buildLogo(),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: _buildThemeToggle(),
          ),
        ],
      ),
      extendBodyBehindAppBar: true,
      
      // Main content
      body: SafeArea(
        child: Column(
          children: [
            // Content area
            Expanded(child: widget.child),
          ],
        ),
      ),
      
      // Bottom navigation bar
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
  
  // Build the logo widget
  Widget _buildLogo() {
    // Import the MTXOLogo at the top of the file
    // Adding the import here in the comment as a reminder:
    // import '../widgets/mtxo_logo.dart';
    return const MTXOLogo(
      size: 36.0,
      withText: true,
    );
  }
  
  // Build the theme toggle widget
  Widget _buildThemeToggle() {
    // Import the ThemeToggleButton at the top of the file
    // Adding the import here in the comment as a reminder:
    // import '../widgets/theme_toggle_button.dart';
    return const ThemeToggleButton();
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