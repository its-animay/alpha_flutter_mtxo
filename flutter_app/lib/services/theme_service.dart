import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A service that manages the app's theme mode
class ThemeService extends ChangeNotifier {
  static const String _themePreferenceKey = 'theme_mode';
  
  ThemeMode _themeMode = ThemeMode.system;
  
  ThemeService() {
    _loadThemeMode();
  }
  
  /// Get the current theme mode
  ThemeMode get themeMode => _themeMode;
  
  /// Check if the current theme is dark
  bool get isDarkMode => _themeMode == ThemeMode.dark;
  
  /// Toggle between light and dark theme modes
  Future<void> toggleTheme() async {
    _themeMode = _themeMode == ThemeMode.light 
        ? ThemeMode.dark 
        : ThemeMode.light;
    
    notifyListeners();
    await _saveThemeMode();
  }
  
  /// Set the theme mode explicitly
  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    notifyListeners();
    await _saveThemeMode();
  }
  
  /// Load the theme mode from shared preferences
  Future<void> _loadThemeMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedThemeMode = prefs.getString(_themePreferenceKey);
      
      if (savedThemeMode != null) {
        _themeMode = _parseThemeMode(savedThemeMode);
        notifyListeners();
      }
    } catch (e) {
      // Default to system theme if there is an error
      _themeMode = ThemeMode.system;
    }
  }
  
  /// Save the current theme mode to shared preferences
  Future<void> _saveThemeMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_themePreferenceKey, _themeModeToString(_themeMode));
    } catch (e) {
      // Ignore errors when saving
    }
  }
  
  /// Convert ThemeMode to a string representation
  String _themeModeToString(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return 'light';
      case ThemeMode.dark:
        return 'dark';
      case ThemeMode.system:
        return 'system';
    }
  }
  
  /// Parse a string to ThemeMode
  ThemeMode _parseThemeMode(String value) {
    switch (value) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      case 'system':
      default:
        return ThemeMode.system;
    }
  }
}