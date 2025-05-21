import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// App theme configuration
class AppTheme {
  /// Primary color for the app
  static const Color primaryColor = Color(0xFF6A35FF);
  
  /// Secondary color for the app
  static const Color secondaryColor = Color(0xFF00D2FF);
  
  /// Error color for the app
  static const Color errorColor = Color(0xFFFF3B30);
  
  /// Success color for the app
  static const Color successColor = Color(0xFF34C759);
  
  /// Warning color for the app
  static const Color warningColor = Color(0xFFFF9500);
  
  /// Info color for the app
  static const Color infoColor = Color(0xFF00B0FF);
  
  /// Light background color
  static const Color lightBackground = Color(0xFFF8F9FA);
  
  /// Dark background color
  static const Color darkBackground = Color(0xFF121212);
  
  /// Light surface color
  static const Color lightSurface = Color(0xFFFFFFFF);
  
  /// Dark surface color
  static const Color darkSurface = Color(0xFF1E1E1E);
  
  /// Light theme for the app
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryColor,
      scaffoldBackgroundColor: lightBackground,
      cardColor: lightSurface,
      colorScheme: const ColorScheme(
        brightness: Brightness.light,
        primary: primaryColor,
        onPrimary: Colors.white,
        secondary: secondaryColor,
        onSecondary: Colors.white,
        error: errorColor,
        onError: Colors.white,
        background: lightBackground,
        onBackground: Color(0xFF1A1A1A),
        surface: lightSurface,
        onSurface: Color(0xFF1A1A1A),
      ),
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: const Color(0xFF1A1A1A),
        ),
        iconTheme: const IconThemeData(
          color: Color(0xFF1A1A1A),
        ),
      ),
      iconTheme: const IconThemeData(
        color: primaryColor,
      ),
      textTheme: GoogleFonts.poppinsTextTheme(
        const TextTheme(
          displayLarge: TextStyle(color: Color(0xFF1A1A1A)),
          displayMedium: TextStyle(color: Color(0xFF1A1A1A)),
          displaySmall: TextStyle(color: Color(0xFF1A1A1A)),
          headlineLarge: TextStyle(color: Color(0xFF1A1A1A)),
          headlineMedium: TextStyle(color: Color(0xFF1A1A1A)),
          headlineSmall: TextStyle(color: Color(0xFF1A1A1A)),
          titleLarge: TextStyle(color: Color(0xFF1A1A1A)),
          titleMedium: TextStyle(color: Color(0xFF1A1A1A)),
          titleSmall: TextStyle(color: Color(0xFF1A1A1A)),
          bodyLarge: TextStyle(color: Color(0xFF1A1A1A)),
          bodyMedium: TextStyle(color: Color(0xFF1A1A1A)),
          bodySmall: TextStyle(color: Color(0xFF1A1A1A)),
          labelLarge: TextStyle(color: Color(0xFF1A1A1A)),
          labelMedium: TextStyle(color: Color(0xFF1A1A1A)),
          labelSmall: TextStyle(color: Color(0xFF1A1A1A)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          side: const BorderSide(
            color: primaryColor,
            width: 1.5,
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFFE0E0E0),
            width: 1.5,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFFE0E0E0),
            width: 1.5,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: primaryColor,
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: errorColor,
            width: 1.5,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: errorColor,
            width: 1.5,
          ),
        ),
        labelStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: const Color(0xFF757575),
        ),
        hintStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: const Color(0xFFBDBDBD),
        ),
        errorStyle: GoogleFonts.poppins(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: errorColor,
        ),
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      dialogTheme: DialogTheme(
        backgroundColor: Colors.white,
        elevation: 5,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: const Color(0xFF323232),
        contentTextStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: Colors.white,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        behavior: SnackBarBehavior.floating,
      ),
      tabBarTheme: TabBarTheme(
        labelColor: primaryColor,
        unselectedLabelColor: const Color(0xFF757575),
        indicatorColor: primaryColor,
        labelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: const Color(0xFFF0F0F0),
        disabledColor: const Color(0xFFE0E0E0),
        selectedColor: primaryColor.withOpacity(0.1),
        secondarySelectedColor: primaryColor,
        padding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 8,
        ),
        labelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: const Color(0xFF1A1A1A),
        ),
        secondaryLabelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: primaryColor,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFFE0E0E0);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor;
            }
            return const Color(0xFFE0E0E0);
          },
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),
      radioTheme: RadioThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFFE0E0E0);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor;
            }
            return const Color(0xFFE0E0E0);
          },
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFFE0E0E0);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor;
            }
            return Colors.white;
          },
        ),
        trackColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFFE0E0E0);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor.withOpacity(0.5);
            }
            return const Color(0xFFE0E0E0);
          },
        ),
      ),
    );
  }
  
  /// Dark theme for the app
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: primaryColor,
      scaffoldBackgroundColor: darkBackground,
      cardColor: darkSurface,
      colorScheme: const ColorScheme(
        brightness: Brightness.dark,
        primary: primaryColor,
        onPrimary: Colors.white,
        secondary: secondaryColor,
        onSecondary: Colors.white,
        error: errorColor,
        onError: Colors.white,
        background: darkBackground,
        onBackground: Color(0xFFF5F5F5),
        surface: darkSurface,
        onSurface: Color(0xFFF5F5F5),
      ),
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
      ),
      iconTheme: const IconThemeData(
        color: primaryColor,
      ),
      textTheme: GoogleFonts.poppinsTextTheme(
        const TextTheme(
          displayLarge: TextStyle(color: Color(0xFFF5F5F5)),
          displayMedium: TextStyle(color: Color(0xFFF5F5F5)),
          displaySmall: TextStyle(color: Color(0xFFF5F5F5)),
          headlineLarge: TextStyle(color: Color(0xFFF5F5F5)),
          headlineMedium: TextStyle(color: Color(0xFFF5F5F5)),
          headlineSmall: TextStyle(color: Color(0xFFF5F5F5)),
          titleLarge: TextStyle(color: Color(0xFFF5F5F5)),
          titleMedium: TextStyle(color: Color(0xFFF5F5F5)),
          titleSmall: TextStyle(color: Color(0xFFF5F5F5)),
          bodyLarge: TextStyle(color: Color(0xFFF5F5F5)),
          bodyMedium: TextStyle(color: Color(0xFFF5F5F5)),
          bodySmall: TextStyle(color: Color(0xFFF5F5F5)),
          labelLarge: TextStyle(color: Color(0xFFF5F5F5)),
          labelMedium: TextStyle(color: Color(0xFFF5F5F5)),
          labelSmall: TextStyle(color: Color(0xFFF5F5F5)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          side: const BorderSide(
            color: primaryColor,
            width: 1.5,
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF2C2C2C),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFF3E3E3E),
            width: 1.5,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFF3E3E3E),
            width: 1.5,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: primaryColor,
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: errorColor,
            width: 1.5,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: errorColor,
            width: 1.5,
          ),
        ),
        labelStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: const Color(0xFFAAAAAA),
        ),
        hintStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: const Color(0xFF8A8A8A),
        ),
        errorStyle: GoogleFonts.poppins(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: errorColor,
        ),
      ),
      cardTheme: CardTheme(
        color: darkSurface,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      dialogTheme: DialogTheme(
        backgroundColor: darkSurface,
        elevation: 5,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: const Color(0xFF323232),
        contentTextStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: Colors.white,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        behavior: SnackBarBehavior.floating,
      ),
      tabBarTheme: TabBarTheme(
        labelColor: primaryColor,
        unselectedLabelColor: const Color(0xFFAAAAAA),
        indicatorColor: primaryColor,
        labelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: const Color(0xFF2C2C2C),
        disabledColor: const Color(0xFF3E3E3E),
        selectedColor: primaryColor.withOpacity(0.3),
        secondarySelectedColor: primaryColor,
        padding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 8,
        ),
        labelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: Colors.white,
        ),
        secondaryLabelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: primaryColor,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFF3E3E3E);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor;
            }
            return const Color(0xFF3E3E3E);
          },
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),
      radioTheme: RadioThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFF3E3E3E);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor;
            }
            return const Color(0xFF3E3E3E);
          },
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFF3E3E3E);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor;
            }
            return Colors.white;
          },
        ),
        trackColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.disabled)) {
              return const Color(0xFF3E3E3E);
            }
            if (states.contains(MaterialState.selected)) {
              return primaryColor.withOpacity(0.5);
            }
            return const Color(0xFF3E3E3E);
          },
        ),
      ),
    );
  }
  
}

