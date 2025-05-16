import { 
  users, 
  subscriptions, 
  courseEnrollments, 
  paymentHistory, 
  instructors, 
  conversations,
  conversationParticipants,
  chatMessages,
  type User, 
  type InsertUser,
  type Subscription,
  type CourseEnrollment,
  type PaymentHistory,
  type Instructor,
  type Conversation,
  type ConversationParticipant,
  type ChatMessage,
  UserRole,
  SubscriptionPlan,
  OnlineStatus,
  MessageType
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

// Interface for our storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateUserPreferences(id: number, preferences: User['preferences']): Promise<User | undefined>;
  
  // Subscription methods
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription>;
  updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined>;
  
  // Payment history methods
  getPaymentHistory(userId: number): Promise<PaymentHistory[]>;
  addPaymentRecord(payment: Omit<PaymentHistory, 'id'>): Promise<PaymentHistory>;
  
  // Course enrollment methods
  getUserEnrollments(userId: number): Promise<CourseEnrollment[]>;
  enrollUserInCourse(enrollment: Omit<CourseEnrollment, 'id'>): Promise<CourseEnrollment>;
  updateEnrollmentProgress(id: number, progress: number): Promise<CourseEnrollment | undefined>;
  
  // Instructor methods
  getInstructorByUserId(userId: number): Promise<Instructor | undefined>;
  createInstructor(instructor: Omit<Instructor, 'id'>): Promise<Instructor>;
  updateInstructorStatus(id: number, status: typeof OnlineStatus[keyof typeof OnlineStatus]): Promise<Instructor | undefined>;
  
  // Chat methods
  getConversationsByCourseId(courseId: string): Promise<Conversation[]>;
  getConversationById(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: Omit<Conversation, 'id'>): Promise<Conversation>;
  addParticipantToConversation(participant: Omit<ConversationParticipant, 'id'>): Promise<ConversationParticipant>;
  getConversationParticipants(conversationId: number): Promise<ConversationParticipant[]>;
  
  // Message methods
  getMessagesByConversationId(conversationId: number): Promise<ChatMessage[]>;
  addMessage(message: Omit<ChatMessage, 'id'>): Promise<ChatMessage>;
  markMessagesAsRead(conversationId: number, userId: number): Promise<void>;
  
  // Course instructors
  getCourseInstructors(courseId: string): Promise<User[]>;
  getStudentConversations(userId: number): Promise<Conversation[]>;
}

// Database implementation of storage
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserProfile(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async updateUserPreferences(id: number, preferences: User['preferences']): Promise<User | undefined> {
    const [updated] = await db.update(users)
      .set({ preferences })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  // Subscription methods
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.isActive, true)
      ));
    return subscription;
  }

  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    const [created] = await db.insert(subscriptions).values(subscription).returning();
    return created;
  }

  async updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const [updated] = await db.update(subscriptions)
      .set(subscriptionData)
      .where(eq(subscriptions.id, id))
      .returning();
    return updated;
  }

  // Payment history methods
  async getPaymentHistory(userId: number): Promise<PaymentHistory[]> {
    return db.select()
      .from(paymentHistory)
      .where(eq(paymentHistory.userId, userId))
      .orderBy(desc(paymentHistory.date));
  }

  async addPaymentRecord(payment: Omit<PaymentHistory, 'id'>): Promise<PaymentHistory> {
    const [created] = await db.insert(paymentHistory).values(payment).returning();
    return created;
  }

  // Course enrollment methods
  async getUserEnrollments(userId: number): Promise<CourseEnrollment[]> {
    return db.select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.userId, userId));
  }

  async enrollUserInCourse(enrollment: Omit<CourseEnrollment, 'id'>): Promise<CourseEnrollment> {
    const [created] = await db.insert(courseEnrollments).values(enrollment).returning();
    return created;
  }

  async updateEnrollmentProgress(id: number, progress: number): Promise<CourseEnrollment | undefined> {
    const [updated] = await db.update(courseEnrollments)
      .set({ 
        progress,
        isCompleted: progress >= 100,
        ...(progress >= 100 ? { completionDate: new Date() } : {})
      })
      .where(eq(courseEnrollments.id, id))
      .returning();
    return updated;
  }

  // Instructor methods
  async getInstructorByUserId(userId: number): Promise<Instructor | undefined> {
    const [instructor] = await db.select()
      .from(instructors)
      .where(eq(instructors.userId, userId));
    return instructor;
  }

  async createInstructor(instructor: Omit<Instructor, 'id'>): Promise<Instructor> {
    const [created] = await db.insert(instructors).values(instructor).returning();
    return created;
  }

  async updateInstructorStatus(id: number, status: typeof OnlineStatus[keyof typeof OnlineStatus]): Promise<Instructor | undefined> {
    const [updated] = await db.update(instructors)
      .set({ 
        onlineStatus: status,
        isAvailable: status === OnlineStatus.ONLINE 
      })
      .where(eq(instructors.id, id))
      .returning();
    return updated;
  }

  // Chat methods
  async getConversationsByCourseId(courseId: string): Promise<Conversation[]> {
    return db.select()
      .from(conversations)
      .where(eq(conversations.courseId, courseId))
      .orderBy(desc(conversations.updatedAt));
  }

  async getConversationById(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(conversation: Omit<Conversation, 'id'>): Promise<Conversation> {
    const [created] = await db.insert(conversations).values(conversation).returning();
    return created;
  }

  async addParticipantToConversation(participant: Omit<ConversationParticipant, 'id'>): Promise<ConversationParticipant> {
    const [created] = await db.insert(conversationParticipants).values(participant).returning();
    return created;
  }

  async getConversationParticipants(conversationId: number): Promise<ConversationParticipant[]> {
    return db.select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId));
  }

  // Message methods
  async getMessagesByConversationId(conversationId: number): Promise<ChatMessage[]> {
    return db.select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(asc(chatMessages.sentAt));
  }

  async addMessage(message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
    const [created] = await db.insert(chatMessages).values(message).returning();
    
    // Update conversation's updatedAt timestamp
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return created;
  }

  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    await db.update(chatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(chatMessages.conversationId, conversationId),
          eq(chatMessages.isRead, false)
        )
      );
    
    // Update participant's last read timestamp
    await db.update(conversationParticipants)
      .set({ lastRead: new Date() })
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );
  }

  // Course instructors
  async getCourseInstructors(courseId: string): Promise<User[]> {
    const instructorUsers = await db
      .select({
        user: users
      })
      .from(users)
      .innerJoin(
        instructors,
        eq(users.id, instructors.userId)
      )
      .where(eq(users.role, UserRole.INSTRUCTOR));
    
    return instructorUsers.map(result => result.user);
  }

  async getStudentConversations(userId: number): Promise<Conversation[]> {
    const result = await db
      .select({
        conversation: conversations
      })
      .from(conversations)
      .innerJoin(
        conversationParticipants,
        eq(conversations.id, conversationParticipants.conversationId)
      )
      .where(eq(conversationParticipants.userId, userId))
      .orderBy(desc(conversations.updatedAt));
    
    return result.map(r => r.conversation);
  }
}

// Using database storage
export const storage = new DatabaseStorage();
