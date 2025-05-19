import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:mtxo_labs_edtech/models/user.dart';
import 'package:mtxo_labs_edtech/services/api_service.dart';

class AuthService extends ChangeNotifier {
  User? _currentUser;
  String? _token;
  bool _isLoading = false;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  
  // Getters
  User? get currentUser => _currentUser;
  String? get token => _token;
  bool get isAuthenticated => _currentUser != null && _token != null;
  bool get isLoading => _isLoading;
  
  // Initialize auth service
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Load token from secure storage
      final storedToken = await _secureStorage.read(key: 'auth_token');
      
      if (storedToken != null) {
        // Check if token is expired
        if (JwtDecoder.isExpired(storedToken)) {
          // Token expired, log out user
          await _secureStorage.delete(key: 'auth_token');
          _token = null;
          _currentUser = null;
        } else {
          // Valid token, load user data
          _token = storedToken;
          await _loadUserData();
        }
      }
    } catch (e) {
      debugPrint('Error initializing auth service: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Load user data from token or API
  Future<void> _loadUserData() async {
    if (_token == null) return;
    
    try {
      // First try to decode user from token
      Map<String, dynamic> decodedToken = JwtDecoder.decode(_token!);
      
      if (decodedToken.containsKey('user')) {
        _currentUser = User.fromJson(decodedToken['user']);
      } else {
        // If token doesn't contain user data, fetch from API
        final apiService = ApiService();
        final userData = await apiService.get('/api/users/profile');
        _currentUser = User.fromJson(userData);
      }
    } catch (e) {
      debugPrint('Error loading user data: $e');
      _token = null;
      _currentUser = null;
      await _secureStorage.delete(key: 'auth_token');
    }
  }
  
  // Sign in user
  Future<bool> signIn(String username, String password) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final apiService = ApiService();
      final response = await apiService.post('/api/auth/login', {
        'username': username,
        'password': password,
      });
      
      // Save token
      _token = response['token'];
      await _secureStorage.write(key: 'auth_token', value: _token);
      
      // Set user data
      _currentUser = User.fromJson(response['user']);
      
      return true;
    } catch (e) {
      debugPrint('Sign in error: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Sign up user
  Future<bool> signUp(String username, String email, String password, String fullName) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final apiService = ApiService();
      await apiService.post('/api/auth/signup', {
        'username': username,
        'email': email,
        'password': password,
        'fullName': fullName,
      });
      
      return true;
    } catch (e) {
      debugPrint('Sign up error: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Forgot password
  Future<bool> forgotPassword(String email) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final apiService = ApiService();
      await apiService.post('/api/auth/forgot-password', {
        'email': email,
      });
      
      return true;
    } catch (e) {
      debugPrint('Forgot password error: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Sign out user
  Future<void> signOut() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      await _secureStorage.delete(key: 'auth_token');
      _token = null;
      _currentUser = null;
    } catch (e) {
      debugPrint('Sign out error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Update user profile
  Future<bool> updateProfile(Map<String, dynamic> userData) async {
    if (_currentUser == null) return false;
    
    _isLoading = true;
    notifyListeners();
    
    try {
      final apiService = ApiService();
      final response = await apiService.put('/api/users/profile', userData);
      
      // Update current user with new data
      _currentUser = User.fromJson(response);
      
      return true;
    } catch (e) {
      debugPrint('Update profile error: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Update user preferences
  Future<bool> updatePreferences(Map<String, dynamic> preferences) async {
    if (_currentUser == null) return false;
    
    _isLoading = true;
    notifyListeners();
    
    try {
      final apiService = ApiService();
      final response = await apiService.put('/api/users/preferences', {
        'preferences': preferences,
      });
      
      // Update current user preferences
      _currentUser = User.fromJson(response);
      
      return true;
    } catch (e) {
      debugPrint('Update preferences error: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}