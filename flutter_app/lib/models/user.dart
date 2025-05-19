/// User model representing a user in the application
class User {
  final int id;
  final String username;
  final String? email;
  final String? fullName;
  final String? profileImage;
  final String? bio;
  final Map<String, dynamic>? preferences;
  final String? role;
  final DateTime? createdAt;
  final DateTime? lastLoginAt;

  User({
    required this.id,
    required this.username,
    this.email,
    this.fullName,
    this.profileImage,
    this.bio,
    this.preferences,
    this.role,
    this.createdAt,
    this.lastLoginAt,
  });

  /// Create a User from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] is String ? int.parse(json['id']) : json['id'],
      username: json['username'],
      email: json['email'],
      fullName: json['fullName'],
      profileImage: json['profileImage'],
      bio: json['bio'],
      preferences: json['preferences'] != null 
          ? Map<String, dynamic>.from(json['preferences']) 
          : null,
      role: json['role'],
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : null,
      lastLoginAt: json['lastLoginAt'] != null 
          ? DateTime.parse(json['lastLoginAt']) 
          : null,
    );
  }

  /// Convert User to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
      'profileImage': profileImage,
      'bio': bio,
      'preferences': preferences,
      'role': role,
      'createdAt': createdAt?.toIso8601String(),
      'lastLoginAt': lastLoginAt?.toIso8601String(),
    };
  }

  /// Create a copy of this User with the given fields replaced
  User copyWith({
    int? id,
    String? username,
    String? email,
    String? fullName,
    String? profileImage,
    String? bio,
    Map<String, dynamic>? preferences,
    String? role,
    DateTime? createdAt,
    DateTime? lastLoginAt,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      profileImage: profileImage ?? this.profileImage,
      bio: bio ?? this.bio,
      preferences: preferences ?? this.preferences,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
    );
  }

  @override
  String toString() {
    return 'User(id: $id, username: $username, email: $email, fullName: $fullName)';
  }
}