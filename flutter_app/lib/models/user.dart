/// User model representing a user in the application
class User {
  final int id;
  final String username;
  final String? email;
  final String? fullName;
  final String? profileImage;
  final String? bio;
  final String role;
  final DateTime? createdAt;
  final Map<String, dynamic>? preferences;
  final List<dynamic>? enrolledCourses;
  final List<String>? achievements;

  User({
    required this.id,
    required this.username,
    this.email,
    this.fullName,
    this.profileImage,
    this.bio,
    required this.role,
    this.createdAt,
    this.preferences,
    this.enrolledCourses,
    this.achievements,
  });

  /// Create a User from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      fullName: json['fullName'],
      profileImage: json['profileImage'],
      bio: json['bio'],
      role: json['role'] ?? 'student',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      preferences: json['preferences'],
      enrolledCourses: json['enrolledCourses'],
      achievements: json['achievements'] != null 
          ? List<String>.from(json['achievements']) 
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
      'role': role,
      'createdAt': createdAt?.toIso8601String(),
      'preferences': preferences,
      'enrolledCourses': enrolledCourses,
      'achievements': achievements,
    };
  }

  /// Create a copy of the user with updated fields
  User copyWith({
    int? id,
    String? username,
    String? email,
    String? fullName,
    String? profileImage,
    String? bio,
    String? role,
    DateTime? createdAt,
    Map<String, dynamic>? preferences,
    List<dynamic>? enrolledCourses,
    List<String>? achievements,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      profileImage: profileImage ?? this.profileImage,
      bio: bio ?? this.bio,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
      preferences: preferences ?? this.preferences,
      enrolledCourses: enrolledCourses ?? this.enrolledCourses,
      achievements: achievements ?? this.achievements,
    );
  }
}