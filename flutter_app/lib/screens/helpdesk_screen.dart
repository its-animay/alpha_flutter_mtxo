import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mtxo_labs_edtech/services/auth_service.dart';
import 'package:mtxo_labs_edtech/services/chat_service.dart';
import 'package:mtxo_labs_edtech/models/message.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';
import 'package:intl/intl.dart';

class HelpdeskScreen extends StatefulWidget {
  const HelpdeskScreen({super.key});

  @override
  State<HelpdeskScreen> createState() => _HelpdeskScreenState();
}

class _HelpdeskScreenState extends State<HelpdeskScreen> {
  final ChatService _chatService = ChatService();
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  bool _isLoading = true;
  List<ChatMessage> _messages = [];
  List<String> _supportTopics = [
    'Technical Issues',
    'Course Content',
    'Billing',
    'Account',
    'Other'
  ];
  String? _selectedTopic;
  bool _isComposing = false;
  
  @override
  void initState() {
    super.initState();
    _loadMessages();
  }
  
  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
  
  Future<void> _loadMessages() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final messages = await _chatService.getHelpdeskMessages();
      
      setState(() {
        _messages = messages;
      });
    } catch (e) {
      debugPrint('Error loading messages: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
      
      // Scroll to bottom after loading messages
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToBottom();
      });
    }
  }
  
  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }
  
  Future<void> _sendMessage() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final user = authService.currentUser;
    
    if (user == null) return;
    
    final messageText = _messageController.text.trim();
    if (messageText.isEmpty) return;
    
    _messageController.clear();
    
    // Create a temporary message to show immediately
    final tempMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      conversationId: 'helpdesk',
      senderId: user.id.toString(),
      senderName: user.fullName ?? user.username,
      senderAvatar: user.profileImage,
      content: messageText,
      timestamp: DateTime.now(),
      isRead: false,
      messageType: 'text',
    );
    
    setState(() {
      _messages.add(tempMessage);
      _isComposing = false;
    });
    
    // Scroll to the new message
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
    
    try {
      // Send the message to the server
      await _chatService.sendHelpdeskMessage(messageText, _selectedTopic);
      
      // Simulate receiving a support response after a short delay
      if (mounted) {
        await Future.delayed(const Duration(seconds: 2));
        
        final supportMessage = ChatMessage(
          id: DateTime.now().millisecondsSinceEpoch.toString() + '1',
          conversationId: 'helpdesk',
          senderId: 'support',
          senderName: 'Support Team',
          senderAvatar: null,
          content: 'Thank you for contacting us. A support agent will respond to your message shortly. If this is urgent, please call our support hotline at (555) 123-4567.',
          timestamp: DateTime.now(),
          isRead: false,
          messageType: 'text',
        );
        
        setState(() {
          _messages.add(supportMessage);
        });
        
        // Scroll to the new message
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _scrollToBottom();
        });
      }
    } catch (e) {
      debugPrint('Error sending message: $e');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to send message. Please try again.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
  
  void _showTopicSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(20),
        ),
      ),
      builder: (context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Select Support Topic',
                style: AppTextStyles.heading4,
              ),
            ),
            const Divider(),
            Expanded(
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: _supportTopics.length,
                itemBuilder: (context, index) {
                  final topic = _supportTopics[index];
                  return ListTile(
                    title: Text(topic),
                    leading: Icon(_getTopicIcon(topic)),
                    onTap: () {
                      setState(() {
                        _selectedTopic = topic;
                      });
                      Navigator.pop(context);
                    },
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
  
  IconData _getTopicIcon(String topic) {
    switch (topic) {
      case 'Technical Issues':
        return Icons.computer;
      case 'Course Content':
        return Icons.menu_book;
      case 'Billing':
        return Icons.payment;
      case 'Account':
        return Icons.person;
      case 'Other':
        return Icons.help;
      default:
        return Icons.help;
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authService = Provider.of<AuthService>(context);
    final user = authService.currentUser;
    
    if (user == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Helpdesk'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.support_agent,
                size: 80,
                color: theme.colorScheme.primary.withOpacity(0.5),
              ),
              const SizedBox(height: 16),
              Text(
                'Sign In Required',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: 8),
              const Text(
                'Please sign in to contact support',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => Navigator.pushReplacementNamed(context, '/auth/login'),
                child: const Text('Sign In'),
              ),
            ],
          ),
        ),
      );
    }
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Helpdesk'),
        actions: [
          if (_selectedTopic != null)
            Center(
              child: Container(
                margin: const EdgeInsets.only(right: 16),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _getTopicIcon(_selectedTopic!),
                      size: 16,
                      color: theme.colorScheme.onPrimaryContainer,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _selectedTopic!,
                      style: TextStyle(
                        color: theme.colorScheme.onPrimaryContainer,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.topic),
            onPressed: _showTopicSelector,
            tooltip: 'Select Topic',
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages list
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _messages.isEmpty
                    ? _buildEmptyState()
                    : _buildMessagesList(),
          ),
          
          // Message input
          _buildMessageInput(),
        ],
      ),
    );
  }
  
  Widget _buildEmptyState() {
    final theme = Theme.of(context);
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.support_agent,
            size: 80,
            color: theme.colorScheme.primary.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'Contact Support',
            style: AppTextStyles.heading3,
          ),
          const SizedBox(height: 8),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              'Our support team is here to help. Select a topic and send us a message.',
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            icon: const Icon(Icons.topic),
            label: const Text('Select Support Topic'),
            onPressed: _showTopicSelector,
          ),
        ],
      ),
    );
  }
  
  Widget _buildMessagesList() {
    final theme = Theme.of(context);
    final authService = Provider.of<AuthService>(context);
    final currentUserId = authService.currentUser?.id.toString() ?? '';
    
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final message = _messages[index];
        final isCurrentUser = message.senderId == currentUserId;
        final previousMessage = index > 0 ? _messages[index - 1] : null;
        final nextMessage = index < _messages.length - 1 ? _messages[index + 1] : null;
        
        // Check if we should show the timestamp
        final showTimestamp = previousMessage == null || 
          _shouldShowTimestamp(message.timestamp, previousMessage.timestamp);
        
        // Check if we should show the sender info (avatar, name)
        final showSenderInfo = previousMessage == null || 
          previousMessage.senderId != message.senderId || 
          showTimestamp;
        
        // Check if this is the last message from this sender
        final isLastFromSender = nextMessage == null || 
          nextMessage.senderId != message.senderId;
        
        return Column(
          children: [
            // Date separator if needed
            if (showTimestamp)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.onSurface.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _formatMessageDate(message.timestamp),
                      style: TextStyle(
                        fontSize: 12,
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ),
                ),
              ),
              
            // Message bubble
            Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Row(
                mainAxisAlignment: isCurrentUser 
                    ? MainAxisAlignment.end 
                    : MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Avatar (only for non-current user messages)
                  if (!isCurrentUser && showSenderInfo)
                    Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: CircleAvatar(
                        radius: 16,
                        backgroundImage: message.senderAvatar != null 
                            ? NetworkImage(message.senderAvatar!)
                            : null,
                        child: message.senderAvatar == null
                            ? Text(
                                message.senderName.substring(0, 1).toUpperCase(),
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              )
                            : null,
                      ),
                    )
                  else if (!isCurrentUser && !showSenderInfo)
                    const SizedBox(width: 40), // Space for avatar alignment
                  
                  // Message content
                  Column(
                    crossAxisAlignment: isCurrentUser 
                        ? CrossAxisAlignment.end 
                        : CrossAxisAlignment.start,
                    children: [
                      // Sender name (only for non-current user)
                      if (!isCurrentUser && showSenderInfo)
                        Padding(
                          padding: const EdgeInsets.only(left: 4.0, bottom: 4.0),
                          child: Text(
                            message.senderName,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.onSurface.withOpacity(0.7),
                            ),
                          ),
                        ),
                      
                      // Message bubble
                      Container(
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.of(context).size.width * 0.75,
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: isCurrentUser 
                              ? theme.colorScheme.primary
                              : theme.cardColor,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(isCurrentUser || !showSenderInfo ? 16 : 4),
                            topRight: Radius.circular(isCurrentUser && showSenderInfo ? 4 : 16),
                            bottomLeft: const Radius.circular(16),
                            bottomRight: const Radius.circular(16),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 3,
                              offset: const Offset(0, 1),
                            ),
                          ],
                        ),
                        child: Text(
                          message.content,
                          style: TextStyle(
                            color: isCurrentUser 
                                ? theme.colorScheme.onPrimary
                                : theme.colorScheme.onSurface,
                          ),
                        ),
                      ),
                      
                      // Timestamp
                      if (isLastFromSender)
                        Padding(
                          padding: const EdgeInsets.only(top: 4.0, left: 4.0, right: 4.0),
                          child: Text(
                            _formatMessageTime(message.timestamp),
                            style: TextStyle(
                              fontSize: 11,
                              color: theme.colorScheme.onSurface.withOpacity(0.5),
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
  
  Widget _buildMessageInput() {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      decoration: BoxDecoration(
        color: theme.cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Attachment button
            IconButton(
              icon: const Icon(Icons.attach_file),
              onPressed: () {
                // Show attachment options
              },
              color: theme.colorScheme.primary,
            ),
            
            // Message input field
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: theme.dividerColor,
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        textCapitalization: TextCapitalization.sentences,
                        maxLines: null,
                        decoration: InputDecoration(
                          hintText: _selectedTopic == null
                              ? 'Select a topic first...'
                              : 'Type a message...',
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 10,
                          ),
                        ),
                        onChanged: (text) {
                          setState(() {
                            _isComposing = text.trim().isNotEmpty;
                          });
                        },
                        enabled: _selectedTopic != null,
                      ),
                    ),
                    
                    // Emoji button
                    IconButton(
                      icon: const Icon(Icons.emoji_emotions_outlined),
                      onPressed: () {
                        // Show emoji picker
                      },
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ],
                ),
              ),
            ),
            
            // Send button
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: _isComposing ? 48 : 0,
              child: _isComposing
                  ? IconButton(
                      icon: const Icon(Icons.send),
                      onPressed: _selectedTopic == null ? null : _sendMessage,
                      color: theme.colorScheme.primary,
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
  
  bool _shouldShowTimestamp(DateTime current, DateTime previous) {
    return current.day != previous.day ||
           current.month != previous.month ||
           current.year != previous.year;
  }
  
  String _formatMessageDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final messageDate = DateTime(date.year, date.month, date.day);
    
    if (messageDate == today) {
      return 'Today';
    } else if (messageDate == yesterday) {
      return 'Yesterday';
    } else if (now.difference(date).inDays < 7) {
      return DateFormat('EEEE').format(date); // Day name
    } else {
      return DateFormat('MMMM d, y').format(date); // Month day, year
    }
  }
  
  String _formatMessageTime(DateTime date) {
    return DateFormat('h:mm a').format(date); // 3:42 PM
  }
}