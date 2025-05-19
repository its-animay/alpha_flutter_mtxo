import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Colors used throughout the application
class AppColors {
  // Primary and accent colors
  static const primary = Color(0xFF536DFE);
  static const secondary = Color(0xFF03DAC6);
  static const tertiary = Color(0xFFFF9E80);
  
  // Functional colors
  static const success = Color(0xFF4CAF50);
  static const warning = Color(0xFFFFC107);
  static const error = Color(0xFFEF5350);
  static const info = Color(0xFF2196F3);
  
  // Dark theme specific colors
  static const darkSurface = Color(0xFF1F1F1F);
  static const darkBackground = Color(0xFF121212);
  static const darkError = Color(0xFFCF6679);
  
  // Gradient colors
  static const gradientStart = Color(0xFF536DFE);
  static const gradientMiddle = Color(0xFF8C9EFF);
  static const gradientEnd = Color(0xFF82B1FF);
  
  // Glassmorphism
  static const glassLight = Color(0xADF7F7F7);
  static const glassDark = Color(0xAD1E1E1E);
}

/// Text styles used throughout the application
class AppTextStyles {
  // Headings
  static const heading1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    height: 1.2,
  );
  
  static const heading2 = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    height: 1.2,
  );
  
  static const heading3 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    height: 1.3,
  );
  
  static const heading4 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    height: 1.3,
  );
  
  static const heading5 = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    height: 1.4,
  );
  
  static const heading6 = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    height: 1.4,
  );
  
  // Body text
  static const bodyLarge = TextStyle(
    fontSize: 16,
    height: 1.5,
  );
  
  static const bodyMedium = TextStyle(
    fontSize: 14,
    height: 1.5,
  );
  
  static const bodySmall = TextStyle(
    fontSize: 12,
    height: 1.5,
  );
  
  // Special text styles
  static const caption = TextStyle(
    fontSize: 12,
    height: 1.3,
    letterSpacing: 0.4,
  );
  
  static const button = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.5,
    letterSpacing: 0.5,
  );
}

/// Box shadows used throughout the application
class AppShadows {
  static List<BoxShadow> small = [
    BoxShadow(
      color: Colors.black.withOpacity(0.05),
      blurRadius: 5,
      offset: const Offset(0, 2),
    ),
  ];
  
  static List<BoxShadow> medium = [
    BoxShadow(
      color: Colors.black.withOpacity(0.1),
      blurRadius: 10,
      offset: const Offset(0, 3),
    ),
  ];
  
  static List<BoxShadow> large = [
    BoxShadow(
      color: Colors.black.withOpacity(0.12),
      blurRadius: 15,
      offset: const Offset(0, 5),
    ),
  ];
}

/// Border radius used throughout the application
class AppBorderRadius {
  static const small = 4.0;
  static const medium = 8.0;
  static const large = 16.0;
  static const extraLarge = 24.0;
}

