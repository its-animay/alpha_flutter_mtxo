import 'package:flutter/foundation.dart';
import 'package:mtxo_labs_edtech/models/course.dart';
import 'package:mtxo_labs_edtech/services/api_service.dart';

class CourseService {
  final ApiService _apiService = ApiService();
  
  // Fetch all courses
  Future<List<Course>> getCourses() async {
    try {
      final data = await _apiService.get('/api/courses');
      
      if (data is List) {
        return data.map((course) => Course.fromJson(course)).toList();
      }
      
      return [];
    } catch (e) {
      debugPrint('Error fetching courses: $e');
      return [];
    }
  }
  
  // Fetch a specific course by ID
  Future<Course?> getCourseById(String courseId) async {
    try {
      final data = await _apiService.get('/api/courses/$courseId');
      return Course.fromJson(data);
    } catch (e) {
      debugPrint('Error fetching course details: $e');
      return null;
    }
  }
  
  // Get user enrollments
  Future<List<dynamic>> getUserEnrollments() async {
    try {
      final data = await _apiService.get('/api/enrollments');
      return data;
    } catch (e) {
      debugPrint('Error fetching user enrollments: $e');
      return [];
    }
  }
  
  // Enroll in a course
  Future<bool> enrollInCourse(String courseId) async {
    try {
      await _apiService.post('/api/enrollments', {
        'courseId': courseId,
      });
      return true;
    } catch (e) {
      debugPrint('Error enrolling in course: $e');
      return false;
    }
  }
  
  // Update lesson progress
  Future<bool> updateLessonProgress(String courseId, String lessonId, bool completed) async {
    try {
      await _apiService.put('/api/enrollments/progress', {
        'courseId': courseId,
        'lessonId': lessonId,
        'completed': completed,
      });
      return true;
    } catch (e) {
      debugPrint('Error updating lesson progress: $e');
      return false;
    }
  }
  
  // Get popular courses
  Future<List<Course>> getPopularCourses() async {
    try {
      final data = await _apiService.get('/api/courses/popular');
      
      if (data is List) {
        return data.map((course) => Course.fromJson(course)).toList();
      }
      
      return [];
    } catch (e) {
      debugPrint('Error fetching popular courses: $e');
      return [];
    }
  }
  
  // Get recommended courses
  Future<List<Course>> getRecommendedCourses() async {
    try {
      final data = await _apiService.get('/api/courses/recommendations');
      
      if (data is List) {
        return data.map((course) => Course.fromJson(course)).toList();
      }
      
      return [];
    } catch (e) {
      debugPrint('Error fetching recommended courses: $e');
      return [];
    }
  }
  
  // Search courses by query
  Future<List<Course>> searchCourses(String query) async {
    try {
      final data = await _apiService.get('/api/courses?search=$query');
      
      if (data is List) {
        return data.map((course) => Course.fromJson(course)).toList();
      }
      
      return [];
    } catch (e) {
      debugPrint('Error searching courses: $e');
      return [];
    }
  }
  
  // Filter courses
  Future<List<Course>> filterCourses({
    String? skillLevel,
    List<String>? tags,
    String? priceType,
    String? duration,
  }) async {
    try {
      // Build query parameters
      final queryParams = <String, dynamic>{};
      
      if (skillLevel != null && skillLevel != 'All') {
        queryParams['skillLevel'] = skillLevel;
      }
      
      if (tags != null && tags.isNotEmpty) {
        queryParams['tags'] = tags.join(',');
      }
      
      if (priceType != null && priceType != 'All') {
        queryParams['priceType'] = priceType;
      }
      
      if (duration != null && duration != 'All') {
        queryParams['duration'] = duration;
      }
      
      // Convert query params to URL query string
      final queryString = queryParams.entries
          .map((e) => '${e.key}=${Uri.encodeComponent(e.value.toString())}')
          .join('&');
      
      final url = '/api/courses${queryString.isNotEmpty ? '?$queryString' : ''}';
      
      final data = await _apiService.get(url);
      
      if (data is List) {
        return data.map((course) => Course.fromJson(course)).toList();
      }
      
      return [];
    } catch (e) {
      debugPrint('Error filtering courses: $e');
      return [];
    }
  }
  
  // Create initial payment intent for course purchase
  Future<Map<String, dynamic>?> createPaymentIntent(String courseId, double amount) async {
    try {
      final data = await _apiService.post('/api/payments/create-intent', {
        'courseId': courseId,
        'amount': amount,
      });
      
      return data;
    } catch (e) {
      debugPrint('Error creating payment intent: $e');
      return null;
    }
  }
  
  // Create subscription for course
  Future<Map<String, dynamic>?> createSubscription(String courseId) async {
    try {
      final data = await _apiService.post('/api/payments/create-subscription', {
        'courseId': courseId,
      });
      
      return data;
    } catch (e) {
      debugPrint('Error creating subscription: $e');
      return null;
    }
  }
}