import 'package:flutter/material.dart';

/// A widget that displays the MTXO Labs logo
class MTXOLogo extends StatelessWidget {
  final double size;
  final bool withText;
  final Color? color;
  
  const MTXOLogo({
    this.size = 40.0,
    this.withText = true,
    this.color,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final logoColor = color ?? theme.colorScheme.primary;
    final textColor = theme.brightness == Brightness.dark 
        ? Colors.white 
        : Colors.black;
    
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Logo icon
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                logoColor,
                Theme.of(context).colorScheme.secondary,
              ],
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: Text(
              'M',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: size * 0.6,
              ),
            ),
          ),
        ),
        
        // Logo text (optional)
        if (withText) ...[
          const SizedBox(width: 12),
          RichText(
            text: TextSpan(
              style: TextStyle(
                fontSize: size * 0.5,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
              children: [
                TextSpan(
                  text: 'MTXO ',
                  style: TextStyle(
                    color: logoColor,
                  ),
                ),
                TextSpan(
                  text: 'Labs',
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}