/// Main app theme
class AppTheme {
  // Create light theme
  static ThemeData lightTheme() {
    final base = ThemeData.light();
    
    return base.copyWith(
      colorScheme: ColorScheme.light(
        primary: AppColors.primary,
        primaryContainer: AppColors.primary.withOpacity(0.2),
        onPrimary: Colors.white,
        secondary: AppColors.secondary,
        secondaryContainer: AppColors.secondary.withOpacity(0.2),
        onSecondary: Colors.black,
        tertiary: AppColors.tertiary,
        tertiaryContainer: AppColors.tertiary.withOpacity(0.2),
        onTertiary: Colors.black,
        error: AppColors.error,
        onError: Colors.white,
        background: Colors.white,
        onBackground: Colors.black,
        surface: Colors.white,
        onSurface: Colors.black,
      ),
      scaffoldBackgroundColor: const Color(0xFFF8F8F8),
      cardColor: Colors.white,
      dividerColor: Colors.grey[300],
      textTheme: GoogleFonts.poppinsTextTheme(base.textTheme).copyWith(
        headlineLarge: GoogleFonts.poppins(textStyle: AppTextStyles.heading1.copyWith(color: Colors.black)),
        headlineMedium: GoogleFonts.poppins(textStyle: AppTextStyles.heading2.copyWith(color: Colors.black)),
        headlineSmall: GoogleFonts.poppins(textStyle: AppTextStyles.heading3.copyWith(color: Colors.black)),
        titleLarge: GoogleFonts.poppins(textStyle: AppTextStyles.heading4.copyWith(color: Colors.black)),
        titleMedium: GoogleFonts.poppins(textStyle: AppTextStyles.heading5.copyWith(color: Colors.black)),
        titleSmall: GoogleFonts.poppins(textStyle: AppTextStyles.heading6.copyWith(color: Colors.black)),
        bodyLarge: GoogleFonts.poppins(textStyle: AppTextStyles.bodyLarge.copyWith(color: Colors.black.withOpacity(0.8))),
        bodyMedium: GoogleFonts.poppins(textStyle: AppTextStyles.bodyMedium.copyWith(color: Colors.black.withOpacity(0.8))),
        bodySmall: GoogleFonts.poppins(textStyle: AppTextStyles.bodySmall.copyWith(color: Colors.black.withOpacity(0.8))),
        labelLarge: GoogleFonts.poppins(textStyle: AppTextStyles.button.copyWith(color: Colors.black)),
        labelMedium: GoogleFonts.poppins(textStyle: AppTextStyles.caption.copyWith(color: Colors.black.withOpacity(0.6))),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        titleTextStyle: GoogleFonts.poppins(
          textStyle: AppTextStyles.heading5.copyWith(color: Colors.black),
        ),
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Colors.black54,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          textStyle: AppTextStyles.button,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          elevation: 2,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTextStyles.button,
          side: const BorderSide(color: AppColors.primary),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTextStyles.button,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.grey[100],
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.error, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.error, width: 2),
        ),
        labelStyle: TextStyle(
          color: Colors.black.withOpacity(0.6),
        ),
        hintStyle: TextStyle(
          color: Colors.black.withOpacity(0.4),
        ),
        errorStyle: const TextStyle(
          color: AppColors.error,
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary;
          }
          return Colors.transparent;
        }),
        side: BorderSide(color: Colors.grey[400]!),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary;
          }
          return Colors.grey[400]!;
        }),
        trackColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary.withOpacity(0.5);
          }
          return Colors.grey[300]!;
        }),
      ),
      radioTheme: RadioThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary;
          }
          return Colors.grey[400]!;
        }),
      ),
      sliderTheme: SliderThemeData(
        activeTrackColor: AppColors.primary,
        inactiveTrackColor: AppColors.primary.withOpacity(0.3),
        thumbColor: AppColors.primary,
        overlayColor: AppColors.primary.withOpacity(0.3),
        valueIndicatorColor: AppColors.primary,
        valueIndicatorTextStyle: const TextStyle(color: Colors.white),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.primary,
        linearTrackColor: Colors.grey,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: Colors.grey[200]!,
        disabledColor: Colors.grey[300]!,
        selectedColor: AppColors.primary,
        secondarySelectedColor: AppColors.primary,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        labelStyle: const TextStyle(
          color: Colors.black87,
        ),
        secondaryLabelStyle: const TextStyle(
          color: Colors.white,
        ),
        brightness: Brightness.light,
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      dialogTheme: DialogTheme(
        backgroundColor: Colors.white,
        elevation: 24,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: Colors.grey[800],
        contentTextStyle: const TextStyle(color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      tabBarTheme: TabBarTheme(
        labelColor: AppColors.primary,
        unselectedLabelColor: Colors.black54,
        indicatorColor: AppColors.primary,
        labelStyle: GoogleFonts.poppins(
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        unselectedLabelStyle: GoogleFonts.poppins(
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
  
  // Create dark theme
  static ThemeData darkTheme() {
    final base = ThemeData.dark();
    
    return base.copyWith(
      colorScheme: ColorScheme.dark(
        primary: AppColors.primary,
        primaryContainer: AppColors.primary.withOpacity(0.2),
        onPrimary: Colors.white,
        secondary: AppColors.secondary,
        secondaryContainer: AppColors.secondary.withOpacity(0.2),
        onSecondary: Colors.black,
        tertiary: AppColors.tertiary,
        tertiaryContainer: AppColors.tertiary.withOpacity(0.2),
        onTertiary: Colors.black,
        error: AppColors.darkError,
        onError: Colors.white,
        background: AppColors.darkBackground,
        onBackground: Colors.white,
        surface: AppColors.darkSurface,
        onSurface: Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.darkBackground,
      cardColor: AppColors.darkSurface,
      dividerColor: Colors.grey[800],
      textTheme: GoogleFonts.poppinsTextTheme(base.textTheme).copyWith(
        headlineLarge: GoogleFonts.poppins(textStyle: AppTextStyles.heading1.copyWith(color: Colors.white)),
        headlineMedium: GoogleFonts.poppins(textStyle: AppTextStyles.heading2.copyWith(color: Colors.white)),
        headlineSmall: GoogleFonts.poppins(textStyle: AppTextStyles.heading3.copyWith(color: Colors.white)),
        titleLarge: GoogleFonts.poppins(textStyle: AppTextStyles.heading4.copyWith(color: Colors.white)),
        titleMedium: GoogleFonts.poppins(textStyle: AppTextStyles.heading5.copyWith(color: Colors.white)),
        titleSmall: GoogleFonts.poppins(textStyle: AppTextStyles.heading6.copyWith(color: Colors.white)),
        bodyLarge: GoogleFonts.poppins(textStyle: AppTextStyles.bodyLarge.copyWith(color: Colors.white.withOpacity(0.9))),
        bodyMedium: GoogleFonts.poppins(textStyle: AppTextStyles.bodyMedium.copyWith(color: Colors.white.withOpacity(0.9))),
        bodySmall: GoogleFonts.poppins(textStyle: AppTextStyles.bodySmall.copyWith(color: Colors.white.withOpacity(0.9))),
        labelLarge: GoogleFonts.poppins(textStyle: AppTextStyles.button.copyWith(color: Colors.white)),
        labelMedium: GoogleFonts.poppins(textStyle: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.7))),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.darkSurface,
        foregroundColor: Colors.white,
        elevation: 0,
        titleTextStyle: GoogleFonts.poppins(
          textStyle: AppTextStyles.heading5.copyWith(color: Colors.white),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkSurface,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Colors.white70,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          textStyle: AppTextStyles.button,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          elevation: 2,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTextStyles.button,
          side: const BorderSide(color: AppColors.primary),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTextStyles.button,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.grey[900],
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.darkError, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.darkError, width: 2),
        ),
        labelStyle: TextStyle(
          color: Colors.white.withOpacity(0.7),
        ),
        hintStyle: TextStyle(
          color: Colors.white.withOpacity(0.5),
        ),
        errorStyle: const TextStyle(
          color: AppColors.darkError,
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary;
          }
          return Colors.transparent;
        }),
        side: const BorderSide(color: Colors.white70),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary;
          }
          return Colors.grey[400]!;
        }),
        trackColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary.withOpacity(0.5);
          }
          return Colors.grey[700]!;
        }),
      ),
      radioTheme: RadioThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.primary;
          }
          return Colors.grey[400]!;
        }),
      ),
      sliderTheme: SliderThemeData(
        activeTrackColor: AppColors.primary,
        inactiveTrackColor: AppColors.primary.withOpacity(0.3),
        thumbColor: AppColors.primary,
        overlayColor: AppColors.primary.withOpacity(0.3),
        valueIndicatorColor: AppColors.primary,
        valueIndicatorTextStyle: const TextStyle(color: Colors.white),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.primary,
        linearTrackColor: Colors.grey,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: Colors.grey[800]!,
        disabledColor: Colors.grey[700]!,
        selectedColor: AppColors.primary,
        secondarySelectedColor: AppColors.primary,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        labelStyle: const TextStyle(
          color: Colors.white,
        ),
        secondaryLabelStyle: const TextStyle(
          color: Colors.white,
        ),
        brightness: Brightness.dark,
      ),
      cardTheme: CardTheme(
        color: AppColors.darkSurface,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      dialogTheme: DialogTheme(
        backgroundColor: AppColors.darkSurface,
        elevation: 24,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: Colors.grey[900],
        contentTextStyle: const TextStyle(color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      tabBarTheme: TabBarTheme(
        labelColor: AppColors.primary,
        unselectedLabelColor: Colors.white70,
        indicatorColor: AppColors.primary,
        labelStyle: GoogleFonts.poppins(
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        unselectedLabelStyle: GoogleFonts.poppins(
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}