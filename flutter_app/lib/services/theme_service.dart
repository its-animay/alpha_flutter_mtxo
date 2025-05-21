import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/app_theme.dart';

/// Service for managing app theme settings
class ThemeService extends ChangeNotifier {
  bool _isDarkMode = false;
  bool _isSystemMode = true;
  
  /// Whether dark mode is enabled
  bool get isDarkMode => _isDarkMode;
  
  /// Whether system theme mode is enabled
  bool get isSystemMode => _isSystemMode;
  
  /// Light theme data
  ThemeData get lightTheme => AppTheme.lightTheme;
  
  /// Dark theme data
  ThemeData get darkTheme => AppTheme.darkTheme;
  
  /// Current theme data
  ThemeData get currentTheme => _isDarkMode ? darkTheme : lightTheme;
  
  /// Initialize theme service
  ThemeService() {
    _loadThemePreference();
  }
  
  /// Load theme preference from storage
  Future<void> _loadThemePreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Check if we have a saved preference
      final hasPreference = prefs.containsKey('isDarkMode');
      
      if (hasPreference) {
        // Use saved preference
        _isDarkMode = prefs.getBool('isDarkMode') ?? false;
        _isSystemMode = prefs.getBool('isSystemMode') ?? true;
      } else {
        // If no preference is set, use system default
        _isSystemMode = true;
        _setThemeBasedOnSystem();
      }
      
      notifyListeners();
    } catch (e) {
      // Default to light mode if there's an error
      _isDarkMode = false;
      notifyListeners();
    }
  }
  
  /// Set theme based on system preference
  void _setThemeBasedOnSystem() {
    final brightness = SchedulerBinding.instance.platformDispatcher.platformBrightness;
    _isDarkMode = brightness == Brightness.dark;
  }
  
  /// Toggle between light and dark themes
  void toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    _isSystemMode = false;
    
    // Save preference
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    await prefs.setBool('isSystemMode', _isSystemMode);
    
    notifyListeners();
  }
  
  /// Set to system theme
  void useSystemTheme() async {
    _isSystemMode = true;
    _setThemeBasedOnSystem();
    
    // Save preference
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    await prefs.setBool('isSystemMode', _isSystemMode);
    
    notifyListeners();
  }
  
  /// Set to light theme
  void setLightTheme() async {
    _isDarkMode = false;
    _isSystemMode = false;
    
    // Save preference
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    await prefs.setBool('isSystemMode', _isSystemMode);
    
    notifyListeners();
  }
  
  /// Set to dark theme
  void setDarkTheme() async {
    _isDarkMode = true;
    _isSystemMode = false;
    
    // Save preference
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    await prefs.setBool('isSystemMode', _isSystemMode);
    
    notifyListeners();
  }
}