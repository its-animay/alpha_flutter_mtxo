import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';

/// A beautiful animated gradient background for the app
class AnimatedGradientBackground extends StatelessWidget {
  /// Constructor
  const AnimatedGradientBackground({
    required this.child,
    this.colors,
    super.key,
  });

  /// The child widget to display on top of the background
  final Widget child;
  
  /// Optional custom colors for the gradient
  final List<Color>? colors;

  @override
  Widget build(BuildContext context) {
    final defaultColors = [
      AppColors.primary,
      AppColors.secondary,
      AppColors.tertiary,
    ];
    
    final gradientColors = colors ?? defaultColors;
    
    return Stack(
      children: [
        // Animated background
        _AnimatedBackground(colors: gradientColors),
        
        // Floating particles
        _FloatingParticles(),
        
        // Blurred overlay for better readability
        Positioned.fill(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
            child: Container(
              color: Colors.black.withOpacity(0.2),
            ),
          ),
        ),
        
        // Child content
        child,
      ],
    );
  }
}

/// Animated gradient background
class _AnimatedBackground extends StatelessWidget {
  const _AnimatedBackground({required this.colors});
  
  final List<Color> colors;

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: colors,
          ),
        ),
      ).animate(
        onPlay: (controller) => controller.repeat(),
      ).rotate(
        duration: const Duration(seconds: 10),
        end: 0.05,
      ).then()
      .rotate(
        duration: const Duration(seconds: 10),
        end: -0.05,
      ),
    );
  }
}

/// Floating particle effect
class _FloatingParticles extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: LayoutBuilder(
        builder: (context, constraints) {
          final maxWidth = constraints.maxWidth;
          final maxHeight = constraints.maxHeight;
          
          // Create random particles
          return Stack(
            children: List.generate(
              20, // Number of particles
              (index) {
                final size = 8.0 + math.Random().nextDouble() * 12;
                final opacity = 0.1 + math.Random().nextDouble() * 0.2;
                final initialX = math.Random().nextDouble() * maxWidth;
                final initialY = math.Random().nextDouble() * maxHeight;
                
                // Movement animation
                return Positioned(
                  left: initialX,
                  top: initialY,
                  child: Container(
                    width: size,
                    height: size,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(opacity),
                      shape: BoxShape.circle,
                    ),
                  ).animate(
                    onPlay: (controller) => controller.repeat(),
                  )
                  .moveY(
                    duration: Duration(seconds: 2 + index % 4),
                    begin: 0,
                    end: 20 + (math.Random().nextDouble() * 30),
                    curve: Curves.easeInOut,
                  ).then()
                  .moveY(
                    duration: Duration(seconds: 2 + index % 3),
                    begin: 20 + (math.Random().nextDouble() * 30),
                    end: 0,
                    curve: Curves.easeInOut,
                  )
                  .fadeIn(duration: const Duration(seconds: 1))
                  .blurXY(end: 2),
                );
              },
            ),
          );
        },
      ),
    );
  }
}