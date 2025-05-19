import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  late Dio _dio;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  bool _useMockData = false; // Set to true for development with mock data
  
  static final ApiService _instance = ApiService._internal();
  
  // Factory constructor
  factory ApiService() {
    return _instance;
  }
  
  // Internal constructor for singleton pattern
  ApiService._internal() {
    _initDio();
  }
  
  // Initialize Dio with base settings and interceptors
  void _initDio() {
    final baseOptions = BaseOptions(
      baseUrl: 'https://api.mtxolabs.com', // Replace with your actual API URL
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );
    
    _dio = Dio(baseOptions);
    
    // Add request interceptor to attach auth token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Add auth token if available
        final token = await _secureStorage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException error, handler) async {
        // Handle 401 Unauthorized errors
        if (error.response?.statusCode == 401) {
          // Clear token from storage on 401 - token expired or invalid
          await _secureStorage.delete(key: 'auth_token');
        }
        return handler.next(error);
      },
    ));
  }
  
  // Set mock data mode
  void setUseMockData(bool useMock) {
    _useMockData = useMock;
  }
  
  // GET request
  Future<dynamic> get(String endpoint) async {
    try {
      if (_useMockData) {
        // Return mock data for development
        return await _getMockData(endpoint);
      }
      
      final response = await _dio.get(endpoint);
      return response.data;
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }
  
  // POST request
  Future<dynamic> post(String endpoint, dynamic data) async {
    try {
      if (_useMockData) {
        // Return mock response for development
        return await _getMockResponse(endpoint, data);
      }
      
      final response = await _dio.post(endpoint, data: data);
      return response.data;
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }
  
  // PUT request
  Future<dynamic> put(String endpoint, dynamic data) async {
    try {
      if (_useMockData) {
        // Return mock response for development
        return await _getMockResponse(endpoint, data);
      }
      
      final response = await _dio.put(endpoint, data: data);
      return response.data;
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }
  
  // DELETE request
  Future<dynamic> delete(String endpoint, {dynamic data}) async {
    try {
      if (_useMockData) {
        // Return mock response for development
        return await _getMockResponse(endpoint, data);
      }
      
      final response = await _dio.delete(
        endpoint,
        data: data,
      );
      return response.data;
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }
  
  // Upload file
  Future<dynamic> uploadFile(String endpoint, File file, {Map<String, dynamic>? extraData}) async {
    try {
      if (_useMockData) {
        // Return mock response for development
        return {
          'success': true,
          'fileUrl': 'https://example.com/mockfile.jpg',
        };
      }
      
      String fileName = file.path.split('/').last;
      FormData formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(file.path, filename: fileName),
        ...?extraData,
      });
      
      final response = await _dio.post(endpoint, data: formData);
      return response.data;
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }
  
  // Handle API errors
  void _handleError(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout) {
      debugPrint('Request timeout: ${error.message}');
    } else if (error.type == DioExceptionType.badResponse) {
      final statusCode = error.response?.statusCode;
      final responseData = error.response?.data;
      
      debugPrint('Bad response ($statusCode): $responseData');
    } else {
      debugPrint('API Error: ${error.message}');
    }
  }
  
  // Helper methods for mock data
  Future<dynamic> _getMockData(String endpoint) async {
    await Future.delayed(const Duration(milliseconds: 300)); // Simulate network delay
    
    // Map endpoints to mock data
    if (endpoint.contains('/api/users/profile')) {
      return {
        'id': 1,
        'username': 'johndoe',
        'email': 'john.doe@example.com',
        'fullName': 'John Doe',
        'profilePicture': 'https://placehold.co/400x400/1a202c/e2e8f0?text=JD',
        'role': 'user',
        'preferences': {
          'darkMode': true,
          'notifications': {
            'email': true,
            'push': false
          }
        }
      };
    }
    
    if (endpoint.contains('/api/courses')) {
      if (endpoint.contains('/')) {
        // Specific course
        return {
          'id': 'course1',
          'title': 'Generative AI Foundations',
          'subtitle': 'Understanding the Core of Modern AI Systems',
          'description': 'Explore the fundamentals of generative AI models, their architecture, and applications in modern technology.',
          'thumbnail': 'https://placehold.co/600x400/1a202c/e2e8f0?text=GenAI+Foundations',
          'instructor': {
            'id': 'instructor1',
            'name': 'Dr. Sarah Chen',
            'avatar': 'https://placehold.co/400x400/1a202c/e2e8f0?text=SC',
            'title': 'Lead AI Researcher',
            'bio': 'Dr. Chen has over 10 years of experience in AI research and has published numerous papers on generative models.'
          },
          'skillLevel': 'Beginner',
          'tags': ['GenAI', 'Python', 'MLOps'],
          'rating': 4.8,
          'reviewCount': 245,
          'studentsEnrolled': 1289,
          'price': 59.99,
          'priceType': 'Paid',
          'duration': 'Medium',
          'totalLessons': 24,
          'totalDuration': '12h',
          'modules': [
            {
              'id': 'm1',
              'title': 'Introduction to Generative AI',
              'description': 'An introduction to generative AI concepts',
              'duration': '55min',
              'isFree': false,
              'lessons': [
                {
                  'id': 'l1',
                  'title': 'What is Generative AI?',
                  'duration': '25min',
                  'isFree': true,
                  'description': 'An overview of generative AI and its impact on technology.'
                },
                {
                  'id': 'l2',
                  'title': 'Historical Development of AI',
                  'duration': '30min',
                  'isFree': true,
                  'description': 'Trace the evolution of AI from its early days to modern generative models.'
                }
              ]
            }
          ]
        };
      } else {
        // Course list
        return [
          {
            'id': 'course1',
            'title': 'Generative AI Foundations',
            'subtitle': 'Understanding the Core of Modern AI Systems',
            'description': 'Explore the fundamentals of generative AI models.',
            'thumbnail': 'https://placehold.co/600x400/1a202c/e2e8f0?text=GenAI+Foundations',
            'instructor': {
              'id': 'instructor1',
              'name': 'Dr. Sarah Chen',
              'avatar': 'https://placehold.co/400x400/1a202c/e2e8f0?text=SC'
            },
            'skillLevel': 'Beginner',
            'tags': ['GenAI', 'Python', 'MLOps'],
            'rating': 4.8,
            'reviewCount': 245,
            'price': 59.99,
            'priceType': 'Paid'
          },
          {
            'id': 'course2',
            'title': 'Advanced LLM Applications',
            'subtitle': 'Building Production-Ready AI Systems',
            'description': 'Learn to create and deploy sophisticated applications leveraging large language models.',
            'thumbnail': 'https://placehold.co/600x400/1a202c/e2e8f0?text=Advanced+LLM',
            'instructor': {
              'id': 'instructor2',
              'name': 'Prof. Michael Torres',
              'avatar': 'https://placehold.co/400x400/1a202c/e2e8f0?text=MT'
            },
            'skillLevel': 'Advanced',
            'tags': ['LLMs', 'Python', 'MLOps'],
            'rating': 4.9,
            'reviewCount': 112,
            'price': 79.99,
            'priceType': 'Paid'
          }
        ];
      }
    }
    
    if (endpoint.contains('/api/enrollments')) {
      return [
        {
          'id': 1,
          'userId': 1,
          'courseId': 'course1',
          'enrollmentDate': '2025-01-15T10:30:00.000Z',
          'lastAccessDate': '2025-05-10T14:22:00.000Z',
          'progress': 35,
          'currentModule': 'm1',
          'currentLesson': 'l3',
          'completedLessons': ['m1.l1', 'm1.l2'],
          'certificateIssued': false,
          'status': 'active'
        }
      ];
    }
    
    if (endpoint.contains('/api/conversations')) {
      return [
        {
          'id': 1,
          'courseId': 'course1',
          'title': 'Help with Generative Models',
          'instructorId': 'instructor1',
          'createdAt': '2025-04-15T14:30:00.000Z',
          'lastMessageAt': '2025-05-10T09:15:00.000Z',
          'status': 'active',
          'unreadCount': 1,
          'instructor': {
            'id': 'instructor1',
            'name': 'Dr. Sarah Chen',
            'avatar': 'https://placehold.co/400x400/1a202c/e2e8f0?text=SC',
            'title': 'Lead AI Researcher',
            'status': 'online'
          },
          'lastMessage': {
            'content': 'Could you help me understand the difference between VAEs and GANs?',
            'senderId': 1,
            'timestamp': '2025-05-10T09:15:00.000Z'
          }
        }
      ];
    }
    
    // Return empty data for unknown endpoints
    return {};
  }
  
  // Helper method for mock responses
  Future<dynamic> _getMockResponse(String endpoint, dynamic data) async {
    await Future.delayed(const Duration(milliseconds: 300)); // Simulate network delay
    
    // Auth endpoints
    if (endpoint.contains('/api/auth/login')) {
      return {
        'token': 'mock-jwt-token',
        'user': {
          'id': 1,
          'username': 'johndoe',
          'email': 'john.doe@example.com',
          'fullName': 'John Doe',
          'profilePicture': 'https://placehold.co/400x400/1a202c/e2e8f0?text=JD',
          'role': 'user',
        }
      };
    }
    
    if (endpoint.contains('/api/auth/signup')) {
      return {
        'success': true,
        'message': 'User registered successfully',
      };
    }
    
    if (endpoint.contains('/api/auth/forgot-password')) {
      return {
        'success': true,
        'message': 'Password reset email sent',
      };
    }
    
    if (endpoint.contains('/api/users/profile')) {
      return {
        'id': 1,
        'username': 'johndoe',
        'email': 'john.doe@example.com',
        'fullName': data['fullName'] ?? 'John Doe',
        'profilePicture': 'https://placehold.co/400x400/1a202c/e2e8f0?text=JD',
        'role': 'user',
        'preferences': data['preferences'] ?? {
          'darkMode': true,
          'notifications': {
            'email': true,
            'push': false
          }
        }
      };
    }
    
    // Enrollment endpoints
    if (endpoint.contains('/api/enrollments')) {
      return {
        'id': 1,
        'userId': 1,
        'courseId': data['courseId'] ?? 'course1',
        'enrollmentDate': DateTime.now().toIso8601String(),
        'progress': 0,
        'status': 'active'
      };
    }
    
    // Conversation endpoints
    if (endpoint.contains('/api/conversations') && !endpoint.contains('/messages')) {
      return {
        'id': 1,
        'courseId': data['courseId'] ?? 'course1',
        'title': data['title'] ?? 'New Conversation',
        'instructorId': data['instructorId'] ?? 'instructor1',
        'createdAt': DateTime.now().toIso8601String(),
        'lastMessageAt': DateTime.now().toIso8601String(),
        'status': 'active',
        'instructor': {
          'id': 'instructor1',
          'name': 'Dr. Sarah Chen',
          'avatar': 'https://placehold.co/400x400/1a202c/e2e8f0?text=SC',
          'title': 'Lead AI Researcher',
          'status': 'online'
        }
      };
    }
    
    if (endpoint.contains('/messages')) {
      return {
        'id': 1,
        'conversationId': 1,
        'content': data['content'] ?? '',
        'senderId': 1,
        'timestamp': DateTime.now().toIso8601String()
      };
    }
    
    // Default response
    return {
      'success': true,
      'message': 'Operation completed successfully',
    };
  }
}