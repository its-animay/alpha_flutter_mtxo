import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../services/auth/AuthContext';
import { apiRequest } from '../services/api/apiService';
import { API_ENDPOINTS } from '../services/api/config';

// Define types for course detail
interface CourseDetailRouteParams {
  courseId: string;
}

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
}

interface CourseLessonItem {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
  description: string;
  completed?: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLessonItem[];
  isFree: boolean;
  description: string;
  duration: string;
}

interface CourseReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  skillLevel: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  price: number;
  priceType: string;
  duration: string;
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

const CourseDetailScreen = () => {
  const route = useRoute<RouteProp<Record<string, CourseDetailRouteParams>, string>>();
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  
  const courseId = route.params?.courseId;

  // Fetch course details
  const fetchCourseDetails = async () => {
    if (!courseId) {
      Alert.alert('Error', 'Course not found');
      navigation.goBack();
      return;
    }

    try {
      const courseData = await apiRequest<Course>(
        API_ENDPOINTS.COURSES.GET_COURSE(courseId)
      );
      
      setCourse(courseData);
      
      // Check if user is enrolled in this course
      if (user) {
        const enrollments = await apiRequest<any[]>(
          API_ENDPOINTS.ENROLLMENTS.GET_USER_ENROLLMENTS
        );
        
        const enrolled = enrollments?.some(
          enrollment => enrollment.courseId === courseId
        );
        
        setIsEnrolled(!!enrolled);
      }
      
      // Expand first module by default
      if (courseData?.modules?.length > 0) {
        setExpandedModules([courseData.modules[0].id]);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      Alert.alert(
        'Error',
        'Failed to load course details. Please try again later.'
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCourseDetails();
  };

  // Toggle module expansion
  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Handle enrollment
  const handleEnroll = async () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to enroll in this course',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth') }
        ]
      );
      return;
    }
    
    // If course is free, enroll immediately
    if (course?.priceType === 'Free') {
      try {
        await apiRequest(
          API_ENDPOINTS.ENROLLMENTS.ENROLL,
          'POST',
          { courseId }
        );
        
        setIsEnrolled(true);
        Alert.alert(
          'Enrolled Successfully',
          'You have been enrolled in this course.',
          [
            { 
              text: 'Start Learning', 
              onPress: () => navigation.navigate('Lesson', { 
                courseId, 
                lessonId: course?.modules[0]?.lessons[0]?.id 
              }) 
            }
          ]
        );
      } catch (error) {
        console.error('Error enrolling in course:', error);
        Alert.alert(
          'Enrollment Failed',
          'Failed to enroll in this course. Please try again later.'
        );
      }
    } else {
      // Navigate to checkout for paid courses
      navigation.navigate('CourseDetail', { courseId, showCheckout: true });
    }
  };

  // Start or continue learning
  const handleStartLearning = () => {
    if (!course) return;
    
    // Find first incomplete lesson
    let targetLessonId = '';
    let targetModuleId = '';
    
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          targetLessonId = lesson.id;
          targetModuleId = module.id;
          break;
        }
      }
      if (targetLessonId) break;
    }
    
    // If all lessons are completed, start with the first one
    if (!targetLessonId && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      targetLessonId = course.modules[0].lessons[0].id;
      targetModuleId = course.modules[0].id;
    }
    
    if (targetLessonId) {
      navigation.navigate('Lesson', { 
        courseId: course.id, 
        lessonId: targetLessonId,
        moduleId: targetModuleId
      });
    }
  };

  // Show more reviews
  const handleShowMoreReviews = () => {
    setVisibleReviews(prev => prev + 5);
  };

  // Navigate to lesson
  const handleLessonPress = (moduleId: string, lessonId: string, isFree: boolean) => {
    if (isEnrolled || isFree) {
      navigation.navigate('Lesson', { courseId, lessonId, moduleId });
    } else {
      Alert.alert(
        'Enrollment Required',
        'You need to enroll in this course to access this lesson.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enroll', onPress: handleEnroll }
        ]
      );
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading course details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Course not found
  if (!course) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Course not found or has been removed.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }>
        
        {/* Course Header */}
        <Image
          source={{ uri: course.thumbnail }}
          style={styles.courseThumbnail}
          resizeMode="cover"
        />
        
        <View style={styles.courseHeader}>
          <Text style={[styles.courseTitle, { color: theme.text }]}>
            {course.title}
          </Text>
          
          <Text style={[styles.courseSubtitle, { color: theme.gray[600] }]}>
            {course.subtitle}
          </Text>
          
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { color: theme.warning }]}>
                ★ {course.rating.toFixed(1)}
              </Text>
              <Text style={[styles.reviewCount, { color: theme.gray[600] }]}>
                ({course.reviewCount} reviews)
              </Text>
            </View>
            
            <Text style={[styles.enrollmentCount, { color: theme.gray[600] }]}>
              {course.studentsEnrolled.toLocaleString()} students
            </Text>
          </View>
          
          <View style={styles.tagsContainer}>
            {course.tags.map(tag => (
              <View 
                key={tag}
                style={[
                  styles.tagChip,
                  { backgroundColor: isDark ? theme.gray[800] : theme.gray[200] }
                ]}>
                <Text style={[styles.tagText, { color: theme.text }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Action Button */}
        <View style={styles.actionContainer}>
          {isEnrolled ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={handleStartLearning}>
              <Text style={styles.actionButtonText}>
                Continue Learning
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={handleEnroll}>
              <Text style={styles.actionButtonText}>
                {course.priceType === 'Free' ? 'Enroll for Free' : `Enroll for $${course.price.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Course Info */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About This Course
          </Text>
          
          <Text style={[styles.courseDescription, { color: theme.text }]}>
            {course.description}
          </Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.gray[600] }]}>
                Level
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {course.skillLevel}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.gray[600] }]}>
                Duration
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {course.totalDuration}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.gray[600] }]}>
                Lessons
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {course.totalLessons}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.gray[600] }]}>
                Instructor
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {course.instructor.name}
              </Text>
            </View>
          </View>
        </View>
        
        {/* What You'll Learn */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            What You'll Learn
          </Text>
          
          <View style={styles.pointsContainer}>
            {course.whatYoullLearn.map((point, index) => (
              <View key={index} style={styles.pointItem}>
                <Text style={[styles.pointIcon, { color: theme.primary }]}>•</Text>
                <Text style={[styles.pointText, { color: theme.text }]}>
                  {point}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Prerequisites */}
        {course.prerequisites.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Prerequisites
            </Text>
            
            <View style={styles.pointsContainer}>
              {course.prerequisites.map((prereq, index) => (
                <View key={index} style={styles.pointItem}>
                  <Text style={[styles.pointIcon, { color: theme.primary }]}>•</Text>
                  <Text style={[styles.pointText, { color: theme.text }]}>
                    {prereq}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Instructor */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Instructor
          </Text>
          
          <View style={styles.instructorContainer}>
            <Image
              source={{ uri: course.instructor.avatar }}
              style={styles.instructorAvatar}
            />
            
            <View style={styles.instructorInfo}>
              <Text style={[styles.instructorName, { color: theme.text }]}>
                {course.instructor.name}
              </Text>
              
              <Text style={[styles.instructorTitle, { color: theme.gray[600] }]}>
                {course.instructor.title}
              </Text>
              
              <Text style={[styles.instructorBio, { color: theme.text }]}>
                {course.instructor.bio}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Course Content */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Course Content
          </Text>
          
          <Text style={[styles.contentSummary, { color: theme.gray[600] }]}>
            {course.modules.length} modules • {course.totalLessons} lessons • {course.totalDuration} total length
          </Text>
          
          <View style={styles.modulesContainer}>
            {course.modules.map(module => (
              <View 
                key={module.id}
                style={[
                  styles.moduleCard,
                  { backgroundColor: isDark ? theme.card : '#ffffff' }
                ]}>
                
                <TouchableOpacity
                  style={styles.moduleHeader}
                  onPress={() => toggleModuleExpansion(module.id)}>
                  <View style={styles.moduleHeaderLeft}>
                    <Text style={[styles.moduleTitle, { color: theme.text }]}>
                      {module.title}
                    </Text>
                    
                    <Text style={[styles.moduleMeta, { color: theme.gray[600] }]}>
                      {module.lessons.length} lessons • {module.duration}
                    </Text>
                  </View>
                  
                  <Text style={[styles.expandIcon, { color: theme.primary }]}>
                    {expandedModules.includes(module.id) ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                
                {expandedModules.includes(module.id) && (
                  <View style={styles.lessonsContainer}>
                    {module.lessons.map(lesson => (
                      <TouchableOpacity
                        key={lesson.id}
                        style={[
                          styles.lessonItem,
                          { borderBottomColor: isDark ? theme.gray[800] : theme.gray[200] }
                        ]}
                        onPress={() => handleLessonPress(module.id, lesson.id, lesson.isFree || module.isFree)}>
                        <View style={styles.lessonInfo}>
                          <Text style={[styles.lessonTitle, { color: theme.text }]}>
                            {lesson.title}
                          </Text>
                          
                          <Text style={[styles.lessonMeta, { color: theme.gray[600] }]}>
                            {lesson.duration}
                            {lesson.completed && ' • Completed'}
                            {(lesson.isFree || module.isFree) && ' • Free Preview'}
                          </Text>
                        </View>
                        
                        {lesson.completed ? (
                          <View style={[styles.completedBadge, { backgroundColor: theme.success }]}>
                            <Text style={styles.completedText}>✓</Text>
                          </View>
                        ) : (
                          <Text style={[styles.lessonActionText, { color: theme.primary }]}>
                            {isEnrolled || lesson.isFree || module.isFree ? 'Start' : 'Preview'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
        
        {/* Reviews */}
        {course.reviews.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Student Reviews
            </Text>
            
            <View style={styles.reviewsContainer}>
              {course.reviews
                .slice(0, visibleReviews)
                .map(review => (
                <View 
                  key={review.id}
                  style={[
                    styles.reviewCard,
                    { backgroundColor: isDark ? theme.card : '#ffffff' }
                  ]}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.userAvatar || 'https://placehold.co/100x100/333/fff?text=User' }}
                      style={styles.reviewerAvatar}
                    />
                    
                    <View style={styles.reviewerInfo}>
                      <Text style={[styles.reviewerName, { color: theme.text }]}>
                        {review.userName}
                      </Text>
                      
                      <Text style={[styles.reviewDate, { color: theme.gray[600] }]}>
                        {new Date(review.date).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    <View style={styles.reviewRating}>
                      <Text style={[styles.reviewRatingText, { color: theme.warning }]}>
                        {'★'.repeat(Math.floor(review.rating))}
                        {review.rating % 1 !== 0 ? '½' : ''}
                        {'☆'.repeat(5 - Math.ceil(review.rating))}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.reviewComment, { color: theme.text }]}>
                    {review.comment}
                  </Text>
                </View>
              ))}
              
              {visibleReviews < course.reviews.length && (
                <TouchableOpacity
                  style={[styles.showMoreButton, { borderColor: theme.primary }]}
                  onPress={handleShowMoreReviews}>
                  <Text style={[styles.showMoreText, { color: theme.primary }]}>
                    Show More Reviews
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  courseThumbnail: {
    width: '100%',
    height: 220,
  },
  courseHeader: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseSubtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
  },
  enrollmentCount: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    padding: 16,
    paddingTop: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  courseDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  pointsContainer: {
    marginTop: 8,
  },
  pointItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pointIcon: {
    fontSize: 18,
    marginRight: 8,
    marginTop: -2,
  },
  pointText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  instructorContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  instructorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  instructorBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  contentSummary: {
    fontSize: 14,
    marginBottom: 16,
  },
  modulesContainer: {
    marginTop: 8,
  },
  moduleCard: {
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  moduleHeaderLeft: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moduleMeta: {
    fontSize: 14,
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  lessonsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 12,
  },
  lessonActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewsContainer: {
    marginTop: 8,
  },
  reviewCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewRating: {
    justifyContent: 'center',
  },
  reviewRatingText: {
    fontSize: 16,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  showMoreButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CourseDetailScreen;