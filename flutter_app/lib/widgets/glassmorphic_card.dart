import 'package:flutter/material.dart';
import 'dart:ui';
import '../theme/app_theme.dart';

/// A card with a glassmorphic effect that matches the web app exactly
class GlassmorphicCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final BorderRadius? borderRadius;
  final double? width;
  final double? height;
  final Color? borderColor;
  final double borderWidth;
  final double blurAmount;
  
  const GlassmorphicCard({
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.borderRadius,
    this.width,
    this.height,
    this.borderColor,
    this.borderWidth = 1.0,
    this.blurAmount = 10.0,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final theme = Theme.of(context);
    
    // Get appropriate colors for the current theme
    final backgroundColor = isDark 
        ? AppColors.darkSurface.withOpacity(0.5) // 225 16% 17% / 0.5 - dark card
        : Colors.white.withOpacity(0.7);         // bg-white/70 - light card
    
    final border = isDark
        ? borderColor ?? Colors.grey[800]!.withOpacity(0.5) // border-gray-800/50
        : borderColor ?? Colors.white.withOpacity(0.5);     // border-white/50
    
    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: blurAmount,
          sigmaY: blurAmount,
        ),
        child: Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: borderRadius ?? BorderRadius.circular(16),
            border: Border.all(
              color: border,
              width: borderWidth,
            ),
            boxShadow: isDark
              ? [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
          ),
          padding: padding,
          child: child,
        ),
      ),
    );
  }
}