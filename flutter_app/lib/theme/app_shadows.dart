import 'package:flutter/material.dart';

/// Shadow styles for the app
class AppShadows {
  /// Small shadow
  static const List<BoxShadow> small = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.05),
      offset: Offset(0, 1),
      blurRadius: 2,
    ),
  ];
  
  /// Medium shadow
  static const List<BoxShadow> medium = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.1),
      offset: Offset(0, 4),
      blurRadius: 8,
    ),
  ];
  
  /// Large shadow
  static const List<BoxShadow> large = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.15),
      offset: Offset(0, 8),
      blurRadius: 16,
    ),
  ];
}