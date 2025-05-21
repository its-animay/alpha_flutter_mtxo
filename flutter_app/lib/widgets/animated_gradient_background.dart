import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/theme_service.dart';

/// A background widget with animated gradient effect
class AnimatedGradientBackground extends StatefulWidget {
  /// Child widget to render over the background
  final Widget child;
  
  /// Creates an animated gradient background
  const AnimatedGradientBackground({
    required this.child,
    Key? key,
  }) : super(key: key);

  @override
  State<AnimatedGradientBackground> createState() => _AnimatedGradientBackgroundState();
}

class _AnimatedGradientBackgroundState extends State<AnimatedGradientBackground> with TickerProviderStateMixin {
  late AnimationController _controller1;
  late AnimationController _controller2;
  late Animation<Alignment> _topAlignmentAnimation1;
  late Animation<Alignment> _bottomAlignmentAnimation1;
  late Animation<Alignment> _topAlignmentAnimation2;
  late Animation<Alignment> _bottomAlignmentAnimation2;
  
  @override
  void initState() {
    super.initState();
    
    _controller1 = AnimationController(
      duration: const Duration(seconds: 30),
      vsync: this,
    );
    
    _controller2 = AnimationController(
      duration: const Duration(seconds: 40),
      vsync: this,
    );
    
    _topAlignmentAnimation1 = Tween<Alignment>(
      begin: Alignment.topLeft,
      end: Alignment.topRight,
    ).animate(
      CurvedAnimation(
        parent: _controller1,
        curve: Curves.easeInOut,
      ),
    );
    
    _bottomAlignmentAnimation1 = Tween<Alignment>(
      begin: Alignment.bottomRight,
      end: Alignment.bottomLeft,
    ).animate(
      CurvedAnimation(
        parent: _controller1,
        curve: Curves.easeInOut,
      ),
    );
    
    _topAlignmentAnimation2 = Tween<Alignment>(
      begin: Alignment.topRight,
      end: Alignment.topLeft,
    ).animate(
      CurvedAnimation(
        parent: _controller2,
        curve: Curves.easeInOut,
      ),
    );
    
    _bottomAlignmentAnimation2 = Tween<Alignment>(
      begin: Alignment.bottomLeft,
      end: Alignment.bottomRight,
    ).animate(
      CurvedAnimation(
        parent: _controller2,
        curve: Curves.easeInOut,
      ),
    );
    
    _controller1.repeat(reverse: true);
    _controller2.repeat(reverse: true);
  }
  
  @override
  void dispose() {
    _controller1.dispose();
    _controller2.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);
    final isDarkMode = themeService.isDarkMode;
    
    return AnimatedBuilder(
      animation: Listenable.merge([_controller1, _controller2]),
      builder: (context, _) {
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: _topAlignmentAnimation1.value,
              end: _bottomAlignmentAnimation1.value,
              colors: isDarkMode
                  ? [
                      const Color(0xFF1a1a2e),
                      const Color(0xFF16213e),
                      const Color(0xFF0f3460),
                      const Color(0xFF1a1a2e),
                    ]
                  : [
                      const Color(0xFFedf2fb),
                      const Color(0xFFe2eafc),
                      const Color(0xFFd7e3fc),
                      const Color(0xFFccdbfd),
                    ],
            ),
          ),
          child: Stack(
            children: [
              // Second gradient for more dynamic effect
              Opacity(
                opacity: 0.7,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: _topAlignmentAnimation2.value,
                      end: _bottomAlignmentAnimation2.value,
                      colors: isDarkMode
                          ? [
                              Colors.transparent,
                              const Color(0xFF6A35FF).withOpacity(0.1),
                              const Color(0xFF00D2FF).withOpacity(0.1),
                              Colors.transparent,
                            ]
                          : [
                              Colors.transparent,
                              const Color(0xFF6A35FF).withOpacity(0.05),
                              const Color(0xFF00D2FF).withOpacity(0.05),
                              Colors.transparent,
                            ],
                    ),
                  ),
                ),
              ),
              
              // Content
              widget.child,
            ],
          ),
        );
      },
    );
  }
}