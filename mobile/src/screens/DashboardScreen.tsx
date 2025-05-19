import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../services/auth/AuthContext';
import { apiRequest } from '../services/api/apiService';
import { API_ENDPOINTS } from '../services/api/config';

interface Enrollment {
  id: number;
  courseId: string;
  progress: number;
  lastAccessDate: string;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  totalLessons: number;
  instructor: {
    name: string;
  };
}

interface CourseWithProgress extends Course {
  progress: number;
  lastAccessDate: string;
}

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithProgress[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      // Get user enrollments
      const enrollments = await apiRequest<Enrollment[]>(
        API_ENDPOINTS.ENROLLMENTS.GET_USER_ENROLLMENTS
      );
      
      if (enrollments && enrollments.length > 0) {
        // Get course details for each enrollment
        const coursePromises = enrollments.map(enrollment => 
          apiRequest<Course>(`${API_ENDPOINTS.COURSES.GET_COURSE(enrollment.courseId)}`)
            .then(course => ({
              ...course,
              progress: enrollment.progress,
              lastAccessDate: enrollment.lastAccessDate
            }))
        );
        
        const enrolledCoursesWithProgress = await Promise.all(coursePromises);
        setEnrolledCourses(enrolledCoursesWithProgress);
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  // Fetch recommended courses
  const fetchRecommendedCourses = async () => {
    try {
      const recommendations = await apiRequest<Course[]>(
        API_ENDPOINTS.COURSES.GET_RECOMMENDATIONS
      );
      
      setRecommendedCourses(recommendations || []);
    } catch (error) {
      console.error('Error fetching recommended courses:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchEnrolledCourses(),
          fetchRecommendedCourses()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchEnrolledCourses(),
        fetchRecommendedCourses()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Navigate to course detail
  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  // Render enrolled course item
  const renderEnrolledCourseItem = ({ item }: { item: CourseWithProgress }) => {
    const formattedDate = new Date(item.lastAccessDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return (
      <TouchableOpacity
        style={[styles.enrolledCourseCard, { backgroundColor: isDark ? theme.card : '#ffffff' }]}
        onPress={() => handleCoursePress(item.id)}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.courseImage}
          resizeMode="cover"
        />
        <View style={styles.courseInfo}>
          <Text 
            style={[styles.courseTitle, { color: theme.text }]} 
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text 
            style={[styles.courseInstructor, { color: theme.gray[500] }]}
            numberOfLines={1}>
            {item.instructor.name}
          </Text>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { backgroundColor: theme.gray[200] }
              ]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.primary,
                    width: `${item.progress}%` 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.text }]}>
              {item.progress}% Complete
            </Text>
          </View>
          <Text style={[styles.lastAccessed, { color: theme.gray[500] }]}>
            Last accessed: {formattedDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render recommended course item
  const renderRecommendedCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={[styles.recommendedCourseCard, { backgroundColor: isDark ? theme.card : '#ffffff' }]}
      onPress={() => handleCoursePress(item.id)}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.recommendedCourseImage}
        resizeMode="cover"
      />
      <View style={styles.recommendedCourseInfo}>
        <Text 
          style={[styles.recommendedCourseTitle, { color: theme.text }]} 
          numberOfLines={2}
          ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text 
          style={[styles.courseInstructor, { color: theme.gray[500] }]}
          numberOfLines={1}>
          {item.instructor.name}
        </Text>
        <Text style={[styles.courseLessons, { color: theme.gray[500] }]}>
          {item.totalLessons} lessons
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render dashboard content
  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.messageText, { color: theme.text }]}>
            Loading your courses...
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={theme.primary} 
          />
        }>
        
        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: theme.primary }]}>
            Welcome back, {user?.fullName.split(' ')[0] || 'Student'}
          </Text>
          <Text style={[styles.subText, { color: theme.text }]}>
            Continue your learning journey
          </Text>
        </View>
        
        {/* My Courses section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            My Courses
          </Text>
          
          {enrolledCourses.length > 0 ? (
            <FlatList
              data={enrolledCourses}
              renderItem={renderEnrolledCourseItem}
              keyExtractor={item => item.id.toString()}
              horizontal={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={styles.coursesList}
              contentContainerStyle={styles.coursesListContent}
            />
          ) : (
            <View style={styles.emptyCourseContainer}>
              <Text style={[styles.emptyCoursesText, { color: theme.text }]}>
                You haven't enrolled in any courses yet.
              </Text>
              <TouchableOpacity
                style={[styles.browseButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Courses')}>
                <Text style={styles.browseButtonText}>
                  Browse Courses
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Recommended Courses section */}
        {recommendedCourses.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recommended for You
            </Text>
            <FlatList
              data={recommendedCourses}
              renderItem={renderRecommendedCourseItem}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendedList}
              contentContainerStyle={styles.recommendedListContent}
            />
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      {renderDashboardContent()}
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
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  coursesList: {
    width: '100%',
  },
  coursesListContent: {
    paddingHorizontal: 20,
  },
  enrolledCourseCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseImage: {
    width: 120,
    height: 120,
  },
  courseInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastAccessed: {
    fontSize: 12,
  },
  emptyCourseContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCoursesText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  browseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recommendedList: {
    marginTop: 8,
  },
  recommendedListContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  recommendedCourseCard: {
    width: 200,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedCourseImage: {
    width: '100%',
    height: 120,
  },
  recommendedCourseInfo: {
    padding: 12,
  },
  recommendedCourseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    height: 40,
  },
  courseLessons: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default DashboardScreen;