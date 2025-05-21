import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/theme_service.dart';
import '../theme/app_theme.dart';

/// A fancy floating theme toggle button that's more prominent
class FloatingThemeToggle extends StatelessWidget {
  const FloatingThemeToggle({super.key});

  @override
  Widget build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);
    final isDark = themeService.isDarkMode;
    final theme = Theme.of(context);
    
    return GestureDetector(
      onTap: () {
        themeService.toggleTheme();
        // Show a snackbar to indicate theme change
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isDark ? 'Light theme activated' : 'Dark theme activated',
              style: const TextStyle(color: Colors.white),
            ),
            backgroundColor: theme.colorScheme.secondary.withOpacity(0.8),
            duration: const Duration(seconds: 1),
            behavior: SnackBarBehavior.floating,
          ),
        );
      },
      child: Container(
        width: 80,
        height: 40,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          color: theme.brightness == Brightness.dark
              ? Colors.grey[800]?.withOpacity(0.5)
              : Colors.grey[200]?.withOpacity(0.8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 5,
              spreadRadius: 1,
            ),
          ],
          border: Border.all(
            color: theme.brightness == Brightness.dark
                ? Colors.grey[700]!
                : Colors.white,
            width: 1,
          ),
        ),
        child: Stack(
          children: [
            // Track
            Container(
              margin: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                color: theme.brightness == Brightness.dark
                    ? theme.colorScheme.surface
                    : Colors.grey[300],
              ),
            ),
            
            // Sliding thumb with icon
            AnimatedPositioned(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeInOut,
              left: isDark ? 40 : 0,
              top: 0,
              bottom: 0,
              width: 40,
              child: Container(
                margin: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      isDark ? const Color(0xFF8C46FF) : const Color(0xFFFFC107),
                      isDark ? const Color(0xFF6A35C2) : const Color(0xFFFF9800),
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: isDark ? Colors.black26 : Colors.black12,
                      blurRadius: 4,
                      spreadRadius: 0,
                    ),
                  ],
                ),
                child: Center(
                  child: Icon(
                    isDark ? Icons.nightlight_round : Icons.wb_sunny,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}