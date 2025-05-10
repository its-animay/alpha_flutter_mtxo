// Course data model
export type CourseSkillLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
export type CourseTag = "GenAI" | "Python" | "MLOps" | "RealWorld" | "Agents" | "LLMs" | "Computer Vision" | "NLP";
export type CoursePrice = "Free" | "Paid";
export type CourseDuration = "Short" | "Medium" | "Long";

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLessonItem[];
  isFree: boolean;
  description: string;
  duration: string; // in minutes
}

export interface CourseLessonItem {
  id: string;
  title: string;
  duration: string; // in minutes
  isFree: boolean;
  completed?: boolean;
  videoUrl?: string;
  description: string;
  resources?: CourseResource[];
}

export interface CourseResource {
  id: string;
  title: string;
  type: "pdf" | "code" | "link" | "video";
  url: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
}

export interface CourseReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  skillLevel: CourseSkillLevel;
  tags: CourseTag[];
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  price: number; // in USD
  priceType: CoursePrice;
  duration: CourseDuration;
  totalLessons: number;
  totalDuration: string; // in hours
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

// Sample course data
export const courses: Course[] = [
  {
    id: "1",
    title: "Agentic LLMs Bootcamp",
    subtitle: "Create intelligent AI agents that can reason, plan and execute complex tasks",
    description: "Dive into the world of agentic AI systems and learn how to build autonomous agents powered by large language models. This course covers the theory and practical implementation of autonomous AI systems that can reason, plan, and execute complex tasks without human intervention.",
    thumbnail: "@assets/courses/agentic-llms-card.svg",
    instructor: {
      id: "1",
      name: "Dr. Emma Chen",
      avatar: "@assets/instructors/placeholder.svg",
      title: "AI Research Scientist",
      bio: "AI research scientist specializing in multi-agent systems and autonomous AI. Previously worked at OpenAI and DeepMind."
    },
    skillLevel: "Intermediate",
    tags: ["GenAI", "Python", "Agents", "LLMs"],
    rating: 4.8,
    reviewCount: 342,
    studentsEnrolled: 2856,
    price: 299,
    priceType: "Paid",
    duration: "Medium",
    totalLessons: 42,
    totalDuration: "24h 30m",
    whatYoullLearn: [
      "Design and implement autonomous AI agents using LLMs",
      "Apply reasoning capabilities to solve complex problems",
      "Implement planning algorithms for multi-step tasks",
      "Create production-ready agent systems with memory and tool use",
      "Evaluate and benchmark agent performance",
      "Develop secure, ethical and controllable agent systems"
    ],
    prerequisites: [
      "Basic Python programming knowledge",
      "Familiarity with machine learning concepts",
      "Understanding of LLM fundamentals"
    ],
    modules: [
      {
        id: "m1",
        title: "Foundations of Agentic Systems",
        isFree: true,
        description: "Learn the fundamental concepts behind agentic AI systems and how they differ from traditional AI applications.",
        duration: "180",
        lessons: [
          {
            id: "l1",
            title: "Introduction to Agentic AI",
            duration: "45",
            isFree: true,
            description: "Overview of the course and introduction to the concept of agentic AI systems.",
            videoUrl: "/videos/intro-to-agentic-ai.mp4",
            resources: [
              {
                id: "r1",
                title: "Course Syllabus",
                type: "pdf",
                url: "/resources/course-syllabus.pdf"
              }
            ]
          },
          {
            id: "l2",
            title: "History and Evolution of AI Agents",
            duration: "38",
            isFree: true,
            description: "How AI agents have evolved from simple rule-based systems to complex autonomous entities.",
            videoUrl: "/videos/history-of-ai-agents.mp4"
          },
          {
            id: "l3",
            title: "Components of an Agent Architecture",
            duration: "52",
            isFree: true,
            description: "Understanding the key components that make up an agentic system: perception, reasoning, planning, and action.",
            videoUrl: "/videos/agent-architecture.mp4"
          },
          {
            id: "l4",
            title: "Theoretical Frameworks for Agentic AI",
            duration: "45",
            isFree: false,
            description: "Exploration of theoretical frameworks that underpin agentic AI systems.",
            videoUrl: "/videos/theoretical-frameworks.mp4"
          }
        ]
      },
      {
        id: "m2",
        title: "LLMs as Reasoning Engines",
        isFree: false,
        description: "Deep dive into how LLMs can be used as reasoning engines for agentic systems.",
        duration: "210",
        lessons: [
          {
            id: "l5",
            title: "LLM Architecture Review",
            duration: "40",
            isFree: false,
            description: "A review of Large Language Model architectures with focus on aspects relevant to agentic systems.",
            videoUrl: "/videos/llm-architecture.mp4"
          },
          {
            id: "l6",
            title: "Prompt Engineering for Reasoning",
            duration: "55",
            isFree: false,
            description: "Advanced prompt engineering techniques to elicit reasoning capabilities from LLMs.",
            videoUrl: "/videos/prompt-engineering.mp4"
          },
          {
            id: "l7",
            title: "Chain-of-Thought and Tree-of-Thought Reasoning",
            duration: "60",
            isFree: false,
            description: "Implementing chain-of-thought and tree-of-thought reasoning patterns with LLMs.",
            videoUrl: "/videos/cot-tot-reasoning.mp4"
          },
          {
            id: "l8",
            title: "Evaluating Reasoning Quality",
            duration: "55",
            isFree: false,
            description: "Methods and metrics for evaluating the quality of reasoning in LLM-based agents.",
            videoUrl: "/videos/evaluating-reasoning.mp4"
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userName: "Michael S.",
        userAvatar: "/users/michael.webp",
        rating: 5,
        comment: "This course transformed my understanding of what's possible with LLMs. The step-by-step approach to building autonomous agents was incredibly valuable for my research work.",
        date: "2023-11-15"
      },
      {
        id: "r2",
        userName: "Sarah T.",
        userAvatar: "/users/sarah.webp",
        rating: 4,
        comment: "Excellent content and practical examples. Would have given 5 stars if there were more real-world applications covered.",
        date: "2023-10-22"
      }
    ],
    enrollmentOptions: {
      freeTrial: true,
      oneTime: {
        price: 299,
        discountedPrice: 249
      },
      subscription: {
        monthly: 49,
        yearly: 399
      }
    }
  },
  {
    id: "2",
    title: "MLOps with FastAPI",
    subtitle: "Build, deploy and scale ML models with modern MLOps practices",
    description: "Learn how to build production-ready machine learning systems using FastAPI. This comprehensive course covers the entire MLOps lifecycle, from model development to deployment, monitoring, and maintenance.",
    thumbnail: "@assets/courses/mlops-fastapi-card.svg",
    instructor: {
      id: "2",
      name: "Miguel Ramirez",
      avatar: "@assets/instructors/placeholder.svg",
      title: "MLOps Engineer",
      bio: "Senior MLOps engineer with 10+ years of experience deploying ML systems at scale. Author of 'Production ML Systems'."
    },
    skillLevel: "Intermediate",
    tags: ["Python", "MLOps", "RealWorld"],
    rating: 4.7,
    reviewCount: 215,
    studentsEnrolled: 1832,
    price: 249,
    priceType: "Paid",
    duration: "Long",
    totalLessons: 48,
    totalDuration: "28h 15m",
    whatYoullLearn: [
      "Design robust ML systems architecture",
      "Build APIs for ML models using FastAPI",
      "Implement CI/CD pipelines for ML projects",
      "Set up monitoring and logging for ML systems",
      "Deploy models to production environments",
      "Handle data drift and model versioning"
    ],
    prerequisites: [
      "Intermediate Python skills",
      "Basic understanding of ML/DL concepts",
      "Familiarity with REST APIs",
      "Basic Git knowledge"
    ],
    modules: [
      {
        id: "m1",
        title: "Introduction to MLOps",
        isFree: true,
        description: "Understand the fundamentals of MLOps and why it's critical for successful ML projects.",
        duration: "165",
        lessons: [
          {
            id: "l1",
            title: "MLOps Fundamentals",
            duration: "35",
            isFree: true,
            description: "Introduction to MLOps and its importance in the machine learning lifecycle.",
            videoUrl: "/videos/mlops-fundamentals.mp4"
          },
          {
            id: "l2",
            title: "ML System Design Principles",
            duration: "42",
            isFree: true,
            description: "Key principles for designing robust and scalable machine learning systems.",
            videoUrl: "/videos/ml-system-design.mp4"
          },
          {
            id: "l3",
            title: "MLOps Maturity Model",
            duration: "38",
            isFree: true,
            description: "Understanding the different levels of MLOps maturity and how to evolve your ML systems.",
            videoUrl: "/videos/mlops-maturity.mp4"
          },
          {
            id: "l4",
            title: "Setting Up Your MLOps Environment",
            duration: "50",
            isFree: false,
            description: "Configuring your development environment with the necessary tools for MLOps.",
            videoUrl: "/videos/mlops-environment.mp4"
          }
        ]
      },
      {
        id: "m2",
        title: "FastAPI for ML Services",
        isFree: false,
        description: "Learn how to use FastAPI to build high-performance APIs for machine learning models.",
        duration: "220",
        lessons: [
          {
            id: "l5",
            title: "Introduction to FastAPI",
            duration: "40",
            isFree: false,
            description: "Overview of FastAPI and its advantages for ML services.",
            videoUrl: "/videos/intro-fastapi.mp4"
          },
          {
            id: "l6",
            title: "Creating Your First ML API",
            duration: "55",
            isFree: false,
            description: "Build a simple API to serve predictions from a machine learning model.",
            videoUrl: "/videos/first-ml-api.mp4"
          },
          {
            id: "l7",
            title: "Request Validation and Pydantic",
            duration: "45",
            isFree: false,
            description: "Implement robust input validation for your ML APIs using Pydantic models.",
            videoUrl: "/videos/pydantic-validation.mp4"
          },
          {
            id: "l8",
            title: "Asynchronous Predictions with FastAPI",
            duration: "50",
            isFree: false,
            description: "Implement asynchronous prediction endpoints for improved performance and scalability.",
            videoUrl: "/videos/async-predictions.mp4"
          },
          {
            id: "l9",
            title: "API Authentication and Security",
            duration: "30",
            isFree: false,
            description: "Add authentication and security features to protect your ML APIs.",
            videoUrl: "/videos/api-security.mp4"
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userName: "David W.",
        userAvatar: "/users/david.webp",
        rating: 5,
        comment: "This course is a game-changer for anyone working on ML projects. The FastAPI sections saved me countless hours in my production deployments.",
        date: "2023-09-18"
      },
      {
        id: "r2",
        userName: "Jennifer L.",
        userAvatar: "/users/jennifer.webp",
        rating: 4,
        comment: "Excellent practical content. The monitoring section was particularly valuable for our team's workflows.",
        date: "2023-12-05"
      }
    ],
    enrollmentOptions: {
      freeTrial: true,
      oneTime: {
        price: 249,
        discountedPrice: 199
      },
      subscription: {
        monthly: 39,
        yearly: 349
      }
    }
  },
  {
    id: "3",
    title: "GenAI Prompt Engineering Lab",
    subtitle: "Master the art and science of effective prompt design for generative AI",
    description: "Become an expert in prompt engineering for generative AI models. This course covers advanced techniques for crafting effective prompts that generate high-quality outputs for various applications, from content creation to code generation.",
    thumbnail: "@assets/courses/genai-prompt-engineering-card.svg",
    instructor: {
      id: "3",
      name: "Sophia Williams",
      avatar: "@assets/instructors/placeholder.svg",
      title: "AI Content Strategist",
      bio: "AI content strategist and prompt engineering expert. Has trained teams at Fortune 500 companies on effective AI utilization."
    },
    skillLevel: "All Levels",
    tags: ["GenAI", "NLP", "RealWorld"],
    rating: 4.9,
    reviewCount: 428,
    studentsEnrolled: 3682,
    price: 199,
    priceType: "Paid",
    duration: "Medium",
    totalLessons: 35,
    totalDuration: "18h 45m",
    whatYoullLearn: [
      "Design clear and effective prompts for various AI models",
      "Apply advanced prompt engineering techniques",
      "Optimize prompts for specific use cases and applications",
      "Implement context manipulation and few-shot learning",
      "Create prompt templates and libraries for consistent results",
      "Evaluate and measure prompt effectiveness"
    ],
    prerequisites: [
      "Basic understanding of language models",
      "Familiarity with AI concepts",
      "No coding experience required"
    ],
    modules: [
      {
        id: "m1",
        title: "Fundamentals of Prompt Engineering",
        isFree: true,
        description: "Learn the basic principles and concepts behind effective prompt engineering.",
        duration: "150",
        lessons: [
          {
            id: "l1",
            title: "Introduction to Prompt Engineering",
            duration: "30",
            isFree: true,
            description: "Understanding what prompt engineering is and why it's important for generative AI.",
            videoUrl: "/videos/intro-prompt-engineering.mp4"
          },
          {
            id: "l2",
            title: "How Language Models Interpret Prompts",
            duration: "45",
            isFree: true,
            description: "Deep dive into how different language models process and interpret prompts.",
            videoUrl: "/videos/llm-prompt-interpretation.mp4"
          },
          {
            id: "l3",
            title: "Prompt Components and Structure",
            duration: "40",
            isFree: true,
            description: "Learn about the key components that make up effective prompts.",
            videoUrl: "/videos/prompt-structure.mp4"
          },
          {
            id: "l4",
            title: "Common Prompt Engineering Mistakes",
            duration: "35",
            isFree: false,
            description: "Identifying and avoiding common mistakes in prompt design.",
            videoUrl: "/videos/prompt-mistakes.mp4"
          }
        ]
      },
      {
        id: "m2",
        title: "Advanced Prompt Techniques",
        isFree: false,
        description: "Master advanced techniques for complex prompt engineering challenges.",
        duration: "185",
        lessons: [
          {
            id: "l5",
            title: "Chain-of-Thought Prompting",
            duration: "40",
            isFree: false,
            description: "Using chain-of-thought techniques to improve reasoning in language models.",
            videoUrl: "/videos/cot-prompting.mp4"
          },
          {
            id: "l6",
            title: "Few-Shot and Zero-Shot Learning",
            duration: "45",
            isFree: false,
            description: "Implementing few-shot and zero-shot learning techniques in prompts.",
            videoUrl: "/videos/few-shot-learning.mp4"
          },
          {
            id: "l7",
            title: "Role and Persona Prompting",
            duration: "35",
            isFree: false,
            description: "Assigning roles and personas to improve prompt specificity and output quality.",
            videoUrl: "/videos/role-prompting.mp4"
          },
          {
            id: "l8",
            title: "Instruction Fine-tuning and Instruction Following",
            duration: "35",
            isFree: false,
            description: "Techniques for creating effective instruction-based prompts.",
            videoUrl: "/videos/instruction-prompts.mp4"
          },
          {
            id: "l9",
            title: "Context Window Management",
            duration: "30",
            isFree: false,
            description: "Strategies for managing context windows in large language models.",
            videoUrl: "/videos/context-management.mp4"
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userName: "Ryan K.",
        userAvatar: "/users/ryan.webp",
        rating: 5,
        comment: "Transformed how our marketing team uses AI. The techniques in this course have significantly improved our content generation workflow.",
        date: "2023-10-12"
      },
      {
        id: "r2",
        userName: "Alexa J.",
        userAvatar: "/users/alexa.webp",
        rating: 5,
        comment: "As someone who works with AI daily, this course was a revelation. The practical exercises and real-world applications make it invaluable.",
        date: "2023-11-28"
      }
    ],
    enrollmentOptions: {
      freeTrial: true,
      oneTime: {
        price: 199,
        discountedPrice: 149
      },
      subscription: {
        monthly: 29,
        yearly: 269
      }
    }
  },
  {
    id: "4",
    title: "Building Autonomous Agents",
    subtitle: "Create and deploy intelligent autonomous agents for real-world tasks",
    description: "Learn how to build sophisticated autonomous agents that can interact with the world, make decisions, and accomplish complex tasks without human intervention. This course covers the latest techniques and frameworks for developing agentic AI systems.",
    thumbnail: "@assets/courses/autonomous-agents-card.svg",
    instructor: {
      id: "4",
      name: "Dr. James Liu",
      avatar: "@assets/instructors/placeholder.svg",
      title: "AI Systems Architect",
      bio: "AI systems architect with expertise in multi-agent systems and autonomous AI. Previously led AI teams at major tech companies."
    },
    skillLevel: "Advanced",
    tags: ["GenAI", "Python", "Agents", "LLMs"],
    rating: 4.8,
    reviewCount: 187,
    studentsEnrolled: 1245,
    price: 349,
    priceType: "Paid",
    duration: "Long",
    totalLessons: 55,
    totalDuration: "32h 20m",
    whatYoullLearn: [
      "Design and implement autonomous agent architectures",
      "Create goal-oriented agents with planning capabilities",
      "Build agents that can interact with tools and APIs",
      "Implement memory systems for long-term context retention",
      "Develop multi-agent systems for complex tasks",
      "Deploy and monitor autonomous agents in production"
    ],
    prerequisites: [
      "Strong Python programming skills",
      "Experience with LLMs and prompt engineering",
      "Understanding of basic AI concepts",
      "Familiarity with API integration"
    ],
    modules: [
      {
        id: "m1",
        title: "Agent Architecture Fundamentals",
        isFree: true,
        description: "Learn the core architectural principles for building autonomous AI agents.",
        duration: "190",
        lessons: [
          {
            id: "l1",
            title: "Introduction to Autonomous Agents",
            duration: "40",
            isFree: true,
            description: "Overview of autonomous agents and their applications in the real world.",
            videoUrl: "/videos/intro-autonomous-agents.mp4"
          },
          {
            id: "l2",
            title: "Agent Components and Design Patterns",
            duration: "50",
            isFree: true,
            description: "Understanding the key components that make up an agent architecture.",
            videoUrl: "/videos/agent-components.mp4"
          },
          {
            id: "l3",
            title: "Planning and Decision-Making Frameworks",
            duration: "45",
            isFree: true,
            description: "Exploration of frameworks for agent planning and decision-making.",
            videoUrl: "/videos/planning-frameworks.mp4"
          },
          {
            id: "l4",
            title: "Setting Up Your Agent Development Environment",
            duration: "55",
            isFree: false,
            description: "Configuring your development environment with the necessary tools for agent development.",
            videoUrl: "/videos/agent-dev-environment.mp4"
          }
        ]
      },
      {
        id: "m2",
        title: "Tools and Integrations",
        isFree: false,
        description: "Learn how to give your agents the ability to use tools and interact with external systems.",
        duration: "210",
        lessons: [
          {
            id: "l5",
            title: "Tool-Using Agent Framework",
            duration: "45",
            isFree: false,
            description: "Building a framework for agents to use tools effectively.",
            videoUrl: "/videos/tool-framework.mp4"
          },
          {
            id: "l6",
            title: "API Integration Patterns",
            duration: "40",
            isFree: false,
            description: "Patterns for integrating APIs into your agent systems.",
            videoUrl: "/videos/api-integration.mp4"
          },
          {
            id: "l7",
            title: "Web Browsing and Information Retrieval",
            duration: "50",
            isFree: false,
            description: "Techniques for agents to browse the web and retrieve information.",
            videoUrl: "/videos/web-browsing-agents.mp4"
          },
          {
            id: "l8",
            title: "Code Generation and Execution",
            duration: "40",
            isFree: false,
            description: "Implementing code generation and execution capabilities in agents.",
            videoUrl: "/videos/code-generation-agents.mp4"
          },
          {
            id: "l9",
            title: "Tool Validation and Security",
            duration: "35",
            isFree: false,
            description: "Ensuring the security and validation of tool use in autonomous agents.",
            videoUrl: "/videos/tool-security.mp4"
          }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        userName: "Thomas B.",
        userAvatar: "/users/thomas.webp",
        rating: 5,
        comment: "The most comprehensive course on agent development I've found. The sections on tool integration were especially valuable for our research project.",
        date: "2023-12-15"
      },
      {
        id: "r2",
        userName: "Lisa M.",
        userAvatar: "/users/lisa.webp",
        rating: 4,
        comment: "Excellent advanced material. Requires solid background knowledge, but delivers on its promises if you have the prerequisites.",
        date: "2023-11-02"
      }
    ],
    enrollmentOptions: {
      freeTrial: true,
      oneTime: {
        price: 349,
        discountedPrice: 299
      },
      subscription: {
        monthly: 59,
        yearly: 499
      }
    }
  }
];

// Filter functions
export const filterCoursesBySkillLevel = (courses: Course[], skillLevel: CourseSkillLevel | "All"): Course[] => {
  if (skillLevel === "All") return courses;
  return courses.filter(course => course.skillLevel === skillLevel);
};

export const filterCoursesByTags = (courses: Course[], tags: CourseTag[]): Course[] => {
  if (tags.length === 0) return courses;
  return courses.filter(course => course.tags.some(tag => tags.includes(tag)));
};

export const filterCoursesByPriceType = (courses: Course[], priceType: CoursePrice | "All"): Course[] => {
  if (priceType === "All") return courses;
  return courses.filter(course => course.priceType === priceType);
};

export const filterCoursesByDuration = (courses: Course[], duration: CourseDuration | "All"): Course[] => {
  if (duration === "All") return courses;
  return courses.filter(course => course.duration === duration);
};

export const searchCourses = (courses: Course[], query: string): Course[] => {
  if (!query) return courses;
  
  const lowercaseQuery = query.toLowerCase();
  return courses.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.subtitle.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    course.instructor.name.toLowerCase().includes(lowercaseQuery)
  );
};

// Get a course by ID
export const getCourseById = (courseId: string): Course | undefined => {
  return courses.find(course => course.id === courseId);
};