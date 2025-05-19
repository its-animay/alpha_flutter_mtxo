import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../services/auth/AuthContext';
import { apiRequest } from '../services/api/apiService';
import { API_ENDPOINTS } from '../services/api/config';

// Define types
interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  status: 'online' | 'offline' | 'away';
}

interface Conversation {
  id: number;
  courseId: string;
  title: string;
  instructorId: string;
  createdAt: string;
  lastMessageAt: string;
  status: string;
  unreadCount?: number;
  instructor: Instructor;
  lastMessage?: {
    content: string;
    senderId: number | string;
    timestamp: string;
  };
}

interface Course {
  id: string;
  title: string;
  instructor: Instructor;
}

const HelpdeskScreen = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // Load conversations
  const fetchConversations = async () => {
    try {
      const data = await apiRequest<Conversation[]>(
        API_ENDPOINTS.CONVERSATIONS.GET_ALL
      );
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };
  
  // Load enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      // Get user enrollments
      const enrollments = await apiRequest<any[]>(
        API_ENDPOINTS.ENROLLMENTS.GET_USER_ENROLLMENTS
      );
      
      if (enrollments && enrollments.length > 0) {
        // Get course details for each enrollment
        const coursePromises = enrollments.map(enrollment => 
          apiRequest<Course>(API_ENDPOINTS.COURSES.GET_COURSE(enrollment.courseId))
        );
        
        const enrolledCourses = await Promise.all(coursePromises);
        setCourses(enrolledCourses.filter(Boolean));
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchConversations(),
          fetchEnrolledCourses()
        ]);
      } catch (error) {
        console.error('Error loading helpdesk data:', error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      fetchConversations(),
      fetchEnrolledCourses()
    ]).finally(() => setRefreshing(false));
  };
  
  // Handle conversation press
  const handleConversationPress = (conversation: Conversation) => {
    navigation.navigate('Conversation', { conversationId: conversation.id });
  };
  
  // Toggle new conversation form
  const toggleNewConversationForm = () => {
    setIsCreatingConversation(!isCreatingConversation);
    setSelectedCourseId(null);
    setNewConversationTitle('');
  };
  
  // Create new conversation
  const handleCreateConversation = async () => {
    if (!selectedCourseId) {
      Alert.alert('Error', 'Please select a course');
      return;
    }
    
    if (!newConversationTitle.trim()) {
      Alert.alert('Error', 'Please enter a topic for your conversation');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Find selected course
      const course = courses.find(c => c.id === selectedCourseId);
      
      if (!course) {
        Alert.alert('Error', 'Selected course not found');
        setIsLoading(false);
        return;
      }
      
      // Create new conversation
      const newConversation = await apiRequest<Conversation>(
        API_ENDPOINTS.CONVERSATIONS.CREATE,
        'POST',
        {
          courseId: selectedCourseId,
          instructorId: course.instructor.id,
          title: newConversationTitle,
        }
      );
      
      // Update conversations list
      setConversations(prev => [newConversation, ...prev]);
      
      // Reset form
      setIsCreatingConversation(false);
      setSelectedCourseId(null);
      setNewConversationTitle('');
      
      // Navigate to the new conversation
      navigation.navigate('Conversation', { conversationId: newConversation.id });
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Error', 'Failed to create conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Same day - show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Within a week - show day name
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Render conversation item
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        { backgroundColor: isDark ? theme.card : '#ffffff' }
      ]}
      onPress={() => handleConversationPress(item)}>
      <Image
        source={{ uri: item.instructor.avatar }}
        style={styles.instructorAvatar}
      />
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text 
            style={[styles.conversationTitle, { color: theme.text }]}
            numberOfLines={1}>
            {item.title}
          </Text>
          
          <Text style={[styles.timestamp, { color: theme.gray[500] }]}>
            {formatTimestamp(item.lastMessageAt)}
          </Text>
        </View>
        
        <Text 
          style={[styles.instructorName, { color: theme.gray[600] }]}
          numberOfLines={1}>
          {item.instructor.name} • {item.instructor.title}
        </Text>
        
        {item.lastMessage && (
          <Text 
            style={[
              styles.lastMessage, 
              { color: item.unreadCount ? theme.text : theme.gray[500] }
            ]}
            numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
        )}
        
        {item.unreadCount && item.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.unreadCount}>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  // Render course option
  const renderCourseOption = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={[
        styles.courseOption,
        selectedCourseId === item.id && { backgroundColor: theme.primary + '20' },
        { borderColor: selectedCourseId === item.id ? theme.primary : isDark ? theme.gray[800] : theme.gray[200] }
      ]}
      onPress={() => setSelectedCourseId(item.id)}>
      <Text 
        style={[
          styles.courseOptionText, 
          { color: selectedCourseId === item.id ? theme.primary : theme.text }
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={[styles.emptyStateText, { color: theme.text }]}>
        You don't have any conversations yet.
      </Text>
      
      <Text style={[styles.emptyStateSubtext, { color: theme.gray[500] }]}>
        Start a new conversation with an instructor to get help with your courses.
      </Text>
      
      <TouchableOpacity
        style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}
        onPress={toggleNewConversationForm}>
        <Text style={styles.emptyStateButtonText}>
          Start New Conversation
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Show loading indicator
  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading conversations...
          </Text>
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
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Solve with Prof
          </Text>
          
          {!isCreatingConversation && (
            <TouchableOpacity
              style={[styles.newConversationButton, { backgroundColor: theme.primary }]}
              onPress={toggleNewConversationForm}>
              <Text style={styles.newConversationButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {isCreatingConversation ? (
          <View style={styles.newConversationForm}>
            <Text style={[styles.formTitle, { color: theme.text }]}>
              Start a New Conversation
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>
                Select Course
              </Text>
              
              {courses.length > 0 ? (
                <FlatList
                  data={courses}
                  renderItem={renderCourseOption}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.courseOptionsList}
                />
              ) : (
                <Text style={[styles.noCourses, { color: theme.gray[500] }]}>
                  You need to be enrolled in at least one course to start a conversation.
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>
                Topic
              </Text>
              <TextInput
                style={[
                  styles.topicInput,
                  { 
                    backgroundColor: isDark ? theme.gray[800] : theme.gray[100],
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                placeholder="What do you need help with?"
                placeholderTextColor={theme.gray[500]}
                value={newConversationTitle}
                onChangeText={setNewConversationTitle}
              />
            </View>
            
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.gray[500] }]}
                onPress={toggleNewConversationForm}>
                <Text style={[styles.cancelButtonText, { color: theme.gray[500] }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.createButton, 
                  { 
                    backgroundColor: courses.length > 0 && selectedCourseId && newConversationTitle.trim()
                      ? theme.primary
                      : theme.gray[300]
                  }
                ]}
                onPress={handleCreateConversation}
                disabled={courses.length === 0 || !selectedCourseId || !newConversationTitle.trim()}>
                <Text style={styles.createButtonText}>
                  Start Conversation
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {conversations.length > 0 ? (
              <FlatList
                data={conversations}
                renderItem={renderConversationItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.conversationsList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={theme.primary}
                  />
                }
              />
            ) : (
              renderEmptyState()
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newConversationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newConversationButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  conversationsList: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
    position: 'relative',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  instructorName: {
    fontSize: 14,
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 14,
    marginRight: 30, // Space for unread badge
  },
  unreadBadge: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newConversationForm: {
    padding: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  courseOptionsList: {
    paddingBottom: 8,
  },
  courseOption: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  courseOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noCourses: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  topicInput: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    flex: 2,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HelpdeskScreen;