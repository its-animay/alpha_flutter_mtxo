import apiRequest from './apiService';
import { API_ENDPOINTS } from './config';

// Types for Course API service
export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
  completed?: boolean;
  videoUrl?: string;
  description: string;
  resources?: {
    id: string;
    title: string;
    type: "pdf" | "code" | "link" | "video";
    url: string;
  }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
  isFree: boolean;
  description: string;
  duration: string;
}

export interface CourseReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  tags: string[];
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  price: number;
  priceType: "Free" | "Paid";
  duration: "Short" | "Medium" | "Long";
  totalLessons: number;
  totalDuration: string;
  whatYoullLearn: string[];
  prerequisites: string[];
  modules: CourseModule[];
  reviews: CourseReview[];
  enrollmentOptions: {
    freeTrial: boolean;
    oneTime: {
      price: number;
      discountedPrice?: number;
    };
    subscription: {
      monthly: number;
      yearly: number;
    };
  };
}

export interface CourseFilterOptions {
  skillLevel?: string;
  tags?: string[];
  priceType?: string;
  duration?: string;
  searchQuery?: string;
}

export interface EnrollmentRequest {
  courseId: string;
  planType: 'one-time' | 'monthly' | 'yearly';
}

/**
 * Course Service for course-related operations
 */
const CourseService = {
  /**
   * Get all courses
   * @param filters Optional filter parameters
   * @returns List of courses matching filters
   */
  getAllCourses: (filters?: CourseFilterOptions): Promise<Course[]> => {
    return apiRequest(API_ENDPOINTS.COURSES.GET_ALL, 'GET', null, { params: filters });
  },
  
  /**
   * Get course by ID
   * @param id Course ID
   * @returns Course details
   */
  getCourse: (id: string): Promise<Course> => {
    return apiRequest(API_ENDPOINTS.COURSES.GET_COURSE(id));
  },
  
  /**
   * Get popular courses
   * @returns List of popular courses
   */
  getPopularCourses: (): Promise<Course[]> => {
    return apiRequest(API_ENDPOINTS.COURSES.GET_POPULAR);
  },
  
  /**
   * Get featured courses
   * @returns List of featured courses
   */
  getFeaturedCourses: (): Promise<Course[]> => {
    return apiRequest(API_ENDPOINTS.COURSES.GET_FEATURED);
  },
  
  /**
   * Get recommended courses for current user
   * @returns List of recommended courses
   */
  getRecommendedCourses: (): Promise<Course[]> => {
    return apiRequest(API_ENDPOINTS.COURSES.GET_RECOMMENDATIONS);
  },
  
  /**
   * Enroll in a course
   * @param enrollment Enrollment request details
   * @returns Enrollment result
   */
  enrollInCourse: (enrollment: EnrollmentRequest): Promise<{success: boolean, message: string, enrollmentId: number}> => {
    return apiRequest(API_ENDPOINTS.ENROLLMENTS.ENROLL, 'POST', enrollment);
  },
  
  /**
   * Get user's enrolled courses
   * @returns List of user enrollments
   */
  getUserEnrollments: (): Promise<any[]> => {
    return apiRequest(API_ENDPOINTS.ENROLLMENTS.GET_USER_ENROLLMENTS);
  },
  
  /**
   * Update course progress
   * @param enrollmentId Enrollment ID
   * @param progress Progress percentage (0-100)
   * @param moduleId Current module ID
   * @param lessonId Current lesson ID
   * @returns Updated enrollment
   */
  updateProgress: (
    enrollmentId: number,
    progress: number,
    moduleId: string,
    lessonId: string
  ): Promise<any> => {
    return apiRequest(
      API_ENDPOINTS.ENROLLMENTS.UPDATE_PROGRESS(enrollmentId),
      'PUT',
      { progress, moduleId, lessonId }
    );
  }
};

export default CourseService;