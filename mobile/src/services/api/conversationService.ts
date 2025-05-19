import apiRequest, { uploadFile } from './apiService';
import { API_ENDPOINTS } from './config';

// Types for Conversation API service
export interface Participant {
  id: number;
  userId: number | string;
  name: string;
  avatar: string;
  role: 'student' | 'instructor';
}

export interface Message {
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

export interface Conversation {
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

export interface NewMessageRequest {
  content: string;
  messageType: 'text' | 'file' | 'audio';
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  audioUrl?: string;
  audioDuration?: number;
}

export interface NewConversationRequest {
  courseId: string;
  instructorId: string;
  title: string;
  initialMessage: string;
}

/**
 * Conversation Service for chat/helpdesk operations
 */
const ConversationService = {
  /**
   * Get all user conversations
   * @returns List of user conversations
   */
  getConversations: (): Promise<Conversation[]> => {
    return apiRequest(API_ENDPOINTS.CONVERSATIONS.GET_ALL);
  },
  
  /**
   * Get conversation by ID with messages
   * @param id Conversation ID
   * @returns Conversation with messages
   */
  getConversation: (id: number): Promise<Conversation> => {
    return apiRequest(API_ENDPOINTS.CONVERSATIONS.GET_CONVERSATION(id));
  },
  
  /**
   * Create new conversation
   * @param conversation New conversation data
   * @returns Created conversation
   */
  createConversation: (conversation: NewConversationRequest): Promise<Conversation> => {
    return apiRequest(API_ENDPOINTS.CONVERSATIONS.CREATE, 'POST', conversation);
  },
  
  /**
   * Send message to conversation
   * @param conversationId Conversation ID
   * @param message Message content
   * @returns Created message
   */
  sendMessage: (conversationId: number, message: NewMessageRequest): Promise<Message> => {
    return apiRequest(API_ENDPOINTS.CONVERSATIONS.SEND_MESSAGE(conversationId), 'POST', message);
  },
  
  /**
   * Get messages for a conversation
   * @param conversationId Conversation ID
   * @returns List of messages
   */
  getMessages: (conversationId: number): Promise<Message[]> => {
    return apiRequest(API_ENDPOINTS.CONVERSATIONS.GET_MESSAGES(conversationId));
  },
  
  /**
   * Upload file (for file messages)
   * @param uri File URI from document picker or camera
   * @param type File MIME type
   * @param name File name
   * @returns Uploaded file data
   */
  uploadMessageFile: async (uri: string, type: string, name: string): Promise<{fileUrl: string, fileType: string, fileName: string}> => {
    return uploadFile(uri, type, name, '/api/conversations/upload');
  },
  
  /**
   * Process audio message
   * @param audioUri Audio file URI
   * @param duration Duration in seconds
   * @returns Audio message data
   */
  processAudioMessage: async (audioUri: string, duration: number): Promise<{audioUrl: string, audioDuration: number}> => {
    const result = await uploadFile(audioUri, 'audio/m4a', 'audio_message.m4a', '/api/conversations/upload-audio');
    return {
      audioUrl: result.fileUrl,
      audioDuration: duration
    };
  }
};

export default ConversationService;