import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { apiRequest } from '../services/api/apiService';
import { API_ENDPOINTS } from '../services/api/config';

// Define types
interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
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
}

// Define filter types
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'All';
type PriceType = 'Free' | 'Paid' | 'All';
type Duration = 'Short' | 'Medium' | 'Long' | 'All';

const CoursesScreen = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  
  // State for courses and loading
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for filters
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel>('All');
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType>('All');
  const [selectedDuration, setSelectedDuration] = useState<Duration>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Available tags
  const availableTags = [
    'GenAI', 'Python', 'MLOps', 'RealWorld', 'Agents', 'LLMs', 'Computer Vision', 'NLP'
  ];

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const data = await apiRequest<Course[]>(API_ENDPOINTS.COURSES.GET_ALL);
      setCourses(data || []);
      applyFilters(data || [], searchQuery, selectedSkillLevel, selectedPriceType, selectedDuration, selectedTags);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Apply filters to courses
  const applyFilters = (
    coursesToFilter: Course[],
    query: string,
    skillLevel: SkillLevel,
    priceType: PriceType,
    duration: Duration,
    tags: string[]
  ) => {
    let result = [...coursesToFilter];
    
    // Apply search query filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.instructor.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply skill level filter
    if (skillLevel !== 'All') {
      result = result.filter(course => course.skillLevel === skillLevel);
    }
    
    // Apply price type filter
    if (priceType !== 'All') {
      result = result.filter(course => course.priceType === priceType);
    }
    
    // Apply duration filter
    if (duration !== 'All') {
      result = result.filter(course => course.duration === duration);
    }
    
    // Apply tags filter
    if (tags.length > 0) {
      result = result.filter(course => 
        tags.some(tag => course.tags.includes(tag))
      );
    }
    
    setFilteredCourses(result);
  };

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters(courses, text, selectedSkillLevel, selectedPriceType, selectedDuration, selectedTags);
  };

  // Handle filter changes
  const handleSkillLevelChange = (level: SkillLevel) => {
    setSelectedSkillLevel(level);
    applyFilters(courses, searchQuery, level, selectedPriceType, selectedDuration, selectedTags);
  };

  const handlePriceTypeChange = (type: PriceType) => {
    setSelectedPriceType(type);
    applyFilters(courses, searchQuery, selectedSkillLevel, type, selectedDuration, selectedTags);
  };

  const handleDurationChange = (duration: Duration) => {
    setSelectedDuration(duration);
    applyFilters(courses, searchQuery, selectedSkillLevel, selectedPriceType, duration, selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
      
    setSelectedTags(updatedTags);
    applyFilters(courses, searchQuery, selectedSkillLevel, selectedPriceType, selectedDuration, updatedTags);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  // Navigate to course detail
  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  // Render filter chips
  const renderFilterChips = (
    options: string[],
    selectedOption: string,
    onSelect: (option: any) => void
  ) => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterChip,
              selectedOption === option 
                ? { backgroundColor: theme.primary } 
                : { backgroundColor: isDark ? theme.gray[800] : theme.gray[200] }
            ]}
            onPress={() => onSelect(option as any)}>
            <Text 
              style={[
                styles.filterChipText,
                selectedOption === option 
                  ? { color: '#ffffff' } 
                  : { color: theme.text }
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Render tag chips
  const renderTagChips = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsContainer}>
        {availableTags.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.filterChip,
              selectedTags.includes(tag) 
                ? { backgroundColor: theme.primary } 
                : { backgroundColor: isDark ? theme.gray[800] : theme.gray[200] }
            ]}
            onPress={() => handleTagToggle(tag)}>
            <Text 
              style={[
                styles.filterChipText,
                selectedTags.includes(tag) 
                  ? { color: '#ffffff' } 
                  : { color: theme.text }
              ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Render course item
  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: isDark ? theme.card : '#ffffff' }]}
      onPress={() => handleCoursePress(item.id)}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.courseThumbnail}
        resizeMode="cover"
      />
      <View style={styles.courseInfo}>
        <Text 
          style={[styles.courseTitle, { color: theme.text }]} 
          numberOfLines={2}
          ellipsizeMode="tail">
          {item.title}
        </Text>
        
        <View style={styles.instructorRow}>
          <Image
            source={{ uri: item.instructor.avatar }}
            style={styles.instructorAvatar}
          />
          <Text style={[styles.instructorName, { color: theme.gray[600] }]}>
            {item.instructor.name}
          </Text>
        </View>
        
        <View style={styles.courseMetaRow}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaText, { color: theme.gray[500] }]}>
              {item.skillLevel}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaText, { color: theme.gray[500] }]}>
              {item.totalDuration}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaText, { color: theme.gray[500] }]}>
              {item.totalLessons} lessons
            </Text>
          </View>
        </View>
        
        <View style={styles.courseFooter}>
          <View style={styles.ratingContainer}>
            <Text style={[styles.ratingText, { color: theme.warning }]}>
              ★ {item.rating.toFixed(1)}
            </Text>
            <Text style={[styles.reviewCount, { color: theme.gray[500] }]}>
              ({item.reviewCount})
            </Text>
          </View>
          
          <Text style={[styles.priceText, { color: theme.primary }]}>
            {item.priceType === 'Free' ? 'Free' : `$${item.price.toFixed(2)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render content
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      );
    }

    if (filteredCourses.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.noCoursesText, { color: theme.text }]}>
            No courses found matching your criteria.
          </Text>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              setSearchQuery('');
              setSelectedSkillLevel('All');
              setSelectedPriceType('All');
              setSelectedDuration('All');
              setSelectedTags([]);
              setFilteredCourses(courses);
            }}>
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={theme.primary} 
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
              color: theme.text,
              borderColor: theme.border
            }
          ]}
          placeholder="Search courses..."
          placeholderTextColor={theme.gray[500]}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>Skill Level</Text>
        {renderFilterChips(
          ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'],
          selectedSkillLevel,
          handleSkillLevelChange
        )}
        
        <Text style={[styles.filterTitle, { color: theme.text }]}>Price</Text>
        {renderFilterChips(
          ['All', 'Free', 'Paid'],
          selectedPriceType,
          handlePriceTypeChange
        )}
        
        <Text style={[styles.filterTitle, { color: theme.text }]}>Duration</Text>
        {renderFilterChips(
          ['All', 'Short', 'Medium', 'Long'],
          selectedDuration,
          handleDurationChange
        )}
        
        <Text style={[styles.filterTitle, { color: theme.text }]}>Topics</Text>
        {renderTagChips()}
      </View>
      
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  filterChipsContainer: {
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  coursesList: {
    padding: 16,
    paddingTop: 8,
  },
  courseCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseThumbnail: {
    width: '100%',
    height: 160,
  },
  courseInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 24,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  instructorName: {
    fontSize: 14,
  },
  courseMetaRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCoursesText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CoursesScreen;