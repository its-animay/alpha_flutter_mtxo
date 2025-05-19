# MTXO Labs EdTech Platform Documentation

## Platform Overview

MTXO Labs EdTech is a next-generation learning platform specializing in AI and technology education. The platform offers a comprehensive learning ecosystem with interactive and personalized learning experiences.

### Key Features

- Futuristic and responsive user interface with glassmorphism effects
- Text-based interactive course modules for effective learning
- User authentication system with secure login/registration
- Course discovery and enrollment with Stripe payment integration
- Interactive lesson interface with progress tracking
- Module quizzes with immediate feedback
- Student-instructor communication system (Solve with Prof)
- User profile management with subscription details
- Light/dark mode support with animated transitions

---

## System Architecture

### Frontend Architecture

The frontend is built using React with the following key technologies:
- React.js for UI components
- TypeScript for type safety
- Tailwind CSS for styling with shadcn UI components
- Framer Motion for animations
- React Query for data fetching and cache management
- Wouter for lightweight client-side routing
- Axios for API communication
- Stripe integration for payment processing

### API Architecture

The application uses a modular API service architecture:
- API configuration with toggleable mock/real data mode
- Service-based organization (User, Course, Conversation, Subscription)
- Axios for HTTP requests
- Mock data JSON files for development and testing

### Data Storage

- Local storage for user preferences and course progress
- Backend database integrations available via API endpoints
- JSON files for mock data during development

---

## Frontend Components

### Authentication Flow

#### Login Page
- Username/password authentication
- Remember me functionality
- Password recovery option
- Redirect to dashboard after successful login

#### Signup Page
- User registration with form validation
- Email verification (simulated in mock mode)
- Terms and conditions acceptance

#### Password Recovery
- Email-based recovery
- Password reset form with confirmation

### Learning Platform

#### Dashboard
- Course progress overview
- Recommended courses
- Learning statistics
- Quick access to profile and helpdesk

#### Course Catalog
- Course listings with filters (skill level, duration, tags)
- Course cards with preview information
- Search functionality

#### Course Detail
- Comprehensive course information
- Module and lesson breakdown
- Instructor profile
- Enrollment options
- Reviews and ratings

#### Lesson Interface
- Text-based lesson content
- Progress tracking
- Navigation between lessons
- Module completion tracking
- Interactive elements

#### Quiz System
- Question and multiple-choice answers
- Immediate feedback
- Explanation for correct answers
- Progress tracking
- Score calculation and display

### User Profile

#### Profile Management
- Basic information (name, email, profile picture)
- Subscription management
- Course enrollments list
- Account settings
- Notification preferences

#### Helpdesk (Solve with Prof)
- Course-specific instructor communication
- Multi-modal messaging (text, files, audio)
- Real-time conversation interface
- Message status tracking

### Payment System

#### Checkout Process
- Course purchase options
- Subscription plans
- Secure payment processing with Stripe
- Order confirmation

---

## API Documentation

### Configuration

The API system can be toggled between mock data and real API endpoints:

```typescript
// In client/src/lib/api/config.ts
export const useMock = true; // Set to false to use real API
```

### API Endpoints

#### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/auth/login` | POST | User login | `{ username, password }` | `{ token, user }` |
| `/auth/signup` | POST | User registration | `{ username, email, password, fullName }` | `{ success, message }` |
| `/auth/forgot-password` | POST | Request password reset | `{ email }` | `{ success, message }` |
| `/auth/reset-password` | POST | Reset password | `{ token, newPassword }` | `{ success, message }` |
| `/auth/logout` | POST | User logout | None | `{ success }` |

#### User Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/users/profile` | GET | Get user profile | None | User object |
| `/users/profile` | PUT | Update user profile | User data | Updated user object |
| `/users/:id` | GET | Get user by ID | None | User object |

#### Course Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/courses` | GET | Get all courses | Optional filters | Array of courses |
| `/courses/:id` | GET | Get course by ID | None | Course object |
| `/courses/popular` | GET | Get popular courses | None | Array of courses |
| `/courses/featured` | GET | Get featured courses | None | Array of courses |
| `/courses/recommendations` | GET | Get recommended courses | None | Array of courses |

#### Enrollment Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/enrollments` | GET | Get user enrollments | None | Array of enrollments |
| `/enrollments` | POST | Enroll in course | `{ courseId, planType }` | Enrollment object |
| `/enrollments/:id/progress` | PUT | Update progress | `{ progress, moduleId, lessonId }` | Updated enrollment |

#### Subscription Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/subscriptions` | GET | Get user subscription | None | Subscription object |
| `/subscriptions` | POST | Create subscription | `{ planType }` | Subscription object |
| `/subscriptions/:id` | PUT | Update subscription | Subscription data | Updated subscription |
| `/subscriptions/:id/cancel` | POST | Cancel subscription | None | `{ success, message }` |

