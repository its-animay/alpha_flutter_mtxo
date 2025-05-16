import apiRequest from './apiService';
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
   * @param file File to upload
   * @returns Uploaded file URL
   */
  uploadFile: async (file: File): Promise<{fileUrl: string, fileType: string, fileName: string}> => {
    // In a real implementation, this would upload the file to a server
    // For the mock implementation, we'll just return a mock URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fileUrl: URL.createObjectURL(file),
          fileType: file.type.split('/')[1] || 'file',
          fileName: file.name
        });
      }, 1000);
    });
  },
  
  /**
   * Record audio (for audio messages)
   * @param audioBlobUrl Audio blob URL from MediaRecorder
   * @param duration Duration in seconds
   * @returns Audio URL and duration
   */
  processAudioMessage: async (audioBlobUrl: string, duration: number): Promise<{audioUrl: string, audioDuration: number}> => {
    // In a real implementation, this would upload the audio to a server
    // For the mock implementation, we'll just return the blob URL
    return {
      audioUrl: audioBlobUrl,
      audioDuration: duration
    };
  }
};

export default ConversationService;