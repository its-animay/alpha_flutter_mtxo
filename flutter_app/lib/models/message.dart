/// Chat message model representing a message in a conversation
class ChatMessage {
  final String id;
  final String conversationId;
  final String senderId;
  final String senderName;
  final String? senderAvatar;
  final String content;
  final DateTime timestamp;
  final bool isRead;
  final String messageType;
  final Map<String, dynamic>? metadata;

  ChatMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    this.senderAvatar,
    required this.content,
    required this.timestamp,
    required this.isRead,
    required this.messageType,
    this.metadata,
  });

  /// Create a ChatMessage from JSON
  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'].toString(),
      conversationId: json['conversationId'].toString(),
      senderId: json['senderId'].toString(),
      senderName: json['senderName'],
      senderAvatar: json['senderAvatar'],
      content: json['content'],
      timestamp: DateTime.parse(json['timestamp']),
      isRead: json['isRead'] ?? false,
      messageType: json['messageType'] ?? 'text',
      metadata: json['metadata'],
    );
  }

  /// Convert ChatMessage to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'conversationId': conversationId,
      'senderId': senderId,
      'senderName': senderName,
      'senderAvatar': senderAvatar,
      'content': content,
      'timestamp': timestamp.toIso8601String(),
      'isRead': isRead,
      'messageType': messageType,
      'metadata': metadata,
    };
  }

  /// Create a copy of this ChatMessage with the given fields replaced
  ChatMessage copyWith({
    String? id,
    String? conversationId,
    String? senderId,
    String? senderName,
    String? senderAvatar,
    String? content,
    DateTime? timestamp,
    bool? isRead,
    String? messageType,
    Map<String, dynamic>? metadata,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      conversationId: conversationId ?? this.conversationId,
      senderId: senderId ?? this.senderId,
      senderName: senderName ?? this.senderName,
      senderAvatar: senderAvatar ?? this.senderAvatar,
      content: content ?? this.content,
      timestamp: timestamp ?? this.timestamp,
      isRead: isRead ?? this.isRead,
      messageType: messageType ?? this.messageType,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  String toString() {
    return 'ChatMessage(id: $id, sender: $senderName, content: $content)';
  }
}