import 'package:flutter/material.dart';

/// Theme provider that manages app theme settings
class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;
  
  ThemeMode get themeMode => _themeMode;
  
  bool get isDarkMode => _themeMode == ThemeMode.dark;
  
  void toggleTheme() {
    _themeMode = _themeMode == ThemeMode.dark 
        ? ThemeMode.light 
        : ThemeMode.dark;
    notifyListeners();
  }
  
  void setThemeMode(ThemeMode mode) {
    _themeMode = mode;
    notifyListeners();
  }
  
  /// Light theme definition
  ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: Color(0xFF6366F1),     // Primary - Indigo
        secondary: Color(0xFF8B5CF6),   // Secondary - Purple
        tertiary: Color(0xFF3B82F6),    // Tertiary - Blue
        background: Colors.white,
        surface: Colors.white,
        error: Color(0xFFEF4444),       // Error - Red
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onTertiary: Colors.white,
        onBackground: Color(0xFF1E293B), // Slate 800
        onSurface: Color(0xFF1E293B),    // Slate 800
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: const Color(0xFFF8FAFC), // Slate 50
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Color(0xFF1E293B),
        elevation: 0,
        centerTitle: true,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: Color(0xFF6366F1),
        unselectedItemColor: Color(0xFF94A3B8), // Slate 400
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF1F5F9), // Slate 100
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF6366F1)),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFFEF4444)),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF6366F1),
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
          elevation: 0,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: const Color(0xFF6366F1),
          side: const BorderSide(color: Color(0xFF6366F1)),
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: const Color(0xFF6366F1),
        ),
      ),
      fontFamily: 'Poppins',
      textTheme: const TextTheme(
        displayLarge: TextStyle(fontWeight: FontWeight.bold, fontSize: 32),
        displayMedium: TextStyle(fontWeight: FontWeight.bold, fontSize: 28),
        displaySmall: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
        headlineMedium: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
        headlineSmall: TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
        titleLarge: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
        bodyLarge: TextStyle(fontSize: 16),
        bodyMedium: TextStyle(fontSize: 14),
        labelLarge: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
      ),
      dividerTheme: const DividerThemeData(
        color: Color(0xFFE2E8F0), // Slate 200
        thickness: 1,
      ),
    );
  }
  
  /// Dark theme definition
  ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF818CF8),     // Primary - Indigo 400
        secondary: Color(0xFFA78BFA),   // Secondary - Purple 400
        tertiary: Color(0xFF60A5FA),    // Tertiary - Blue 400
        background: Color(0xFF0F172A),  // Slate 900
        surface: Color(0xFF1E293B),     // Slate 800
        error: Color(0xFFF87171),       // Error - Red 400
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onTertiary: Colors.white,
        onBackground: Color(0xFFE2E8F0), // Slate 200
        onSurface: Color(0xFFE2E8F0),    // Slate 200
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
      cardTheme: CardTheme(
        elevation: 0,
        color: const Color(0xFF1E293B), // Slate 800
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF0F172A), // Slate 900
        foregroundColor: Color(0xFFE2E8F0), // Slate 200
        elevation: 0,
        centerTitle: true,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xFF0F172A), // Slate 900
        selectedItemColor: Color(0xFF818CF8), // Indigo 400
        unselectedItemColor: Color(0xFF64748B), // Slate 500
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF334155), // Slate 700
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF818CF8)),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFFF87171)),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF818CF8),
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
          elevation: 0,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: const Color(0xFF818CF8),
          side: const BorderSide(color: Color(0xFF818CF8)),
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: const Color(0xFF818CF8),
        ),
      ),
      fontFamily: 'Poppins',
      textTheme: const TextTheme(
        displayLarge: TextStyle(fontWeight: FontWeight.bold, fontSize: 32),
        displayMedium: TextStyle(fontWeight: FontWeight.bold, fontSize: 28),
        displaySmall: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
        headlineMedium: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
        headlineSmall: TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
        titleLarge: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
        bodyLarge: TextStyle(fontSize: 16),
        bodyMedium: TextStyle(fontSize: 14),
        labelLarge: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
      ),
      dividerTheme: const DividerThemeData(
        color: Color(0xFF334155), // Slate 700
        thickness: 1,
      ),
    );
  }
}

