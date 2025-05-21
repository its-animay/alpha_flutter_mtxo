import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/theme_service.dart';

/// A card with glassmorphic effect
class GlassmorphicCard extends StatelessWidget {
  /// Child widget to render inside the card
  final Widget child;
  
  /// Padding around the child
  final EdgeInsetsGeometry padding;
  
  /// Border radius of the card
  final BorderRadius borderRadius;
  
  /// Whether to apply blur effect
  final bool applyBlur;
  
  /// Blur intensity
  final double blur;
  
  /// Border opacity
  final double borderOpacity;
  
  /// Background opacity
  final double backgroundOpacity;
  
  /// Creates a glassmorphic card
  const GlassmorphicCard({
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.borderRadius = const BorderRadius.all(Radius.circular(16)),
    this.applyBlur = true,
    this.blur = 10,
    this.borderOpacity = 0.1,
    this.backgroundOpacity = 0.2,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);
    final isDarkMode = themeService.isDarkMode;
    final theme = Theme.of(context);
    
    return ClipRRect(
      borderRadius: borderRadius,
      child: BackdropFilter(
        filter: applyBlur
            ? ImageFilter.blur(sigmaX: blur, sigmaY: blur)
            : ImageFilter.blur(sigmaX: 0, sigmaY: 0),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            color: isDarkMode
                ? theme.cardColor.withOpacity(backgroundOpacity)
                : Colors.white.withOpacity(backgroundOpacity + 0.5),
            borderRadius: borderRadius,
            border: Border.all(
              color: isDarkMode
                  ? Colors.white.withOpacity(borderOpacity)
                  : Colors.white.withOpacity(borderOpacity + 0.5),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: isDarkMode
                    ? Colors.black.withOpacity(0.2)
                    : Colors.black.withOpacity(0.05),
                blurRadius: 8,
                spreadRadius: 2,
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}