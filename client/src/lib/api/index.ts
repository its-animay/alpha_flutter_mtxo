// Re-export all API services
import apiRequest from './apiService';
import UserService from './userService';
import CourseService from './courseService';
import ConversationService from './conversationService';
import SubscriptionService from './subscriptionService';
import { useMock, API_ENDPOINTS } from './config';

// Export individual services
export {
  apiRequest,
  UserService,
  CourseService,
  ConversationService,
  SubscriptionService,
  useMock,
  API_ENDPOINTS
};

// Export as a combined API object
const API = {
  user: UserService,
  course: CourseService,
  conversation: ConversationService,
  subscription: SubscriptionService,
  config: {
    useMock,
    endpoints: API_ENDPOINTS
  }
};

export default API;