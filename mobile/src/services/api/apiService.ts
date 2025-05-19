import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'react-native-image-picker';
import * as FileSystem from 'expo-file-system';
import { useMock, API_BASE_URL, MOCK_BASE_PATH } from './config';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: useMock ? '' : API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle different error statuses (401, 403, 404, 500, etc.)
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        // If token expired or invalid, clear local storage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        // Navigation will be handled by auth state change in AuthContext
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Makes an API request either to the real API or fetches mock data
 * @param endpoint - API endpoint path
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param data - Request data for POST, PUT requests
 * @param config - Additional axios request config
 * @returns Promise with response data
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response;
    
    if (useMock) {
      // Handle mock data requests
      if (method !== 'GET') {
        console.log(`[MOCK API] ${method} ${endpoint}`, data);
        // For non-GET requests, just return success response with the data
        return {
          success: true,
          data: data || {},
          ...getMockResponseData(endpoint)
        } as unknown as T;
      }
      
      // For GET requests, load mock data from assets
      const mockData = await loadMockData(endpoint);
      return mockData as T;
    } else {
      // Handle real API requests
      switch (method) {
        case 'GET':
          response = await axiosInstance.get(endpoint, config);
          break;
        case 'POST':
          response = await axiosInstance.post(endpoint, data, config);
          break;
        case 'PUT':
          response = await axiosInstance.put(endpoint, data, config);
          break;
        case 'DELETE':
          response = await axiosInstance.delete(endpoint, {
            ...config,
            data,
          });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    }
  } catch (error) {
    console.error(`API Request Error: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Load mock data from assets or bundled JSON
 * @param endpoint API endpoint
 * @returns Mock data
 */
async function loadMockData(endpoint: string): Promise<any> {
  try {
    const mockFileName = getMockFileNameFromEndpoint(endpoint);
    
    // In a real app, we would load JSON files from assets
    // For this example, we'll use predefined JSON objects
    switch (mockFileName) {
      case 'users.json':
        return mockUsers;
      case 'courses.json':
        return mockCourses;
      case 'enrollments.json':
        return mockEnrollments;
      case 'subscriptions.json':
        return mockSubscriptions;
      case 'conversations.json':
        return mockConversations;
      default:
        return { error: 'Mock data not found' };
    }
  } catch (error) {
    console.error('Error loading mock data', error);
    return null;
  }
}

/**
 * Maps API endpoints to mock JSON file names
 * @param endpoint API endpoint
 * @returns Filename for the mock data
 */
function getMockFileNameFromEndpoint(endpoint: string): string {
  // Extract ID from endpoints with IDs like /users/123 -> /users/:id
  const normalizedEndpoint = endpoint.replace(/\/[0-9]+(\/.+)?$/, '/:id$1');
  
  // Map endpoint patterns to mock file paths
  const endpointMap: Record<string, string> = {
    // User endpoints
    '/users/profile': 'users.json',
    '/users': 'users.json',
    '/users/:id': 'users.json',
    
    // Course endpoints
    '/courses': 'courses.json',
    '/courses/:id': 'courses.json',
    '/courses/popular': 'courses.json',
    '/courses/featured': 'courses.json',
    '/courses/recommendations': 'courses.json',
    
    // Enrollment endpoints
    '/enrollments': 'enrollments.json',
    '/enrollments/:id/progress': 'enrollments.json',
    
    // Subscription endpoints
    '/subscriptions': 'subscriptions.json',
    '/subscriptions/:id': 'subscriptions.json',
    '/subscriptions/:id/cancel': 'subscriptions.json',
    
    // Payment endpoints - no mock data available for payment intents
    '/payments/history': 'subscriptions.json', // Reuse subscription data for payment history
    
    // Conversation endpoints
    '/conversations': 'conversations.json',
    '/conversations/:id': 'conversations.json',
    '/conversations/:id/messages': 'conversations.json',
  };
  
  return endpointMap[normalizedEndpoint] || 'error.json';
}

/**
 * Process responses for non-GET endpoints in mock mode
 * @param endpoint API endpoint
 * @returns Appropriate mock response data
 */
function getMockResponseData(endpoint: string): any {
  // Handle specific endpoints for mock responses
  if (endpoint.startsWith('/auth/login')) {
    return {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
      }
    };
  }
  
  if (endpoint.startsWith('/auth/signup')) {
    return {
      success: true,
      message: 'User registered successfully',
    };
  }
  
  if (endpoint.startsWith('/auth/forgot-password')) {
    return {
      success: true,
      message: 'Password reset email sent',
    };
  }
  
  // Default response for other endpoints
  return {
    success: true,
    message: 'Operation completed successfully',
  };
}

/**
 * Upload a file to the server
 * @param uri File URI
 * @param type File type
 * @param name File name
 * @param endpoint API endpoint
 * @returns Upload response
 */
export const uploadFile = async (
  uri: string, 
  type: string, 
  name: string, 
  endpoint: string
): Promise<any> => {
  if (useMock) {
    // Return mock response for file upload
    return {
      success: true,
      fileUrl: uri,
      fileName: name,
      fileType: type,
    };
  }
  
  const formData = new FormData();
  formData.append('file', {
    uri,
    type,
    name,
  } as any);
  
  try {
    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('File upload error', error);
    throw error;
  }
};

// Mock data for development (in a real app, these would be separate JSON files in assets)
const mockUsers = [
  {
    id: 1,
    username: 'johndoe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    profilePicture: 'https://placehold.co/400x400/1a202c/e2e8f0?text=JD',
    role: 'user',
    preferences: {
      darkMode: true,
      notifications: {
        email: true,
        push: false
      }
    }
  },
  {
    id: 2,
    username: 'janedoe',
    email: 'jane.doe@example.com',
    fullName: 'Jane Doe',
    profilePicture: 'https://placehold.co/400x400/1a202c/e2e8f0?text=JD',
    role: 'user',
    preferences: {
      darkMode: false,
      notifications: {
        email: true,
        push: true
      }
    }
  }
];

const mockCourses = [
  {
    id: 'course1',
    title: 'Generative AI Foundations',
    subtitle: 'Understanding the Core of Modern AI Systems',
    description: 'Explore the fundamentals of generative AI models, their architecture, and applications in modern technology.',
    thumbnail: 'https://placehold.co/600x400/1a202c/e2e8f0?text=GenAI+Foundations',
    instructor: {
      id: 'instructor1',
      name: 'Dr. Sarah Chen',
      avatar: 'https://placehold.co/400x400/1a202c/e2e8f0?text=SC',
      title: 'Lead AI Researcher',
      bio: 'Dr. Chen has over 10 years of experience in AI research and has published numerous papers on generative models.'
    },
    skillLevel: 'Beginner',
    tags: ['GenAI', 'Python', 'MLOps'],
    rating: 4.8,
    reviewCount: 245,
    studentsEnrolled: 1289,
    price: 59.99,
    priceType: 'Paid',
    duration: 'Medium',
    totalLessons: 24,
    totalDuration: '12h',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Generative AI',
        lessons: [
          {
            id: 'l1',
            title: 'What is Generative AI?',
            duration: '25min',
            isFree: true,
            description: 'An overview of generative AI and its impact on technology.'
          },
          {
            id: 'l2',
            title: 'Historical Development of AI',
            duration: '30min',
            isFree: true,
            description: 'Trace the evolution of AI from its early days to modern generative models.'
          }
        ],
        isFree: false,
        description: 'An introduction to generative AI concepts',
        duration: '55min'
      }
    ],
    enrollmentOptions: {
      freeTrial: true,
      oneTime: {
        price: 59.99,
        discountedPrice: 49.99
      },
      subscription: {
        monthly: 12.99,
        yearly: 119.88
      }
    }
  },
  {
    id: 'course2',
    title: 'Advanced LLM Applications',
    subtitle: 'Building Production-Ready AI Systems',
    description: 'Learn to create and deploy sophisticated applications leveraging large language models.',
    thumbnail: 'https://placehold.co/600x400/1a202c/e2e8f0?text=Advanced+LLM',
    instructor: {
      id: 'instructor2',
      name: 'Prof. Michael Torres',
      avatar: 'https://placehold.co/400x400/1a202c/e2e8f0?text=MT',
      title: 'AI Systems Architect',
      bio: 'Prof. Torres specializes in designing scalable AI systems and has worked with major tech companies.'
    },
    skillLevel: 'Advanced',
    tags: ['LLMs', 'Python', 'MLOps', 'NLP'],
    rating: 4.9,
    reviewCount: 112,
    studentsEnrolled: 734,
    price: 79.99,
    priceType: 'Paid',
    duration: 'Long',
    totalLessons: 32,
    totalDuration: '18h',
    modules: [
      {
        id: 'm1',
        title: 'Architecture of LLM Systems',
        lessons: [
          {
            id: 'l1',
            title: 'Understanding LLM Architectures',
            duration: '35min',
            isFree: true,
            description: 'Examine the architectural components of large language models.'
          }
        ],
        isFree: false,
        description: 'Explore LLM architectures',
        duration: '35min'
      }
    ],
    enrollmentOptions: {
      freeTrial: false,
      oneTime: {
        price: 79.99
      },
      subscription: {
        monthly: 15.99,
        yearly: 159.99
      }
    }
  }
];

const mockEnrollments = [
  {
    id: 1,
    userId: 1,
    courseId: 'course1',
    enrollmentDate: '2025-01-15T10:30:00.000Z',
    lastAccessDate: '2025-05-10T14:22:00.000Z',
    progress: 35,
    currentModule: 'm1',
    currentLesson: 'l3',
    completedLessons: ['m1.l1', 'm1.l2'],
    certificateIssued: false,
    status: 'active'
  },
  {
    id: 2,
    userId: 1,
    courseId: 'course2',
    enrollmentDate: '2025-03-22T08:15:00.000Z',
    lastAccessDate: '2025-05-09T19:45:00.000Z',
    progress: 12,
    currentModule: 'm1',
    currentLesson: 'l2',
    completedLessons: ['m1.l1'],
    certificateIssued: false,
    status: 'active'
  }
];

const mockSubscriptions = [
  {
    id: 1,
    userId: 1,
    planType: 'monthly',
    status: 'active',
    startDate: '2025-01-01T00:00:00.000Z',
    nextBillingDate: '2025-05-01T00:00:00.000Z',
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2026',
      brand: 'visa'
    },
    price: 12.99,
    features: [
      'Unlimited course access',
      'Live sessions',
      'Instructor Q&A',
      'Certificate generation'
    ]
  }
];

const mockConversations = [
  {
    id: 1,
    courseId: 'course1',
    instructorId: 'instructor1',
    title: 'Help with Generative Models',
    createdAt: '2025-04-15T14:30:00.000Z',
    lastMessageAt: '2025-05-10T09:15:00.000Z',
    status: 'active',
    participants: [
      {
        id: 1,
        userId: 1,
        name: 'John Doe',
        avatar: 'https://placehold.co/400x400/1a202c/e2e8f0?text=JD',
        role: 'student'
      },
      {
        id: 2,
        userId: 'instructor1',
        name: 'Dr. Sarah Chen',
        avatar: 'https://placehold.co/400x400/1a202c/e2e8f0?text=SC',
        role: 'instructor'
      }
    ],
    messages: [
      {
        id: 1,
        senderId: 1,
        senderName: 'John Doe',
        senderAvatar: 'https://placehold.co/400x400/1a202c/e2e8f0?text=JD',
        messageType: 'text',
        content: 'Hello Dr. Chen, I\'m having trouble understanding the difference between VAEs and GANs. Could you help clarify?',
        timestamp: '2025-04-15T14:30:00.000Z',
        isRead: true
      },
      {
        id: 2,
        senderId: 'instructor1',
        senderName: 'Dr. Sarah Chen',
        senderAvatar: 'https://placehold.co/400x400/1a202c/e2e8f0?text=SC',
        messageType: 'text',
        content: 'Hi John! Great question. VAEs and GANs are both generative models but differ in their approach. VAEs learn to encode data into a latent space and then decode it back, optimizing for reconstruction. GANs, on the other hand, have a generator and discriminator that compete against each other.',
        timestamp: '2025-04-15T15:45:00.000Z',
        isRead: true
      }
    ]
  }
];

export default apiRequest;