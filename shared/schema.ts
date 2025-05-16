import { pgTable, text, serial, integer, boolean, timestamp, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const UserRole = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin"
} as const;

// Subscription plans
export const SubscriptionPlan = {
  FREE: "free",
  PREMIUM: "premium",
  PRO: "pro"
} as const;

// Online status
export const OnlineStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
  AWAY: "away"
} as const;

// Message types
export const MessageType = {
  TEXT: "text",
  FILE: "file",
  AUDIO: "audio"
} as const;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
  profilePicture: text("profile_picture"),
  role: text("role").default(UserRole.STUDENT).notNull(),
  dateJoined: timestamp("date_joined").defaultNow().notNull(),
  lastActive: timestamp("last_active"),
  preferences: json("preferences").$type<{
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  }>()
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  plan: text("plan").default(SubscriptionPlan.FREE).notNull(),
  startDate: date("start_date").defaultNow().notNull(),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
});

// Payment history table
export const paymentHistory = pgTable("payment_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id).notNull(),
  amount: integer("amount").notNull(), // in cents
  date: timestamp("date").defaultNow().notNull(),
  method: text("method").notNull(), // e.g., "credit_card", "paypal"
  status: text("status").notNull(), // e.g., "succeeded", "failed"
  transactionId: text("transaction_id").unique(),
});

// Course enrollments table
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: text("course_id").notNull(), // Reference to course ID from courses.ts data
  enrollDate: timestamp("enroll_date").defaultNow().notNull(),
  progress: integer("progress").default(0).notNull(), // Progress percentage
  isCompleted: boolean("is_completed").default(false).notNull(),
  completionDate: timestamp("completion_date"),
  certificateId: text("certificate_id"),
});

// Instructors table (extends users)
export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  specialization: text("specialization"),
  bio: text("bio"),
  isAvailable: boolean("is_available").default(false).notNull(),
  onlineStatus: text("online_status").default(OnlineStatus.OFFLINE),
});

// Chat conversations table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  courseId: text("course_id").notNull(), // Reference to course ID from courses.ts data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Conversation participants table
export const conversationParticipants = pgTable("conversation_participants", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // "student" or "instructor"
  lastRead: timestamp("last_read"),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  messageType: text("message_type").default(MessageType.TEXT).notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  audioUrl: text("audio_url"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  profilePicture: true,
  role: true,
  preferences: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments);
export const insertInstructorSchema = createInsertSchema(instructors);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertConversationParticipantSchema = createInsertSchema(conversationParticipants);
export const insertChatMessageSchema = createInsertSchema(chatMessages);

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type Instructor = typeof instructors.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type ConversationParticipant = typeof conversationParticipants.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
