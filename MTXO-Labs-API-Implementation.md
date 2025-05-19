# MTXO Labs EdTech - API Implementation Guide

## Mock API System Overview

The MTXO Labs EdTech platform uses a flexible API architecture that can switch between mock data (for development) and real API connections (for production) with a simple configuration toggle.

### Key Components

1. **API Configuration** (`client/src/lib/api/config.ts`)
   - Toggle between mock and real API with `useMock` flag
   - Definition of all API endpoints
   - Base URLs for both mock and real APIs

2. **API Service** (`client/src/lib/api/apiService.ts`)
   - Core service handling all API requests
   - Axios instance with interceptors for authentication
   - Error handling and response processing
   - Dynamic switching between mock and real APIs

3. **Domain-Specific Services**
   - User service for authentication and profile management
   - Course service for course-related operations
   - Conversation service for helpdesk functionality
   - Subscription service for payments and subscriptions

4. **Mock Data Files** (`/public/mock/*.json`)
   - JSON files containing mock data for development and testing
   - Structured to match expected API responses
   - Easily extensible for new features

## How to Use the API System

### Basic Usage

```typescript
// Import services
import { UserService, CourseService } from '@/lib/api';

// Use in components
const loginUser = async () => {
  try {
    const response = await UserService.login({
      username: 'user@example.com',
      password: 'password'
    });
    
    // Handle successful login
    console.log(response.user);
  } catch (error) {
    // Handle error
    console.error('Login failed:', error);
  }
};

// Get courses with React Query
const { data: courses, isLoading } = useQuery({
  queryKey: [API_ENDPOINTS.COURSES.GET_ALL],
  queryFn: () => CourseService.getAllCourses()
});
```

### Switching Between Mock and Real API

To switch between mock and real API:

1. Open `client/src/lib/api/config.ts`
2. Change the `useMock` flag:
   ```typescript
   // For development with mock data
   export const useMock = true;
   
   // For production with real API
   export const useMock = false;
   ```

3. When switching to a real API, update the `API_BASE_URL`:
   ```typescript
   export const API_BASE_URL = 'https://api.your-production-server.com';
   ```

## Mock Data Structure

### Location

Mock data files are stored in the `/public/mock` directory:
- `users.json` - User data
- `courses.json` - Course catalog
- `enrollments.json` - Course enrollments
- `subscriptions.json` - User subscriptions
- `conversations.json` - Helpdesk conversations

### Adding New Mock Data

To add new mock data:

1. Create a new JSON file in the `/public/mock` directory
2. Update the `getMockFilePathFromEndpoint` function in `apiService.ts` to map new endpoints to your mock file
3. Use the new endpoint in your service file

Example:
```typescript
// Add to getMockFilePathFromEndpoint function
const endpointMap: Record<string, string> = {
  // Existing mappings
  
  // New mapping
  '/achievements': '/achievements.json',
};
```

## API Services

### UserService

Handles authentication and user profile operations:
- `login` - User authentication
- `signup` - User registration
- `forgotPassword` - Password recovery
- `resetPassword` - Reset password with token
- `getProfile` - Get current user profile
- `updateProfile` - Update user profile
- `logout` - Log out user

### CourseService

Manages course-related operations:
- `getAllCourses` - Get all courses with optional filters
- `getCourse` - Get detailed course information by ID
- `getPopularCourses` - Get popular courses list
- `getFeaturedCourses` - Get featured courses list
- `getRecommendedCourses` - Get personalized course recommendations
- `enrollInCourse` - Enroll user in a course
- `getUserEnrollments` - Get user's enrolled courses
- `updateProgress` - Update course progress

### ConversationService

Handles helpdesk and instructor communication:
- `getConversations` - Get all user conversations
- `getConversation` - Get conversation by ID with messages
- `createConversation` - Start a new conversation
- `sendMessage` - Send message in a conversation
- `getMessages` - Get messages for a conversation
- `uploadFile` - Upload file for file messages
- `processAudioMessage` - Process audio messages

### SubscriptionService

Manages subscriptions and payments:
- `getUserSubscription` - Get active user subscription
- `createSubscription` - Create new subscription
- `updateSubscription` - Update subscription details
- `cancelSubscription` - Cancel active subscription
- `getPaymentHistory` - Get payment history
- `createPaymentIntent` - Create payment intent for Stripe
- `createSubscriptionIntent` - Create subscription payment intent

## Migration to Real Backend

When ready to connect to a real backend API:

1. Set `useMock = false` in the configuration
2. Ensure your backend implements all the required endpoints
3. Test API connectivity with real authentication
4. Update any service methods that need customization

Your backend API should follow the same endpoint structure and response formats used in the mock system to ensure compatibility.

## Authentication Flow

1. User logs in through the login form
2. `UserService.login()` sends credentials to the authentication endpoint
3. Upon successful authentication, JWT token is returned and stored in localStorage
4. Token is automatically included in subsequent API requests
5. Invalid/expired tokens trigger automatic redirection to the login page

## Example Backend Requirements

A compatible backend should provide:

- RESTful API endpoints matching the defined structure
- JWT-based authentication system
- Appropriate CORS configuration
- Response formats matching the mock data structure
- Proper error handling with status codes

## Error Handling

The API service includes built-in error handling:

- Network errors are caught and processed
- Authentication errors (401) trigger automatic logout
- Permissions errors (403) are reported to the console
- All API errors are passed to the calling component for handling

## Best Practices

1. Use the domain-specific services rather than direct API calls
2. Leverage React Query for state management and caching
3. Handle loading and error states in your components
4. Use TypeScript interfaces for type safety
5. Test with both mock and real API modes before deployment

---

This implementation provides a flexible, maintainable approach to API management that supports both development with mock data and seamless transition to production API endpoints.