/// App colors defined for easy reference throughout the app
class AppColors {
  // Primary colors
  static const primary = Color(0xFF6366F1);
  static const primaryDark = Color(0xFF818CF8);
  
  // Secondary colors
  static const secondary = Color(0xFF8B5CF6);
  static const secondaryDark = Color(0xFFA78BFA);
  
  // Tertiary colors
  static const tertiary = Color(0xFF3B82F6);
  static const tertiaryDark = Color(0xFF60A5FA);
  
  // Accent colors
  static const success = Color(0xFF10B981);
  static const successDark = Color(0xFF34D399);
  
  static const warning = Color(0xFFF59E0B);
  static const warningDark = Color(0xFFFBBF24);
  
  static const danger = Color(0xFFEF4444);
  static const dangerDark = Color(0xFFF87171);
  
  static const info = Color(0xFF0EA5E9);
  static const infoDark = Color(0xFF38BDF8);
  
  // Slate colors for light theme
  static const slate50 = Color(0xFFF8FAFC);
  static const slate100 = Color(0xFFF1F5F9);
  static const slate200 = Color(0xFFE2E8F0);
  static const slate300 = Color(0xFFCBD5E1);
  static const slate400 = Color(0xFF94A3B8);
  static const slate500 = Color(0xFF64748B);
  static const slate600 = Color(0xFF475569);
  static const slate700 = Color(0xFF334155);
  static const slate800 = Color(0xFF1E293B);
  static const slate900 = Color(0xFF0F172A);
}

/// Define text styles for consistent typography
class AppTextStyles {
  static TextStyle get heading1 => const TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    height: 1.3,
  );
  
  static TextStyle get heading2 => const TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    height: 1.3,
  );
  
  static TextStyle get heading3 => const TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    height: 1.4,
  );
  
  static TextStyle get heading4 => const TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );
  
  static TextStyle get heading5 => const TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );
  
  static TextStyle get heading6 => const TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.5,
  );
  
  static TextStyle get bodyLarge => const TextStyle(
    fontSize: 16,
    height: 1.5,
  );
  
  static TextStyle get bodyMedium => const TextStyle(
    fontSize: 14,
    height: 1.5,
  );
  
  static TextStyle get bodySmall => const TextStyle(
    fontSize: 12,
    height: 1.5,
  );
  
  static TextStyle get button => const TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.5,
  );
  
  static TextStyle get caption => const TextStyle(
    fontSize: 12,
    height: 1.5,
    fontWeight: FontWeight.w500,
  );
}

/// Custom border radiuses
class AppBorderRadius {
  static BorderRadius get small => BorderRadius.circular(4);
  static BorderRadius get medium => BorderRadius.circular(8);
  static BorderRadius get large => BorderRadius.circular(12);
  static BorderRadius get extraLarge => BorderRadius.circular(16);
  static BorderRadius get circle => BorderRadius.circular(100);
}

/// Standard spacing values
class AppSpacing {
  static const double xxs = 2;
  static const double xs = 4;
  static const double s = 8;
  static const double m = 16;
  static const double l = 24;
  static const double xl = 32;
  static const double xxl = 48;
  static const double xxxl = 64;
}

/// Shadow definitions
class AppShadows {
  static List<BoxShadow> get small => [
    BoxShadow(
      color: Colors.black.withOpacity(0.05),
      blurRadius: 4,
      offset: const Offset(0, 2),
    ),
  ];
  
  static List<BoxShadow> get medium => [
    BoxShadow(
      color: Colors.black.withOpacity(0.08),
      blurRadius: 8,
      offset: const Offset(0, 4),
    ),
  ];
  
  static List<BoxShadow> get large => [
    BoxShadow(
      color: Colors.black.withOpacity(0.12),
      blurRadius: 16,
      offset: const Offset(0, 8),
    ),
  ];
}