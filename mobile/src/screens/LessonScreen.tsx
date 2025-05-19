import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { apiRequest } from '../services/api/apiService';
import { API_ENDPOINTS } from '../services/api/config';

// Define types
interface LessonRouteParams {
  courseId: string;
  lessonId: string;
  moduleId: string;
}

interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'video';
  url: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  description: string;
  resources: LessonResource[];
  videoUrl?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
  }[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
}

const LessonScreen = () => {
  const route = useRoute<RouteProp<Record<string, LessonRouteParams>, string>>();
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const courseId = route.params?.courseId;
  const lessonId = route.params?.lessonId;
  const moduleId = route.params?.moduleId;

  // Fetch lesson and course data
  const fetchData = async () => {
    if (!courseId || !lessonId) {
      Alert.alert('Error', 'Lesson not found');
      navigation.goBack();
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch course structure for navigation between lessons
      const course = await apiRequest<Course>(
        API_ENDPOINTS.COURSES.GET_COURSE(courseId)
      );
      
      setCourseData(course);
      
      // Set current module ID from route or find it in course data
      if (moduleId) {
        setCurrentModuleId(moduleId);
      } else if (course) {
        // Find which module contains this lesson
        for (const module of course.modules) {
          const foundLesson = module.lessons.find(l => l.id === lessonId);
          if (foundLesson) {
            setCurrentModuleId(module.id);
            break;
          }
        }
      }
      
      // Fetch specific lesson data
      const lesson = await apiRequest<Lesson>(
        `${API_ENDPOINTS.COURSES.GET_COURSE(courseId)}/lessons/${lessonId}`
      );
      
      setLessonData(lesson);
      
      // Check completion status (from enrollment data)
      const enrollments = await apiRequest<any[]>(
        API_ENDPOINTS.ENROLLMENTS.GET_USER_ENROLLMENTS
      );
      
      const enrollment = enrollments?.find(e => e.courseId === courseId);
      
      if (enrollment) {
        setLessonCompleted(enrollment.completedLessons.includes(lessonId));
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
      Alert.alert(
        'Error',
        'Failed to load lesson. Please try again later.'
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [courseId, lessonId]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Mark lesson as completed
  const markLessonAsCompleted = async () => {
    if (lessonCompleted) return;
    
    try {
      await apiRequest(
        `${API_ENDPOINTS.ENROLLMENTS.UPDATE_PROGRESS(0)}`,
        'POST',
        {
          courseId,
          lessonId,
          completed: true
        }
      );
      
      setLessonCompleted(true);
      
      Alert.alert(
        'Progress Updated',
        'Lesson marked as completed!'
      );
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      Alert.alert(
        'Error',
        'Failed to update progress. Please try again.'
      );
    }
  };

  // Navigate to next lesson
  const navigateToNextLesson = () => {
    if (!courseData || !currentModuleId) return;
    
    // Find current module
    const currentModuleIndex = courseData.modules.findIndex(
      module => module.id === currentModuleId
    );
    
    if (currentModuleIndex === -1) return;
    
    const currentModule = courseData.modules[currentModuleIndex];
    
    // Find current lesson index
    const currentLessonIndex = currentModule.lessons.findIndex(
      lesson => lesson.id === lessonId
    );
    
    if (currentLessonIndex === -1) return;
    
    // Check if there's a next lesson in the same module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[currentLessonIndex + 1];
      navigation.navigate('Lesson', {
        courseId,
        lessonId: nextLesson.id,
        moduleId: currentModuleId
      });
      return;
    }
    
    // Check if there's a next module
    if (currentModuleIndex < courseData.modules.length - 1) {
      const nextModule = courseData.modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0) {
        navigation.navigate('Lesson', {
          courseId,
          lessonId: nextModule.lessons[0].id,
          moduleId: nextModule.id
        });
        return;
      }
    }
    
    // If no next lesson, go back to course detail
    Alert.alert(
      'Course Complete',
      'You have reached the end of this course!',
      [
        { 
          text: 'Back to Course', 
          onPress: () => navigation.navigate('CourseDetail', { courseId }) 
        }
      ]
    );
  };

  // Navigate to previous lesson
  const navigateToPreviousLesson = () => {
    if (!courseData || !currentModuleId) return;
    
    // Find current module
    const currentModuleIndex = courseData.modules.findIndex(
      module => module.id === currentModuleId
    );
    
    if (currentModuleIndex === -1) return;
    
    const currentModule = courseData.modules[currentModuleIndex];
    
    // Find current lesson index
    const currentLessonIndex = currentModule.lessons.findIndex(
      lesson => lesson.id === lessonId
    );
    
    if (currentLessonIndex === -1) return;
    
    // Check if there's a previous lesson in the same module
    if (currentLessonIndex > 0) {
      const prevLesson = currentModule.lessons[currentLessonIndex - 1];
      navigation.navigate('Lesson', {
        courseId,
        lessonId: prevLesson.id,
        moduleId: currentModuleId
      });
      return;
    }
    
    // Check if there's a previous module
    if (currentModuleIndex > 0) {
      const prevModule = courseData.modules[currentModuleIndex - 1];
      if (prevModule.lessons.length > 0) {
        const lastLessonInPrevModule = prevModule.lessons[prevModule.lessons.length - 1];
        navigation.navigate('Lesson', {
          courseId,
          lessonId: lastLessonInPrevModule.id,
          moduleId: prevModule.id
        });
        return;
      }
    }
  };

  // Open resource
  const handleOpenResource = (resource: LessonResource) => {
    // In a real app, implement resource opening logic based on type
    Alert.alert(
      'Resource',
      `Opening ${resource.title} (${resource.type})`,
      [{ text: 'OK' }]
    );
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
            Loading lesson...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Lesson not found
  if (!lessonData || !courseData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Lesson not found or has been removed.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('CourseDetail', { courseId })}>
            <Text style={styles.backButtonText}>Back to Course</Text>
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
        
        {/* Lesson Header */}
        <View style={styles.lessonHeader}>
          <Text style={[styles.lessonTitle, { color: theme.text }]}>
            {lessonData.title}
          </Text>
          
          <Text style={[styles.lessonMeta, { color: theme.gray[600] }]}>
            {lessonData.duration} • {courseData.title}
          </Text>
        </View>
        
        {/* Lesson Video Placeholder */}
        {lessonData.videoUrl && (
          <View 
            style={[
              styles.videoContainer, 
              { backgroundColor: isDark ? theme.gray[800] : theme.gray[200] }
            ]}>
            <Text style={[styles.videoPlaceholder, { color: theme.gray[600] }]}>
              Video Player
            </Text>
          </View>
        )}
        
        {/* Lesson Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.contentText, { color: theme.text }]}>
            {lessonData.content || lessonData.description}
          </Text>
        </View>
        
        {/* Lesson Resources */}
        {lessonData.resources && lessonData.resources.length > 0 && (
          <View style={styles.resourcesSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Resources
            </Text>
            
            <View style={styles.resourcesList}>
              {lessonData.resources.map(resource => (
                <TouchableOpacity
                  key={resource.id}
                  style={[
                    styles.resourceItem,
                    { backgroundColor: isDark ? theme.card : '#ffffff' }
                  ]}
                  onPress={() => handleOpenResource(resource)}>
                  <View style={[
                    styles.resourceIcon,
                    { 
                      backgroundColor: 
                        resource.type === 'pdf' ? theme.danger :
                        resource.type === 'code' ? theme.info :
                        resource.type === 'video' ? theme.warning :
                        theme.primary
                    }
                  ]}>
                    <Text style={styles.resourceIconText}>
                      {resource.type === 'pdf' ? 'PDF' :
                       resource.type === 'code' ? '<>' :
                       resource.type === 'video' ? '▶' : '🔗'}
                    </Text>
                  </View>
                  
                  <View style={styles.resourceInfo}>
                    <Text style={[styles.resourceTitle, { color: theme.text }]}>
                      {resource.title}
                    </Text>
                    <Text style={[styles.resourceType, { color: theme.gray[600] }]}>
                      {resource.type.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Navigation and Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                { borderColor: theme.primary }
              ]}
              onPress={navigateToPreviousLesson}>
              <Text style={[styles.navButtonText, { color: theme.primary }]}>
                ← Previous
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.navButton,
                { borderColor: theme.primary }
              ]}
              onPress={navigateToNextLesson}>
              <Text style={[styles.navButtonText, { color: theme.primary }]}>
                Next →
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[
              styles.completeButton,
              { 
                backgroundColor: lessonCompleted ? theme.success : theme.primary,
                opacity: lessonCompleted ? 0.8 : 1
              }
            ]}
            onPress={markLessonAsCompleted}
            disabled={lessonCompleted}>
            <Text style={styles.completeButtonText}>
              {lessonCompleted ? 'Completed ✓' : 'Mark as Completed'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
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
  lessonHeader: {
    padding: 16,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lessonMeta: {
    fontSize: 14,
  },
  videoContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  resourcesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resourcesList: {
    marginTop: 8,
  },
  resourceItem: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceIconText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  resourceType: {
    fontSize: 12,
  },
  actionButtonsContainer: {
    padding: 16,
    marginTop: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completeButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LessonScreen;