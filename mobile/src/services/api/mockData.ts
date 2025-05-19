// Mock data for development and testing

// Mock users data
export const mockUsers = [
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

// Mock courses data
export const mockCourses = [
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

// Mock enrollments data
export const mockEnrollments = [
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

// Mock subscriptions data
export const mockSubscriptions = [
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

// Mock conversations data
export const mockConversations = [
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