import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/course.dart';
import '../config/api_config.dart';

/// A service that handles course-related functionality
class CourseService {
  static const String _enrollmentsKey = 'user_enrollments';
  static const String _courseProgressKey = 'course_progress';
  
  /// Get all available courses
  Future<List<Course>> getCourses() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/courses'),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> coursesJson = jsonDecode(response.body);
        return coursesJson.map((json) => Course.fromJson(json)).toList();
      } else {
        // Use local fallback data if the API request fails
        return _getLocalCourses();
      }
    } catch (e) {
      // Use local fallback data if there is an error
      return _getLocalCourses();
    }
  }
  
  /// Get a course by ID
  Future<Course?> getCourseById(String courseId) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/courses/$courseId'),
      );
      
      if (response.statusCode == 200) {
        final courseJson = jsonDecode(response.body);
        return Course.fromJson(courseJson);
      } else {
        // Try to find the course in local data if the API request fails
        final courses = await _getLocalCourses();
        return courses.firstWhere(
          (course) => course.id == courseId,
          orElse: () => throw Exception('Course not found'),
        );
      }
    } catch (e) {
      // Try to find the course in local data if there is an error
      try {
        final courses = await _getLocalCourses();
        return courses.firstWhere(
          (course) => course.id == courseId,
          orElse: () => throw Exception('Course not found'),
        );
      } catch (e) {
        return null;
      }
    }
  }
  
  /// Get recommended courses for the user
  Future<List<Course>> getRecommendedCourses() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/courses/recommended'),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> coursesJson = jsonDecode(response.body);
        return coursesJson.map((json) => Course.fromJson(json)).toList();
      } else {
        // Return a subset of local courses if the API request fails
        final courses = await _getLocalCourses();
        return courses.take(5).toList();
      }
    } catch (e) {
      // Return a subset of local courses if there is an error
      final courses = await _getLocalCourses();
      return courses.take(5).toList();
    }
  }
  
  /// Get user enrollments
  Future<List<dynamic>> getUserEnrollments() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedEnrollments = prefs.getString(_enrollmentsKey);
      
      if (savedEnrollments != null) {
        return jsonDecode(savedEnrollments) as List<dynamic>;
      }
      
      return [];
    } catch (e) {
      return [];
    }
  }
  
  /// Enroll the user in a course
  Future<bool> enrollInCourse(String courseId) async {
    try {
      final course = await getCourseById(courseId);
      if (course == null) return false;
      
      // Save enrollment to local storage
      final enrollments = await getUserEnrollments();
      
      // Check if already enrolled
      if (enrollments.any((e) => e['courseId'] == courseId)) {
        return true;
      }
      
      enrollments.add({
        'courseId': courseId,
        'courseName': course.title,
        'instructorName': course.instructor.name,
        'thumbnail': course.thumbnail,
        'enrollmentDate': DateTime.now().toIso8601String(),
        'lastAccessDate': DateTime.now().toIso8601String(),
        'progress': 0,
      });
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_enrollmentsKey, jsonEncode(enrollments));
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /// Mark a lesson as complete
  Future<bool> markLessonAsComplete(String courseId, String moduleId, String lessonId) async {
    try {
      // Update course in local storage
      final course = await getCourseById(courseId);
      if (course == null) return false;
      
      // Update course progress
      final prefs = await SharedPreferences.getInstance();
      Map<String, dynamic> progressMap = {};
      
      final savedProgress = prefs.getString(_courseProgressKey);
      if (savedProgress != null) {
        progressMap = jsonDecode(savedProgress) as Map<String, dynamic>;
      }
      
      // Initialize course progress if it does not exist
      if (!progressMap.containsKey(courseId)) {
        progressMap[courseId] = {
          'completedLessons': <String>[],
          'lastAccessedModule': moduleId,
          'lastAccessedLesson': lessonId,
        };
      }
      
      // Add the lesson to completed lessons if not already completed
      final completedLessons = List<String>.from(progressMap[courseId]['completedLessons']);
      if (!completedLessons.contains(lessonId)) {
        completedLessons.add(lessonId);
        progressMap[courseId]['completedLessons'] = completedLessons;
      }
      
      // Update last accessed module and lesson
      progressMap[courseId]['lastAccessedModule'] = moduleId;
      progressMap[courseId]['lastAccessedLesson'] = lessonId;
      
      // Save progress to shared preferences
      await prefs.setString(_courseProgressKey, jsonEncode(progressMap));
      
      // Update enrollment progress
      await _updateEnrollmentProgress(courseId, course);
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /// Update the progress of a course enrollment
  Future<void> _updateEnrollmentProgress(String courseId, Course course) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Get course progress
      final savedProgress = prefs.getString(_courseProgressKey);
      if (savedProgress == null) return;
      
      final progressMap = jsonDecode(savedProgress) as Map<String, dynamic>;
      if (!progressMap.containsKey(courseId)) return;
      
      final completedLessons = List<String>.from(progressMap[courseId]['completedLessons']);
      
      // Calculate total number of lessons in the course
      int totalLessons = 0;
      for (final module in course.modules ?? []) {
        totalLessons += module.lessons.length.toInt();
      }
      
      // Calculate progress percentage
      final progress = totalLessons > 0 
          ? (completedLessons.length / totalLessons * 100).round() 
          : 0;
      
      // Update enrollment progress
      final enrollments = await getUserEnrollments();
      final enrollmentIndex = enrollments.indexWhere((e) => e['courseId'] == courseId);
      
      if (enrollmentIndex != -1) {
        enrollments[enrollmentIndex]['progress'] = progress;
        enrollments[enrollmentIndex]['lastAccessDate'] = DateTime.now().toIso8601String();
        
        await prefs.setString(_enrollmentsKey, jsonEncode(enrollments));
      }
    } catch (e) {
      // Handle error silently
    }
  }
  
  /// Get user certificates
  Future<List<dynamic>> getUserCertificates() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final enrollments = await getUserEnrollments();
      
      // Get course progress
      final savedProgress = prefs.getString(_courseProgressKey);
      if (savedProgress == null) return [];
      
      final progressMap = jsonDecode(savedProgress) as Map<String, dynamic>;
      
      // Find completed courses (progress = 100%)
      final completedCourses = enrollments.where((e) => e['progress'] == 100).toList();
      
      // Generate certificates for completed courses
      final certificates = completedCourses.map((course) {
        return {
          'id': 'cert-${course['courseId']}',
          'courseId': course['courseId'],
          'courseName': course['courseName'],
          'studentName': 'Current User', // This would come from the auth service in a real app
          'issueDate': DateTime.now().subtract(const Duration(days: 7)).toIso8601String(),
          'expiryDate': DateTime.now().add(const Duration(days: 365)).toIso8601String(),
        };
      }).toList();
      
      return certificates;
    } catch (e) {
      return [];
    }
  }
  
  /// Get local course data
  Future<List<Course>> _getLocalCourses() async {
    // In a real app, this would load course data from a local JSON file
    // For simplicity, we'll just return a few hardcoded courses
    
    final courses = [
      Course(
        id: '1',
        title: 'Mastering Large Language Models',
        subtitle: 'From Principles to Advanced Techniques',
        description: 'Learn how to effectively use, fine-tune, and deploy large language models for real-world applications.',
        thumbnail: 'https://images.unsplash.com/photo-1677442135188-d8f432fafd28?q=80&w=1000',
        instructor: Instructor(
          id: '101',
          name: 'Dr. Alex Chen',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          title: 'AI Research Scientist',
          bio: 'Former lead researcher at OpenAI with 10+ years of experience in NLP and machine learning.',
        ),
        skillLevel: 'Intermediate',
        tags: ['GenAI', 'LLMs', 'Python', 'NLP'],
        rating: 4.8,
        reviewCount: 342,
        studentsEnrolled: 2453,
        price: 129.99,
        priceType: 'Paid',
        duration: 'Medium',
        totalLessons: 24,
        totalDuration: '12 hours',
        whatYoullLearn: [
          'Understand the architecture and capabilities of modern LLMs',
          'Learn prompt engineering techniques for better results',
          'Fine-tune models for specific domains and tasks',
          'Build applications using LLM APIs',
          'Deploy models efficiently in production environments',
        ],
        prerequisites: [
          'Basic understanding of machine learning concepts',
          'Python programming experience',
          'Familiarity with neural networks (recommended)',
        ],
        modules: [
          CourseModule(
            id: 'm1',
            title: 'Foundations of Large Language Models',
            lessons: [
              CourseLessonItem(
                id: 'l1',
                title: 'Introduction to Large Language Models',
                duration: '18 min',
                isFree: true,
                description: 'Overview of what LLMs are and how they are revolutionizing AI.',
              ),
              CourseLessonItem(
                id: 'l2',
                title: 'Evolution of NLP: From Rule-based to Neural',
                duration: '24 min',
                isFree: false,
                description: 'Historical context of NLP development leading to modern LLMs.',
              ),
              CourseLessonItem(
                id: 'l3',
                title: 'Key Architectures: Transformers Explained',
                duration: '32 min',
                isFree: false,
                description: 'Detailed walkthrough of transformer architecture that powers LLMs.',
              ),
            ],
            isFree: true,
            description: 'Learn the fundamental concepts behind large language models.',
            duration: '74 min',
          ),
          CourseModule(
            id: 'm2',
            title: 'Prompt Engineering Techniques',
            lessons: [
              CourseLessonItem(
                id: 'l4',
                title: 'Basic Prompting Strategies',
                duration: '28 min',
                isFree: false,
                description: 'Learn how to craft effective prompts for different use cases.',
              ),
              CourseLessonItem(
                id: 'l5',
                title: 'Advanced Prompt Engineering',
                duration: '35 min',
                isFree: false,
                description: 'Explore techniques like few-shot learning and chain-of-thought prompting.',
              ),
            ],
            isFree: false,
            description: 'Master the art of crafting effective prompts for LLMs.',
            duration: '63 min',
          ),
        ],
        reviews: [
          CourseReview(
            id: 'r1',
            userName: 'Michael S.',
            rating: 5.0,
            comment: 'Incredible course! The instructor explains complex concepts in a way that is easy to understand. Highly recommended for anyone interested in LLMs.',
            date: '2023-12-15',
          ),
          CourseReview(
            id: 'r2',
            userName: 'Sarah J.',
            rating: 4.5,
            comment: 'Very comprehensive and practical. The hands-on exercises really helped solidify my understanding.',
            date: '2023-11-28',
          ),
        ],
        enrollmentOptions: CourseEnrollmentOptions(
          freeTrial: true,
          oneTime: CourseOneTimeEnrollment(
            price: 129.99,
            discountedPrice: 99.99,
          ),
          subscription: CourseSubscriptionEnrollment(
            monthly: 19.99,
            yearly: 199.99,
          ),
        ),
      ),
      Course(
        id: '2',
        title: 'AI Agents: Building Autonomous Systems',
        subtitle: 'From Theory to Implementation',
        description: 'Learn how to design, develop, and deploy autonomous AI agents for various domains.',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000',
        instructor: Instructor(
          id: '102',
          name: 'Dr. Maya Patel',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          title: 'AI Systems Architect',
          bio: 'Expert in multi-agent systems with experience at Google DeepMind.',
        ),
        skillLevel: 'Advanced',
        tags: ['GenAI', 'Agents', 'Python', 'MLOps'],
        rating: 4.7,
        reviewCount: 213,
        studentsEnrolled: 1876,
        price: 149.99,
        priceType: 'Paid',
        duration: 'Long',
        totalLessons: 32,
        totalDuration: '18 hours',
        whatYoullLearn: [
          'Understand autonomous agent architectures',
          'Design single and multi-agent systems',
          'Implement reinforcement learning for agent training',
          'Create agents that can reason, plan, and communicate',
          'Deploy and monitor agent systems in production',
        ],
        prerequisites: [
          'Strong Python programming skills',
          'Understanding of machine learning fundamentals',
          'Experience with at least one deep learning framework',
        ],
        modules: [
          CourseModule(
            id: 'm1',
            title: 'Foundations of AI Agents',
            lessons: [
              CourseLessonItem(
                id: 'l1',
                title: 'Introduction to AI Agents',
                duration: '22 min',
                isFree: true,
                description: 'Overview of what AI agents are and their real-world applications.',
              ),
              CourseLessonItem(
                id: 'l2',
                title: 'Agent Architectures and Components',
                duration: '34 min',
                isFree: false,
                description: 'Detailed exploration of different agent architectures and their components.',
              ),
            ],
            isFree: true,
            description: 'Understanding the fundamentals of AI agents.',
            duration: '56 min',
          ),
        ],
        reviews: [
          CourseReview(
            id: 'r1',
            userName: 'David L.',
            rating: 5.0,
            comment: 'Outstanding course on AI agents. The practical examples really helped me understand how to build these systems.',
            date: '2023-12-05',
          ),
        ],
        enrollmentOptions: CourseEnrollmentOptions(
          freeTrial: true,
          oneTime: CourseOneTimeEnrollment(
            price: 149.99,
            discountedPrice: 119.99,
          ),
          subscription: CourseSubscriptionEnrollment(
            monthly: 24.99,
            yearly: 249.99,
          ),
        ),
      ),
      Course(
        id: '3',
        title: 'Computer Vision with Deep Learning',
        subtitle: 'From Basics to State-of-the-Art',
        description: 'Comprehensive guide to modern computer vision techniques using deep learning.',
        thumbnail: 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=1000',
        instructor: Instructor(
          id: '103',
          name: 'Prof. James Wilson',
          avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
          title: 'Computer Vision Researcher',
          bio: 'Lead author of several landmark papers in computer vision and deep learning.',
        ),
        skillLevel: 'Intermediate',
        tags: ['Computer Vision', 'Python', 'MLOps'],
        rating: 4.9,
        reviewCount: 456,
        studentsEnrolled: 3241,
        price: 0,
        priceType: 'Free',
        duration: 'Medium',
        totalLessons: 28,
        totalDuration: '16 hours',
        whatYoullLearn: [
          'Master fundamental computer vision concepts',
          'Implement CNNs, RNNs, and Transformers for vision tasks',
          'Build image classification, segmentation, and object detection systems',
          'Deploy vision models to edge devices',
          'Optimize models for real-time performance',
        ],
        prerequisites: [
          'Python programming experience',
          'Basic understanding of neural networks',
          'Linear algebra and calculus fundamentals',
        ],
        modules: [
          CourseModule(
            id: 'm1',
            title: 'Computer Vision Fundamentals',
            lessons: [
              CourseLessonItem(
                id: 'l1',
                title: 'Introduction to Computer Vision',
                duration: '25 min',
                isFree: true,
                description: 'Overview of computer vision and its applications in the real world.',
              ),
              CourseLessonItem(
                id: 'l2',
                title: 'Image Processing Basics',
                duration: '30 min',
                isFree: true,
                description: 'Essential image processing techniques for computer vision tasks.',
              ),
            ],
            isFree: true,
            description: 'Learn the essential concepts of computer vision.',
            duration: '55 min',
          ),
        ],
        reviews: [
          CourseReview(
            id: 'r1',
            userName: 'Emma T.',
            rating: 5.0,
            comment: 'The best computer vision course I have taken. Absolutely worth every minute of your time!',
            date: '2023-11-10',
          ),
        ],
        enrollmentOptions: CourseEnrollmentOptions(
          freeTrial: false,
          oneTime: CourseOneTimeEnrollment(
            price: 0,
          ),
          subscription: CourseSubscriptionEnrollment(
            monthly: 0,
            yearly: 0,
          ),
        ),
      ),
    ];
    
    return courses;
  }
}