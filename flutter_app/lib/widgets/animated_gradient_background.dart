import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'dart:ui';
import '../theme/app_theme.dart';

/// A widget that displays an animated gradient background.
/// This creates a futuristic, dynamic background effect for the app.
class AnimatedGradientBackground extends StatefulWidget {
  final Widget child;
  final bool useCircularGradient;
  final List<Color>? colors;
  final Duration duration;

  const AnimatedGradientBackground({
    required this.child,
    this.useCircularGradient = false,
    this.colors,
    this.duration = const Duration(seconds: 10),
    super.key,
  });

  @override
  State<AnimatedGradientBackground> createState() => _AnimatedGradientBackgroundState();
}

class _AnimatedGradientBackgroundState extends State<AnimatedGradientBackground> with TickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;
  
  // Default colors if not provided
  final List<Color> _defaultColors = [
    AppColors.gradientStart,
    AppColors.gradientMiddle,
    AppColors.gradientEnd,
    AppColors.secondary,
    AppColors.tertiary.withOpacity(0.8),
  ];
  
  @override
  void initState() {
    super.initState();
    
    // Set up the animation controller
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    )..repeat();
    
    // Create a curved animation
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  /// Build a gradient that matches the web app exactly
  Gradient _buildWebAppBackground(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    if (isDark) {
      // Dark mode - solid dark blue with subtle radial overlay
      return const RadialGradient(
        center: Alignment(0.1, -0.3),
        radius: 1.2,
        colors: [
          Color(0xFF1E2539), // slightly lighter shade
          Color(0xFF191E2C), // base dark background
          Color(0xFF151A27), // slightly darker shade
        ],
        stops: [0.0, 0.5, 1.0],
      );
    } else {
      // Light mode - soft gradient from top-left to bottom-right
      return const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Color(0xFFEDF5FF), // light-bg-start: 220 100% 98%
          Color(0xFFE1EDFE), // light-bg-end: 217 93% 94%
        ],
        stops: [0.0, 1.0],
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: _buildWebAppBackground(context),
      ),
      child: Stack(
        children: [
          // Add floating elements for visual interest similar to web
          if (Theme.of(context).brightness == Brightness.dark)
            _buildDarkModeBackgroundElements(),
          if (Theme.of(context).brightness == Brightness.light)
            _buildLightModeBackgroundElements(),
          
          // Main content
          widget.child,
        ],
      ),
    );
  }
  
  /// Build background elements for dark mode that match web app design
  Widget _buildDarkModeBackgroundElements() {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, _) {
        return Stack(
          children: [
            // Glowing accent in top-right
            Positioned(
              top: -50,
              right: -100,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.1),
                      blurRadius: 100,
                      spreadRadius: 30,
                    ),
                  ],
                ),
              ),
            ),
            
            // Glowing accent in bottom-left
            Positioned(
              bottom: -80,
              left: -80,
              child: Container(
                width: 250,
                height: 250,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.secondary.withOpacity(0.08),
                      blurRadius: 80,
                      spreadRadius: 20,
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
  
  /// Build background elements for light mode that match web app design
  Widget _buildLightModeBackgroundElements() {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, _) {
        return Stack(
          children: [
            // Very subtle blur elements for light mode
            Positioned(
              top: 100,
              right: 20,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.05),
                      blurRadius: 80,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),
            ),
            
            // Another subtle element
            Positioned(
              bottom: 150,
              left: 30,
              child: Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.secondary.withOpacity(0.04),
                      blurRadius: 60,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
  
  LinearGradient _buildLinearGradient() {
    final colors = widget.colors ?? _defaultColors;
    
    // Calculate the animation progress and use it to rotate the gradient
    final progress = _animation.value;
    final angle = progress * 2 * math.pi;
    
    return LinearGradient(
      colors: colors,
      begin: Alignment(
        math.cos(angle),
        math.sin(angle),
      ),
      end: Alignment(
        math.cos(angle + math.pi),
        math.sin(angle + math.pi),
      ),
      stops: _generateStops(colors.length, progress),
    );
  }
  
  RadialGradient _buildRadialGradient() {
    final colors = widget.colors ?? _defaultColors;
    final progress = _animation.value;
    
    // Create a pulsating effect by varying the radius
    final radius = 0.5 + 0.5 * math.sin(progress * math.pi);
    
    return RadialGradient(
      colors: colors,
      center: Alignment(
        math.cos(progress * 2 * math.pi) * 0.5,
        math.sin(progress * 2 * math.pi) * 0.5,
      ),
      focal: Alignment(
        -math.cos(progress * 2 * math.pi) * 0.5,
        -math.sin(progress * 2 * math.pi) * 0.5,
      ),
      radius: 1.0 + radius * 0.5,
      stops: _generateStops(colors.length, progress),
    );
  }
  
  List<double> _generateStops(int colorCount, double progress) {
    if (colorCount <= 1) return [0.0];
    
    final stops = <double>[];
    final step = 1.0 / (colorCount - 1);
    
    for (int i = 0; i < colorCount; i++) {
      // Add animation to the stops to create a flowing effect
      double stop = i * step;
      
      // Animate the stops by shifting them based on the progress
      stop = (stop + progress) % 1.0;
      
      stops.add(stop);
    }
    
    // Sort the stops to ensure they are in ascending order
    stops.sort();
    return stops;
  }
}

/// A simpler floating blob animation for lighter UI elements
class FloatingBlobsBackground extends StatefulWidget {
  final Widget child;
  final Color? baseColor;
  final int blobCount;

  const FloatingBlobsBackground({
    required this.child,
    this.baseColor,
    this.blobCount = 5,
    super.key,
  });

  @override
  State<FloatingBlobsBackground> createState() => _FloatingBlobsBackgroundState();
}

class _FloatingBlobsBackgroundState extends State<FloatingBlobsBackground> with TickerProviderStateMixin {
  late List<AnimationController> _controllers;
  late List<Animation<double>> _animations;
  late List<Offset> _positions;
  late List<double> _sizes;
  late List<Color> _colors;
  
  final math.Random _random = math.Random();
  
  @override
  void initState() {
    super.initState();
    
    _initializeAnimations();
  }
  
  void _initializeAnimations() {
    final baseColor = widget.baseColor ?? AppColors.primary;
    
    _controllers = List.generate(
      widget.blobCount,
      (index) => AnimationController(
        duration: Duration(seconds: 10 + _random.nextInt(10)),
        vsync: this,
      )..repeat(reverse: true),
    );
    
    _animations = _controllers.map((controller) {
      return CurvedAnimation(
        parent: controller,
        curve: Curves.easeInOut,
      );
    }).toList();
    
    _positions = List.generate(
      widget.blobCount,
      (index) => Offset(
        _random.nextDouble(),
        _random.nextDouble(),
      ),
    );
    
    _sizes = List.generate(
      widget.blobCount,
      (index) => 0.1 + _random.nextDouble() * 0.2,
    );
    
    _colors = List.generate(
      widget.blobCount,
      (index) {
        final hue = HSLColor.fromColor(baseColor).withHue(
          (HSLColor.fromColor(baseColor).hue + _random.nextDouble() * 30 - 15) % 360,
        );
        
        return hue
            .withSaturation(0.6 + _random.nextDouble() * 0.4)
            .withLightness(0.6 + _random.nextDouble() * 0.2)
            .toColor()
            .withOpacity(0.15 + _random.nextDouble() * 0.1);
      },
    );
  }
  
  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // Background color
        Container(
          color: Theme.of(context).scaffoldBackgroundColor,
        ),
        
        // Animated blobs
        ...List.generate(widget.blobCount, (index) {
          return AnimatedBuilder(
            animation: _animations[index],
            builder: (context, child) {
              final animation = _animations[index].value;
              
              // Calculate the position with a slight floating movement
              final dx = _positions[index].dx + 0.1 * math.sin(animation * math.pi * 2);
              final dy = _positions[index].dy + 0.1 * math.cos(animation * math.pi * 2);
              
              // Calculate the size with a breathing effect
              final size = _sizes[index] * (0.8 + 0.2 * math.sin(animation * math.pi));
              
              return Positioned(
                left: dx * MediaQuery.of(context).size.width,
                top: dy * MediaQuery.of(context).size.height,
                child: Container(
                  width: size * MediaQuery.of(context).size.width,
                  height: size * MediaQuery.of(context).size.width,
                  decoration: BoxDecoration(
                    color: _colors[index],
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: _colors[index].withOpacity(0.3),
                        blurRadius: 30,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        }),
        
        // Apply a blur effect to the blobs
        BackdropFilter(
          filter: ImageFilter.blur(
            sigmaX: 30,
            sigmaY: 30,
          ),
          child: Container(
            color: Colors.transparent,
          ),
        ),
        
        // Content
        widget.child,
      ],
    );
  }
}