/// Text styles for the app
class AppTextStyles {
    /// Heading 1 text style
    static final TextStyle heading1 = GoogleFonts.poppins(
      fontSize: 32,
      fontWeight: FontWeight.w700,
    );
    
    /// Heading 2 text style
    static final TextStyle heading2 = GoogleFonts.poppins(
      fontSize: 28,
      fontWeight: FontWeight.w700,
    );
    
    /// Heading 3 text style
    static final TextStyle heading3 = GoogleFonts.poppins(
      fontSize: 24,
      fontWeight: FontWeight.w600,
    );
    
    /// Heading 4 text style
    static final TextStyle heading4 = GoogleFonts.poppins(
      fontSize: 20,
      fontWeight: FontWeight.w600,
    );
    
    /// Heading 5 text style
    static final TextStyle heading5 = GoogleFonts.poppins(
      fontSize: 18,
      fontWeight: FontWeight.w600,
    );
    
    /// Body large text style
    static final TextStyle bodyLarge = GoogleFonts.poppins(
      fontSize: 16,
      fontWeight: FontWeight.w500,
    );
    
    /// Body medium text style
    static final TextStyle bodyMedium = GoogleFonts.poppins(
      fontSize: 14,
      fontWeight: FontWeight.w400,
    );
    
    /// Body small text style
    static final TextStyle bodySmall = GoogleFonts.poppins(
      fontSize: 12,
      fontWeight: FontWeight.w400,
    );
    
    /// Button text style
    static final TextStyle button = GoogleFonts.poppins(
      fontSize: 16,
      fontWeight: FontWeight.w600,
    );
    
    /// Caption text style
    static final TextStyle caption = GoogleFonts.poppins(
      fontSize: 12,
      fontWeight: FontWeight.w400,
      fontStyle: FontStyle.italic,
    );
  }
  
}

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
}