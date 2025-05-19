import apiRequest, { uploadFile } from './apiService';
import { useMock, API_BASE_URL, API_ENDPOINTS } from './config';
import UserService from './userService';
import CourseService from './courseService';
import ConversationService from './conversationService';
import SubscriptionService from './subscriptionService';

// Export individual services
export {
  apiRequest,
  uploadFile,
  UserService,
  CourseService,
  ConversationService,
  SubscriptionService,
  useMock,
  API_BASE_URL,
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