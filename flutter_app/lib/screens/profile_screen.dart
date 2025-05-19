import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:mtxo_labs_edtech/services/auth_service.dart';
import 'package:mtxo_labs_edtech/services/course_service.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';
import 'package:mtxo_labs_edtech/models/user.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  final CourseService _courseService = CourseService();
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _bioController = TextEditingController();
  
  late TabController _tabController;
  bool _isLoading = true;
  bool _isEditing = false;
  File? _profileImage;
  
  // User stats
  int _totalCourses = 0;
  int _completedCourses = 0;
  int _certificatesEarned = 0;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadUserData();
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    _fullNameController.dispose();
    _bioController.dispose();
    super.dispose();
  }
  
  Future<void> _loadUserData() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final user = authService.currentUser;
      
      if (user != null) {
        _fullNameController.text = user.fullName ?? '';
        _bioController.text = user.bio ?? '';
        
        // Load user stats from course service
        final enrollments = await _courseService.getUserEnrollments();
        final completedCourses = enrollments.where((e) => e['progress'] == 100).length;
        final certificates = await _courseService.getUserCertificates();
        
        setState(() {
          _totalCourses = enrollments.length;
          _completedCourses = completedCourses;
          _certificatesEarned = certificates.length;
        });
      }
    } catch (e) {
      debugPrint('Error loading user data: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    
    if (image != null) {
      setState(() {
        _profileImage = File(image.path);
      });
    }
  }
  
  Future<void> _saveProfile() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    
    try {
      setState(() {
        _isLoading = true;
      });
      
      final Map<String, dynamic> userData = {
        'fullName': _fullNameController.text,
        'bio': _bioController.text,
      };
      
      final success = await authService.updateProfile(userData, _profileImage);
      
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        
        setState(() {
          _isEditing = false;
        });
      }
    } catch (e) {
      debugPrint('Error updating profile: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update profile: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final authService = Provider.of<AuthService>(context);
    final user = authService.currentUser;
    
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Profile'),
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    if (user == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Profile'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.account_circle,
                size: 80,
                color: theme.colorScheme.primary.withOpacity(0.5),
              ),
              const SizedBox(height: 16),
              Text(
                'Not Signed In',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: 8),
              const Text(
                'Please sign in to view your profile',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/auth/login'),
                child: const Text('Sign In'),
              ),
            ],
          ),
        ),
      );
    }
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          // Edit profile button
          if (!_isEditing)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                setState(() {
                  _isEditing = true;
                });
              },
              tooltip: 'Edit Profile',
            )
          else
            TextButton.icon(
              icon: const Icon(Icons.save),
              label: const Text('Save'),
              onPressed: _saveProfile,
            ),
        ],
      ),
      body: Column(
        children: [
          // Profile header
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: isDark ? theme.colorScheme.primary.withOpacity(0.2) : theme.colorScheme.primary.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: Column(
              children: [
                // Profile image and edit button
                Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    // Profile image
                    GestureDetector(
                      onTap: _isEditing ? _pickImage : null,
                      child: CircleAvatar(
                        radius: 50,
                        backgroundColor: Colors.white,
                        backgroundImage: _profileImage != null
                            ? FileImage(_profileImage!)
                            : (user.profileImage != null
                                ? NetworkImage(user.profileImage!)
                                : null),
                        child: user.profileImage == null && _profileImage == null
                            ? Icon(
                                Icons.person,
                                size: 50,
                                color: isDark ? Colors.white54 : Colors.black26,
                              )
                            : null,
                      ),
                    ),
                    
                    // Edit icon
                    if (_isEditing)
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.camera_alt,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                // User name
                if (_isEditing)
                  Container(
                    width: 250,
                    child: TextField(
                      controller: _fullNameController,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.heading3.copyWith(
                        color: theme.colorScheme.onSurface,
                      ),
                      decoration: const InputDecoration(
                        hintText: 'Your Name',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                      ),
                    ),
                  )
                else
                  Text(
                    user.fullName ?? user.username,
                    style: AppTextStyles.heading3.copyWith(
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                
                const SizedBox(height: 8),
                
                // User email
                Text(
                  user.email ?? 'No email provided',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // User bio
                if (_isEditing)
                  Container(
                    width: double.infinity,
                    constraints: const BoxConstraints(maxWidth: 400),
                    child: TextField(
                      controller: _bioController,
                      maxLines: 3,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.bodyMedium,
                      decoration: const InputDecoration(
                        hintText: 'Write a short bio about yourself',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.all(12),
                      ),
                    ),
                  )
                else if (user.bio?.isNotEmpty == true)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Text(
                      user.bio!,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.bodyMedium.copyWith(
                        fontStyle: FontStyle.italic,
                        color: theme.colorScheme.onSurface.withOpacity(0.8),
                      ),
                    ),
                  ),
                
                if (!_isEditing) ...[
                  const SizedBox(height: 24),
                  
                  // User stats
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatItem(
                        'Enrolled',
                        _totalCourses.toString(),
                        Icons.menu_book,
                        theme.colorScheme.primary,
                      ),
                      _buildStatItem(
                        'Completed',
                        _completedCourses.toString(),
                        Icons.check_circle,
                        AppColors.success,
                      ),
                      _buildStatItem(
                        'Certificates',
                        _certificatesEarned.toString(),
                        Icons.card_membership,
                        Colors.amber,
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          
          // Tabs
          TabBar(
            controller: _tabController,
            tabs: const [
              Tab(text: 'My Courses'),
              Tab(text: 'Achievements'),
              Tab(text: 'Settings'),
            ],
            indicatorColor: theme.colorScheme.primary,
            labelColor: theme.colorScheme.primary,
            unselectedLabelColor: theme.colorScheme.onSurface.withOpacity(0.7),
          ),
          
          // Tab views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // My Courses Tab
                _buildMyCoursesTab(),
                
                // Achievements Tab
                _buildAchievementsTab(),
                
                // Settings Tab
                _buildSettingsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildStatItem(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: color,
            size: 24,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: AppTextStyles.heading4.copyWith(
            color: color,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: AppTextStyles.bodySmall.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
          ),
        ),
      ],
    );
  }
  
  Widget _buildMyCoursesTab() {
    return FutureBuilder(
      future: _courseService.getUserEnrollments(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        
        if (snapshot.hasError) {
          return Center(
            child: Text('Error loading courses: ${snapshot.error}'),
          );
        }
        
        final enrollments = snapshot.data as List<dynamic>? ?? [];
        
        if (enrollments.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.school_outlined,
                  size: 64,
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.5),
                ),
                const SizedBox(height: 16),
                const Text(
                  'You haven\'t enrolled in any courses yet',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.heading5,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Browse our catalog to find courses that interest you',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => context.push('/courses'),
                  child: const Text('Browse Courses'),
                ),
              ],
            ),
          );
        }
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: enrollments.length,
          itemBuilder: (context, index) {
            final enrollment = enrollments[index];
            
            return Card(
              margin: const EdgeInsets.only(bottom: 16),
              child: InkWell(
                onTap: () => context.push('/course/${enrollment['courseId']}'),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Course image
                    if (enrollment['thumbnail'] != null)
                      SizedBox(
                        height: 120,
                        width: double.infinity,
                        child: Image.network(
                          enrollment['thumbnail'],
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: Colors.grey[300],
                            child: const Center(child: Icon(Icons.error)),
                          ),
                        ),
                      ),
                    
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Course name
                          Text(
                            enrollment['courseName'] ?? 'Unknown Course',
                            style: AppTextStyles.heading5,
                          ),
                          const SizedBox(height: 4),
                          
                          // Instructor name
                          Text(
                            'Instructor: ${enrollment['instructorName'] ?? 'Unknown'}',
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                            ),
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Progress bar
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: (enrollment['progress'] ?? 0) / 100,
                              backgroundColor: Theme.of(context).colorScheme.onSurface.withOpacity(0.1),
                              minHeight: 8,
                            ),
                          ),
                          const SizedBox(height: 8),
                          
                          // Progress text
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${enrollment['progress'] ?? 0}% Complete',
                                style: AppTextStyles.bodyMedium.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                              ),
                              Text(
                                'Last accessed: ${enrollment['lastAccessDate'] ?? 'Never'}',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    
                    // Continue learning button
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      child: ElevatedButton.icon(
                        onPressed: () {
                          // Navigate to the course or last accessed lesson
                          context.push('/course/${enrollment['courseId']}');
                        },
                        icon: const Icon(Icons.play_circle_outline),
                        label: const Text('Continue Learning'),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 40),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
  
  Widget _buildAchievementsTab() {
    return FutureBuilder(
      future: _courseService.getUserCertificates(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final certificates = snapshot.data as List<dynamic>? ?? [];
        
        if (certificates.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.emoji_events_outlined,
                  size: 64,
                  color: Colors.amber.withOpacity(0.5),
                ),
                const SizedBox(height: 16),
                const Text(
                  'No Achievements Yet',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.heading5,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Complete courses to earn certificates and achievements',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => context.push('/courses'),
                  child: const Text('Find Courses'),
                ),
              ],
            ),
          );
        }
        
        return GridView.builder(
          padding: const EdgeInsets.all(16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.75,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
          ),
          itemCount: certificates.length,
          itemBuilder: (context, index) {
            final certificate = certificates[index];
            
            return Card(
              clipBehavior: Clip.antiAlias,
              elevation: 3,
              child: InkWell(
                onTap: () {
                  // View certificate details
                },
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Certificate image
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Colors.blue.shade700,
                              Colors.purple.shade700,
                            ],
                          ),
                        ),
                        child: Center(
                          child: Icon(
                            Icons.card_membership,
                            size: 50,
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ),
                    ),
                    
                    // Certificate info
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            certificate['courseName'] ?? 'Certificate',
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: AppTextStyles.bodyLarge.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Issued on: ${certificate['issueDate'] ?? 'Unknown'}',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
  
  Widget _buildSettingsTab() {
    final theme = Theme.of(context);
    
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Account settings section
        Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Account Settings',
                  style: AppTextStyles.heading5,
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.lock_outline),
                title: const Text('Change Password'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // Navigate to change password screen
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.email_outlined),
                title: const Text('Email Notifications'),
                trailing: Switch(
                  value: true, // Get from user preferences
                  onChanged: (value) {
                    // Update user preferences
                  },
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.language_outlined),
                title: const Text('Language'),
                subtitle: const Text('English'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // Show language picker
                },
              ),
            ],
          ),
        ),
        
        // App settings section
        Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'App Settings',
                  style: AppTextStyles.heading5,
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.dark_mode_outlined),
                title: const Text('Dark Mode'),
                trailing: Switch(
                  value: theme.brightness == Brightness.dark,
                  onChanged: (value) {
                    // Toggle theme
                  },
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.notifications_outlined),
                title: const Text('Push Notifications'),
                trailing: Switch(
                  value: true, // Get from user preferences
                  onChanged: (value) {
                    // Update user preferences
                  },
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.download_outlined),
                title: const Text('Download Quality'),
                subtitle: const Text('High'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // Show quality picker
                },
              ),
            ],
          ),
        ),
        
        // Support section
        Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Support',
                  style: AppTextStyles.heading5,
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.help_outline),
                title: const Text('Help Center'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // Navigate to help center
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.chat_outlined),
                title: const Text('Contact Support'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  context.push('/helpdesk');
                },
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.info_outline),
                title: const Text('About'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // Show about dialog
                  showAboutDialog(
                    context: context,
                    applicationName: 'MTXO Labs EdTech',
                    applicationVersion: '1.0.0',
                    applicationIcon: Image.asset(
                      'assets/images/logo.png',
                      width: 50,
                      height: 50,
                    ),
                    applicationLegalese: '© 2023 MTXO Labs. All rights reserved.',
                  );
                },
              ),
            ],
          ),
        ),
        
        // Logout button
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: ElevatedButton.icon(
            onPressed: () {
              // Show confirmation dialog
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.colorScheme.error,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                        Provider.of<AuthService>(context, listen: false).signOut();
                        context.go('/auth/login');
                      },
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );
            },
            icon: const Icon(Icons.logout),
            label: const Text('Logout'),
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 48),
              backgroundColor: theme.colorScheme.error,
              foregroundColor: Colors.white,
            ),
          ),
        ),
      ],
    );
  }
}