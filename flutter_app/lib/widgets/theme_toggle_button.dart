import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/theme_service.dart';

/// A widget that toggles between light and dark theme modes
class ThemeToggleButton extends StatelessWidget {
  final Color? iconColor;
  final double size;
  
  const ThemeToggleButton({
    this.iconColor,
    this.size = 24.0,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);
    final isDark = themeService.isDarkMode;
    
    return InkWell(
      borderRadius: BorderRadius.circular(50),
      onTap: () => themeService.toggleTheme(),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Theme.of(context).brightness == Brightness.dark
              ? Colors.grey[800]?.withOpacity(0.5)
              : Colors.grey[200]?.withOpacity(0.5),
        ),
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return RotationTransition(
              turns: animation,
              child: ScaleTransition(
                scale: animation,
                child: child,
              ),
            );
          },
          child: Icon(
            isDark ? Icons.light_mode : Icons.dark_mode,
            key: ValueKey<bool>(isDark),
            color: iconColor ?? Theme.of(context).iconTheme.color,
            size: size,
          ),
        ),
      ),
    );
  }
}