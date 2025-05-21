import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mtxo_labs_edtech/models/message.dart';
import 'package:mtxo_labs_edtech/config/api_config.dart';

/// A service that handles chat-related functionality
class ChatService {
  static const String _helpdeskMessagesKey = 'helpdesk_messages';
  static const String _conversationsKey = 'user_conversations';
  
  /// Get all helpdesk messages for the current user
  Future<List<ChatMessage>> getHelpdeskMessages() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedMessages = prefs.getString(_helpdeskMessagesKey);
      
      if (savedMessages != null) {
        final List<dynamic> messagesJson = jsonDecode(savedMessages);
        return messagesJson.map((json) => ChatMessage.fromJson(json)).toList();
      }
      
      // Return some default welcome messages if no messages exist
      return [
        ChatMessage(
          id: '1',
          conversationId: 'helpdesk',
          senderId: 'support',
          senderName: 'MTXO Support',
          content: 'Welcome to MTXO Labs EdTech! How can we help you today?',
          timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
          isRead: true,
          messageType: 'text',
        ),
      ];
    } catch (e) {
      // Return a fallback message if there is an error
      return [
        ChatMessage(
          id: '1',
          conversationId: 'helpdesk',
          senderId: 'support',
          senderName: 'MTXO Support',
          content: 'Welcome to MTXO Labs EdTech! How can we help you today?',
          timestamp: DateTime.now(),
          isRead: true,
          messageType: 'text',
        ),
      ];
    }
  }
  
  /// Send a helpdesk message
  Future<bool> sendHelpdeskMessage(String message, String? topic) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Get existing messages
      List<ChatMessage> messages = await getHelpdeskMessages();
      
      // Create a new message
      final newMessage = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        conversationId: 'helpdesk',
        senderId: 'user', // In a real app, this would be the user's ID
        senderName: 'You', // In a real app, this would be the user's name
        content: message,
        timestamp: DateTime.now(),
        isRead: true,
        messageType: 'text',
        metadata: topic != null ? {'topic': topic} : null,
      );
      
      // Add the new message to the list
      messages.add(newMessage);
      
      // Save the updated messages to shared preferences
      await prefs.setString(
        _helpdeskMessagesKey, 
        jsonEncode(messages.map((msg) => msg.toJson()).toList()),
      );
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /// Get all conversations for the current user
  Future<List<dynamic>> getUserConversations() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedConversations = prefs.getString(_conversationsKey);
      
      if (savedConversations != null) {
        return jsonDecode(savedConversations) as List<dynamic>;
      }
      
      return [];
    } catch (e) {
      return [];
    }
  }
  
  /// Create a new conversation
  Future<bool> createConversation(String title, String courseId, String instructorId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Get existing conversations
      final conversations = await getUserConversations();
      
      // Check if a conversation with this instructor for this course already exists
      if (conversations.any((c) => 
          c['courseId'] == courseId && 
          c['instructorId'] == instructorId)) {
        return true;
      }
      
      // Create a new conversation
      conversations.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'title': title,
        'courseId': courseId,
        'instructorId': instructorId,
        'lastMessage': 'No messages yet',
        'lastMessageTime': DateTime.now().toIso8601String(),
        'unreadCount': 0,
      });
      
      // Save the updated conversations to shared preferences
      await prefs.setString(_conversationsKey, jsonEncode(conversations));
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /// Get messages for a specific conversation
  Future<List<ChatMessage>> getConversationMessages(String conversationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final key = 'conversation_${conversationId}_messages';
      final savedMessages = prefs.getString(key);
      
      if (savedMessages != null) {
        final List<dynamic> messagesJson = jsonDecode(savedMessages);
        return messagesJson.map((json) => ChatMessage.fromJson(json)).toList();
      }
      
      return [];
    } catch (e) {
      return [];
    }
  }
  
  /// Send a message in a conversation
  Future<bool> sendConversationMessage(String conversationId, String message) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final key = 'conversation_${conversationId}_messages';
      
      // Get existing messages
      List<ChatMessage> messages = await getConversationMessages(conversationId);
      
      // Create a new message
      final newMessage = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        conversationId: conversationId,
        senderId: 'user', // In a real app, this would be the user's ID
        senderName: 'You', // In a real app, this would be the user's name
        content: message,
        timestamp: DateTime.now(),
        isRead: true,
        messageType: 'text',
      );
      
      // Add the new message to the list
      messages.add(newMessage);
      
      // Save the updated messages to shared preferences
      await prefs.setString(
        key, 
        jsonEncode(messages.map((msg) => msg.toJson()).toList()),
      );
      
      // Update the conversation's last message
      final conversations = await getUserConversations();
      final conversationIndex = conversations.indexWhere((c) => c['id'] == conversationId);
      
      if (conversationIndex != -1) {
        conversations[conversationIndex]['lastMessage'] = message;
        conversations[conversationIndex]['lastMessageTime'] = DateTime.now().toIso8601String();
        
        await prefs.setString(_conversationsKey, jsonEncode(conversations));
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /// Mark all messages in a conversation as read
  Future<bool> markConversationAsRead(String conversationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Update the conversation's unread count
      final conversations = await getUserConversations();
      final conversationIndex = conversations.indexWhere((c) => c['id'] == conversationId);
      
      if (conversationIndex != -1) {
        conversations[conversationIndex]['unreadCount'] = 0;
        
        await prefs.setString(_conversationsKey, jsonEncode(conversations));
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }
}