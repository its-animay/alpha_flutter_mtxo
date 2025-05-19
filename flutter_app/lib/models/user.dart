class User {
  final int id;
  final String username;
  final String email;
  final String fullName;
  final String? profilePicture;
  final String? role;
  final Map<String, dynamic>? preferences;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.fullName,
    this.profilePicture,
    this.role,
    this.preferences,
  });

  // Create user from JSON data
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      fullName: json['fullName'],
      profilePicture: json['profilePicture'],
      role: json['role'],
      preferences: json['preferences'],
    );
  }

  // Convert user to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
      'profilePicture': profilePicture,
      'role': role,
      'preferences': preferences,
    };
  }

  // Create a copy of the user with updated fields
  User copyWith({
    int? id,
    String? username,
    String? email,
    String? fullName,
    String? profilePicture,
    String? role,
    Map<String, dynamic>? preferences,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      profilePicture: profilePicture ?? this.profilePicture,
      role: role ?? this.role,
      preferences: preferences ?? this.preferences,
    );
  }
}