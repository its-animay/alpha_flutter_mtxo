import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../config/api_config.dart';

/// Authentication service for handling user authentication
class AuthService extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _authToken;
  
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get authToken => _authToken;
  
  /// Initialize the auth service
  AuthService() {
    // Load user from persistent storage on initialization
    loadUserFromStorage();
  }
  
  /// Load user from persistent storage
  Future<void> loadUserFromStorage() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString('user');
      final authToken = prefs.getString('auth_token');
      
      if (userJson != null && authToken != null) {
        _currentUser = User.fromJson(jsonDecode(userJson));
        _authToken = authToken;
        _isAuthenticated = true;
      }
    } catch (e) {
      debugPrint('Error loading user from storage: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Sign in user with username and password
  Future<bool> signIn(String username, String password) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      if (ApiConfig.useMockData) {
        // Mock sign in for development
        await Future.delayed(const Duration(seconds: 1));
        _currentUser = User(
          id: 1,
          username: username,
          email: '$username@example.com',
          fullName: 'MTXO Labs Student',
          bio: 'Passionate about AI and machine learning, exploring new technologies and expanding my knowledge.',
          role: 'student',
          createdAt: DateTime.now().subtract(const Duration(days: 120)),
          preferences: {
            'darkMode': true,
            'notifications': {
              'courseUpdates': true,
              'assignmentReminders': true,
              'communityActivity': false,
            },
          },
          enrolledCourses: [
            {
              'courseId': '1',
              'progress': 65,
              'enrolledAt': DateTime.now().subtract(const Duration(days: 30)).toIso8601String(),
            },
            {
              'courseId': '2',
              'progress': 22,
              'enrolledAt': DateTime.now().subtract(const Duration(days: 15)).toIso8601String(),
            },
          ],
          achievements: [
            'FIRST_LOGIN',
            'FIRST_COURSE_COMPLETED',
            'QUIZ_MASTER',
          ],
        );
        
        _authToken = 'mock-token-${DateTime.now().millisecondsSinceEpoch}';
        _isAuthenticated = true;
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
        await prefs.setString('auth_token', _authToken!);
        
        return true;
      } else {
        // Real API signin for production
        final response = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/auth/signin'),
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'username': username,
            'password': password,
          }),
        );
        
        if (response.statusCode == 200) {
          final responseData = jsonDecode(response.body);
          
          _currentUser = User.fromJson(responseData['user']);
          _authToken = responseData['token'];
          _isAuthenticated = true;
          
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
          await prefs.setString('auth_token', _authToken!);
          
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      debugPrint('Error signing in: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Sign up a new user
  Future<bool> signUp(String username, String email, String password) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      if (ApiConfig.useMockData) {
        // Mock sign up for development
        await Future.delayed(const Duration(seconds: 1));
        _currentUser = User(
          id: 1,
          username: username,
          email: email,
          fullName: null,
          bio: null,
          role: 'student',
          createdAt: DateTime.now(),
        );
        
        _authToken = 'mock-token-${DateTime.now().millisecondsSinceEpoch}';
        _isAuthenticated = true;
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
        await prefs.setString('auth_token', _authToken!);
        
        return true;
      } else {
        // Real API signup for production
        final response = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/auth/signup'),
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'username': username,
            'email': email,
            'password': password,
          }),
        );
        
        if (response.statusCode == 201) {
          final responseData = jsonDecode(response.body);
          
          _currentUser = User.fromJson(responseData['user']);
          _authToken = responseData['token'];
          _isAuthenticated = true;
          
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
          await prefs.setString('auth_token', _authToken!);
          
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      debugPrint('Error signing up: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Sign out the user
  Future<void> signOut() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('user');
      await prefs.remove('auth_token');
      
      _currentUser = null;
      _authToken = null;
      _isAuthenticated = false;
    } catch (e) {
      debugPrint('Error signing out: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Reset password
  Future<bool> resetPassword(String email) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      if (ApiConfig.useMockData) {
        // Mock password reset for development
        await Future.delayed(const Duration(seconds: 1));
        return true;
      } else {
        // Real API password reset for production
        final response = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/auth/reset-password'),
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'email': email,
          }),
        );
        
        return response.statusCode == 200;
      }
    } catch (e) {
      debugPrint('Error resetting password: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Update user profile
  Future<bool> updateProfile(Map<String, dynamic> userData) async {
    if (_currentUser == null || _authToken == null) {
      return false;
    }
    
    _isLoading = true;
    notifyListeners();
    
    try {
      if (ApiConfig.useMockData) {
        // Mock profile update for development
        await Future.delayed(const Duration(seconds: 1));
        
        // Update user object with new data
        _currentUser = _currentUser!.copyWith(
          fullName: userData['fullName'] ?? _currentUser!.fullName,
          email: userData['email'] ?? _currentUser!.email,
          bio: userData['bio'] ?? _currentUser!.bio,
        );
        
        // Save updated user to shared preferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
        
        return true;
      } else {
        // Real API profile update for production
        final response = await http.patch(
          Uri.parse('${ApiConfig.baseUrl}/users/profile'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_authToken',
          },
          body: jsonEncode(userData),
        );
        
        if (response.statusCode == 200) {
          final responseData = jsonDecode(response.body);
          _currentUser = User.fromJson(responseData);
          
          // Save updated user to shared preferences
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
          
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      debugPrint('Error updating profile: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Update user preferences
  Future<bool> updatePreferences(Map<String, dynamic> preferences) async {
    if (_currentUser == null || _authToken == null) {
      return false;
    }
    
    _isLoading = true;
    notifyListeners();
    
    try {
      if (ApiConfig.useMockData) {
        // Mock preferences update for development
        await Future.delayed(const Duration(seconds: 1));
        
        // Current preferences
        final currentPreferences = _currentUser!.preferences ?? {};
        
        // Update user object with new preferences
        _currentUser = _currentUser!.copyWith(
          preferences: {
            ...currentPreferences,
            ...preferences,
          },
        );
        
        // Save updated user to shared preferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
        
        return true;
      } else {
        // Real API preferences update for production
        final response = await http.patch(
          Uri.parse('${ApiConfig.baseUrl}/users/preferences'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_authToken',
          },
          body: jsonEncode(preferences),
        );
        
        if (response.statusCode == 200) {
          final responseData = jsonDecode(response.body);
          _currentUser = User.fromJson(responseData);
          
          // Save updated user to shared preferences
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
          
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      debugPrint('Error updating preferences: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Change password
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    if (_currentUser == null || _authToken == null) {
      return false;
    }
    
    _isLoading = true;
    notifyListeners();
    
    try {
      if (ApiConfig.useMockData) {
        // Mock password change for development
        await Future.delayed(const Duration(seconds: 1));
        return true;
      } else {
        // Real API password change for production
        final response = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/auth/change-password'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_authToken',
          },
          body: jsonEncode({
            'currentPassword': currentPassword,
            'newPassword': newPassword,
          }),
        );
        
        return response.statusCode == 200;
      }
    } catch (e) {
      debugPrint('Error changing password: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// Check if the user has a specific achievement
  bool hasAchievement(String achievementId) {
    if (_currentUser == null || _currentUser!.achievements == null) {
      return false;
    }
    return _currentUser!.achievements!.contains(achievementId);
  }
  
  /// Get all user achievements
  List<String> getUserAchievements() {
    if (_currentUser == null || _currentUser!.achievements == null) {
      return [];
    }
    return _currentUser!.achievements!;
  }
  
  /// Check if a dark mode preference is set
  bool isDarkModeEnabled() {
    if (_currentUser == null || _currentUser!.preferences == null) {
      return false;
    }
    return _currentUser!.preferences!['darkMode'] ?? false;
  }

  /// Update dark mode preference
  Future<bool> setDarkModeEnabled(bool enabled) {
    return updatePreferences({'darkMode': enabled});
  }
  
  /// Quick login for development (bypass authentication for testing)
  Future<bool> quickLogin() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Create a mock user for testing
      _currentUser = User(
        id: 1,
        username: 'mtxo_student',
        email: 'student@mtxolabs.com',
        fullName: 'MTXO Labs Student',
        profileImage: 'https://randomuser.me/api/portraits/men/44.jpg',
        bio: 'Passionate about AI and machine learning, exploring new technologies and expanding my knowledge through MTXO Labs courses.',
        role: 'student',
        createdAt: DateTime.now().subtract(const Duration(days: 120)),
        preferences: {
          'darkMode': true,
          'notifications': {
            'courseUpdates': true,
            'assignmentReminders': true,
            'communityActivity': false,
          },
        },
        enrolledCourses: [
          {
            'courseId': '1',
            'progress': 65,
            'enrolledAt': DateTime.now().subtract(const Duration(days: 30)).toIso8601String(),
          },
          {
            'courseId': '2',
            'progress': 22,
            'enrolledAt': DateTime.now().subtract(const Duration(days: 15)).toIso8601String(),
          },
        ],
        achievements: [
          'FIRST_LOGIN',
          'FIRST_COURSE_COMPLETED',
          'QUIZ_MASTER',
        ],
      );
      
      _authToken = 'mock-token-${DateTime.now().millisecondsSinceEpoch}';
      _isAuthenticated = true;
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
      await prefs.setString('auth_token', _authToken!);
      
      return true;
    } catch (e) {
      debugPrint('Error in quick login: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}