import 'package:flutter/material.dart';

/// An animated progress bar widget that displays a completion percentage
class AnimatedProgressBar extends StatefulWidget {
  final double value;
  final Color? backgroundColor;
  final Color? valueColor;
  final double height;
  final Duration duration;
  final BorderRadius? borderRadius;

  const AnimatedProgressBar({
    required this.value,
    this.backgroundColor,
    this.valueColor,
    this.height = 8.0,
    this.duration = const Duration(milliseconds: 500),
    this.borderRadius,
    super.key,
  }) : assert(value >= 0.0 && value <= 1.0, 'Value must be between 0.0 and 1.0');

  @override
  State<AnimatedProgressBar> createState() => _AnimatedProgressBarState();
}

class _AnimatedProgressBarState extends State<AnimatedProgressBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  double _oldValue = 0.0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _animation = Tween<double>(begin: 0.0, end: widget.value).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
    _oldValue = widget.value;
    _controller.forward();
  }

  @override
  void didUpdateWidget(AnimatedProgressBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _oldValue = oldWidget.value;
      _animation = Tween<double>(begin: _oldValue, end: widget.value).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Curves.easeInOut,
        ),
      );
      _controller.reset();
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final backgroundColor = widget.backgroundColor ?? theme.colorScheme.onSurface.withOpacity(0.1);
    final valueColor = widget.valueColor ?? theme.colorScheme.primary;
    final borderRadius = widget.borderRadius ?? BorderRadius.circular(widget.height / 2);

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          height: widget.height,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: borderRadius,
          ),
          child: FractionallySizedBox(
            widthFactor: _animation.value,
            alignment: Alignment.centerLeft,
            child: Container(
              decoration: BoxDecoration(
                color: valueColor,
                borderRadius: borderRadius,
                boxShadow: [
                  BoxShadow(
                    color: valueColor.withOpacity(0.5),
                    blurRadius: 5,
                    spreadRadius: 0,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

/// A circular progress indicator with animation and percentage display
class AnimatedCircularProgress extends StatefulWidget {
  final double value;
  final double size;
  final Color? backgroundColor;
  final Color? valueColor;
  final Duration duration;
  final bool showPercentage;
  final TextStyle? percentageTextStyle;
  final double strokeWidth;

  const AnimatedCircularProgress({
    required this.value,
    this.size = 100.0,
    this.backgroundColor,
    this.valueColor,
    this.duration = const Duration(milliseconds: 500),
    this.showPercentage = true,
    this.percentageTextStyle,
    this.strokeWidth = 8.0,
    super.key,
  }) : assert(value >= 0.0 && value <= 1.0, 'Value must be between 0.0 and 1.0');

  @override
  State<AnimatedCircularProgress> createState() => _AnimatedCircularProgressState();
}

class _AnimatedCircularProgressState extends State<AnimatedCircularProgress>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  double _oldValue = 0.0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _animation = Tween<double>(begin: 0.0, end: widget.value).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
    _oldValue = widget.value;
    _controller.forward();
  }

  @override
  void didUpdateWidget(AnimatedCircularProgress oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _oldValue = oldWidget.value;
      _animation = Tween<double>(begin: _oldValue, end: widget.value).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Curves.easeInOut,
        ),
      );
      _controller.reset();
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final backgroundColor = widget.backgroundColor ?? theme.colorScheme.onSurface.withOpacity(0.1);
    final valueColor = widget.valueColor ?? theme.colorScheme.primary;

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return SizedBox(
          width: widget.size,
          height: widget.size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Background circle
              CircularProgressIndicator(
                value: 1.0,
                strokeWidth: widget.strokeWidth,
                valueColor: AlwaysStoppedAnimation<Color>(backgroundColor),
              ),
              
              // Progress circle
              CircularProgressIndicator(
                value: _animation.value,
                strokeWidth: widget.strokeWidth,
                valueColor: AlwaysStoppedAnimation<Color>(valueColor),
              ),
              
              // Percentage text
              if (widget.showPercentage)
                Text(
                  '${(_animation.value * 100).toInt()}%',
                  style: widget.percentageTextStyle ?? TextStyle(
                    fontSize: widget.size / 4,
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

/// A segmented progress indicator for tracking multi-step processes
class SegmentedProgressIndicator extends StatelessWidget {
  final int totalSegments;
  final int completedSegments;
  final Color? activeColor;
  final Color? inactiveColor;
  final double height;
  final double spacing;

  const SegmentedProgressIndicator({
    required this.totalSegments,
    required this.completedSegments,
    this.activeColor,
    this.inactiveColor,
    this.height = 8.0,
    this.spacing = 4.0,
    super.key,
  }) : assert(completedSegments >= 0 && completedSegments <= totalSegments);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activeSegmentColor = activeColor ?? theme.colorScheme.primary;
    final inactiveSegmentColor = inactiveColor ?? theme.colorScheme.onSurface.withOpacity(0.1);
    
    return Row(
      children: List.generate(totalSegments, (index) {
        final isActive = index < completedSegments;
        
        return Expanded(
          child: Container(
            height: height,
            margin: EdgeInsets.only(left: index > 0 ? spacing : 0),
            decoration: BoxDecoration(
              color: isActive ? activeSegmentColor : inactiveSegmentColor,
              borderRadius: BorderRadius.circular(height / 2),
              boxShadow: isActive ? [
                BoxShadow(
                  color: activeSegmentColor.withOpacity(0.3),
                  blurRadius: 3,
                  spreadRadius: 0,
                  offset: const Offset(0, 1),
                ),
              ] : null,
            ),
          ),
        );
      }),
    );
  }
}