#### Payment Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/payments/create-intent` | POST | Create payment intent | `{ courseId, planType }` | `{ clientSecret }` |
| `/payments/create-subscription` | POST | Create subscription | `{ courseId, planType }` | `{ clientSecret, subscriptionId }` |
| `/payments/history` | GET | Get payment history | None | Array of payments |

#### Conversation Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/conversations` | GET | Get all conversations | None | Array of conversations |
| `/conversations` | POST | Create conversation | `{ courseId, instructorId, title, initialMessage }` | Conversation object |
| `/conversations/:id` | GET | Get conversation | None | Conversation with messages |
| `/conversations/:id/messages` | POST | Send message | Message data | Created message |
| `/conversations/:id/messages` | GET | Get messages | None | Array of messages |

---

## Data Models

### User Model
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  role?: string;
  preferences?: {
    darkMode?: boolean;
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
}
```

### Course Model
```typescript
interface Course {
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
```

### Module & Lesson Models
```typescript
interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
  isFree: boolean;
  description: string;
  duration: string;
}

interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
  videoUrl?: string;
  description: string;
  resources?: CourseResource[];
}
```

### Subscription Model
```typescript
interface Subscription {
  id: number;
  userId: number;
  planType: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: PaymentMethod;
  price: number;
  features: string[];
}
```

### Conversation & Message Models
```typescript
interface Conversation {
  id: number;
  courseId: string;
  instructorId: string;
  title: string;
  createdAt: string;
  lastMessageAt: string;
  status: 'active' | 'closed' | 'pending';
  participants: Participant[];
  messages: Message[];
}

interface Message {
  id: number;
  senderId: number | string;
  senderName: string;
  senderAvatar: string;
  messageType: 'text' | 'file' | 'audio';
  content: string;
  timestamp: string;
  isRead: boolean;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  audioUrl?: string;
  audioDuration?: number;
}
```

---

## UI Components

### Design System

The platform uses a consistent design system across all pages:

- **Color Palette**:
  - Primary: Customized based on theme
  - Background: Light/dark mode support
  - Accent colors: Used for highlighting and feedback

- **Typography**:
  - Modern sans-serif font
  - Responsive sizing
  - Consistent hierarchical structure

- **Components**:
  - Cards with glassmorphism effect
  - Buttons with hover and click animations
  - Form inputs with validation feedback
  - Modals and dialogs
  - Tabs and accordions
  - Avatars and badges

---

## Authentication and Security

### Authentication Flow

1. User submits credentials via login form
2. System validates credentials
3. Upon successful authentication, JWT token is returned
4. Token is stored in localStorage
5. Token is included in API requests via Authorization header
6. Token expiration handling with automatic logout

### Security Features

- Password hashing and secure storage
- Protected routes requiring authentication
- Token-based authentication
- HTTPS for all API communication

---

## Stripe Integration

### Payment Process

1. User selects course or subscription plan
2. System creates payment intent via Stripe API
3. Stripe Elements used for secure card information collection
4. Upon successful payment, enrollment is recorded
5. User is redirected to success page

### Subscription Management

- Create, update, and cancel subscriptions
- Handle subscription lifecycle events
- Manage payment methods
- Process recurring billing

---

## Progress Tracking System

### Lesson Progress

- Track completed lessons
- Store progress in localStorage
- Sync with backend on login/logout
- Display progress indicators on dashboard

### Course Completion

- Calculate overall progress percentage
- Mark courses as completed
- Issue certificates upon completion
- Store completion status for achievements

---

## Helpdesk System

### Student-Instructor Communication

- Course-specific conversations
- Real-time messaging
- Support for text, file, and audio messages
- Read receipts and typing indicators
- Instructor online status

---

## Development Guidelines

### Adding New Features

1. Update mock data files if needed
2. Implement UI components
3. Connect to API services
4. Add client-side validation
5. Test with mock and real data modes

### API Integration

To switch from mock data to real API:

1. Set `useMock = false` in `client/src/lib/api/config.ts`
2. Ensure API_BASE_URL points to your backend server
3. Implement the backend API endpoints matching the documented routes

---

## Mobile Responsiveness

The platform is fully responsive across different devices:

- **Mobile**: Optimized layout for phones
- **Tablet**: Adjusted component sizing and spacing
- **Desktop**: Full-featured UI with enhanced visualizations
- **Large Screens**: Maximized content area with optimal spacing

---

## Performance Optimization

- Code splitting for reduced bundle size
- Lazy loading for route components
- Memoization for expensive computations
- React Query for efficient data caching
- Optimized image loading
- Minimized re-renders using React best practices

---

## Future Enhancements

- Real-time collaboration features
- AI-powered learning assistants
- Enhanced analytics dashboard
- Gamification elements
- Community forums
- Interactive coding exercises
- Mobile applications

---

© 2025 MTXO Labs. All rights reserved.