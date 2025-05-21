import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_service.dart';
import '../theme/app_theme.dart';
import '../widgets/glassmorphic_card.dart';
import '../widgets/animated_gradient_background.dart';
import '../widgets/theme_toggle_button.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isEditing = false;
  final _formKey = GlobalKey<FormState>();
  
  // Form controllers
  final _fullNameController = TextEditingController();
  final _bioController = TextEditingController();
  final _emailController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    
    // Initialize form controllers with user data
    final authService = Provider.of<AuthService>(context, listen: false);
    final user = authService.currentUser;
    
    if (user != null) {
      _fullNameController.text = user.fullName ?? '';
      _bioController.text = user.bio ?? '';
      _emailController.text = user.email ?? '';
    }
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    _fullNameController.dispose();
    _bioController.dispose();
    _emailController.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final theme = Theme.of(context);
    final user = authService.currentUser;
    
    if (user == null) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: NestedScrollView(
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: _buildProfileHeader(theme, user),
                  ),
                ),
                SliverPersistentHeader(
                  pinned: true,
                  delegate: _SliverAppBarDelegate(
                    TabBar(
                      controller: _tabController,
                      labelColor: theme.colorScheme.primary,
                      unselectedLabelColor: theme.colorScheme.onSurface.withOpacity(0.7),
                      indicatorColor: theme.colorScheme.primary,
                      indicatorSize: TabBarIndicatorSize.tab,
                      labelStyle: AppTextStyles.bodyMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      unselectedLabelStyle: AppTextStyles.bodyMedium,
                      tabs: const [
                        Tab(text: 'Profile'),
                        Tab(text: 'Achievements'),
                        Tab(text: 'Settings'),
                      ],
                    ),
                  ),
                ),
              ];
            },
            body: TabBarView(
              controller: _tabController,
              children: [
                _buildProfileTab(theme, user),
                _buildAchievementsTab(theme),
                _buildSettingsTab(theme),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildProfileHeader(ThemeData theme, dynamic user) {
    return GlassmorphicCard(
      padding: EdgeInsets.zero,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Cover image and profile picture
          Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.bottomCenter,
            children: [
              // Cover image
              Container(
                height: 120,
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      theme.colorScheme.primary.withOpacity(0.7),
                      theme.colorScheme.secondary.withOpacity(0.7),
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(16),
                    topRight: Radius.circular(16),
                  ),
                ),
              ),
              
              // Profile picture
              Positioned(
                bottom: -50,
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: theme.cardColor,
                      width: 4,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: CircleAvatar(
                    radius: 50,
                    backgroundColor: theme.colorScheme.primary.withOpacity(0.2),
                    backgroundImage: user.profileImage != null
                        ? NetworkImage(user.profileImage!)
                        : null,
                    child: user.profileImage == null
                        ? Text(
                            _getInitials(user.fullName ?? user.username),
                            style: AppTextStyles.heading2.copyWith(
                              color: theme.colorScheme.primary,
                            ),
                          )
                        : null,
                  ),
                ),
              ),
              
              // Edit profile button
              Positioned(
                right: 16,
                bottom: -20,
                child: ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _isEditing = !_isEditing;
                    });
                  },
                  icon: Icon(_isEditing ? Icons.close : Icons.edit),
                  label: Text(_isEditing ? 'Cancel' : 'Edit Profile'),
                  style: ElevatedButton.styleFrom(
                    foregroundColor: theme.colorScheme.onPrimary,
                    backgroundColor: theme.colorScheme.primary,
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
              ),
            ],
          ),
          
          // User info
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 60, 16, 16),
            child: Column(
              children: [
                Text(
                  user.fullName ?? user.username,
                  style: AppTextStyles.heading3.copyWith(
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user.email ?? '',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
                if (user.bio != null && user.bio!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Text(
                    user.bio!,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: theme.colorScheme.onSurface,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
                const SizedBox(height: 16),
                
                // Stats row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildStatItem(
                      context,
                      label: 'Courses',
                      value: '6',
                      icon: Icons.menu_book,
                    ),
                    _buildVerticalDivider(context),
                    _buildStatItem(
                      context,
                      label: 'Completed',
                      value: '3',
                      icon: Icons.check_circle,
                    ),
                    _buildVerticalDivider(context),
                    _buildStatItem(
                      context,
                      label: 'Certificates',
                      value: '2',
                      icon: Icons.card_membership,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildProfileTab(ThemeData theme, dynamic user) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (_isEditing)
          _buildEditProfileForm(theme)
        else
          _buildProfileInfo(theme, user),
      ],
    );
  }
  
  Widget _buildProfileInfo(ThemeData theme, dynamic user) {
    final dateFormatter = DateFormat('MMMM yyyy');
    final memberSince = user.createdAt != null
        ? dateFormatter.format(user.createdAt!)
        : 'N/A';
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GlassmorphicCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'About Me',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                user.bio ?? 'No bio information provided.',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.8),
                ),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 16),
        
        GlassmorphicCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Account Information',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 16),
              
              // Username
              _buildInfoRow(
                theme,
                icon: Icons.person,
                label: 'Username',
                value: user.username,
              ),
              
              const SizedBox(height: 12),
              
              // Email
              _buildInfoRow(
                theme,
                icon: Icons.email,
                label: 'Email',
                value: user.email ?? 'Not provided',
              ),
              
              const SizedBox(height: 12),
              
              // Role
              _buildInfoRow(
                theme,
                icon: Icons.badge,
                label: 'Role',
                value: _capitalizeFirstLetter(user.role ?? 'Student'),
              ),
              
              const SizedBox(height: 12),
              
              // Member since
              _buildInfoRow(
                theme,
                icon: Icons.calendar_today,
                label: 'Member Since',
                value: memberSince,
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 16),
        
        GlassmorphicCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Learning Progress',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 16),
              
              // Progress bar
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Courses Progress',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: theme.colorScheme.onSurface,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '50%',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: LinearProgressIndicator(
                      value: 0.5,
                      backgroundColor: theme.colorScheme.surface,
                      color: theme.colorScheme.primary,
                      minHeight: 10,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Another progress bar
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Quizzes Completed',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: theme.colorScheme.onSurface,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '75%',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: theme.colorScheme.secondary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: LinearProgressIndicator(
                      value: 0.75,
                      backgroundColor: theme.colorScheme.surface,
                      color: theme.colorScheme.secondary,
                      minHeight: 10,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
  
  Widget _buildEditProfileForm(ThemeData theme) {
    return GlassmorphicCard(
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Edit Profile',
              style: AppTextStyles.heading4.copyWith(
                color: theme.colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 20),
            
            // Full name field
            TextFormField(
              controller: _fullNameController,
              decoration: InputDecoration(
                labelText: 'Full Name',
                prefixIcon: const Icon(Icons.person),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your full name';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Email field
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Email',
                prefixIcon: const Icon(Icons.email),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your email';
                }
                if (!value.contains('@')) {
                  return 'Please enter a valid email';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Bio field
            TextFormField(
              controller: _bioController,
              decoration: InputDecoration(
                labelText: 'Bio',
                prefixIcon: const Icon(Icons.description),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                alignLabelWithHint: true,
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),
            
            // Save button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _saveProfile,
                child: const Text('Save Changes'),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  void _saveProfile() {
    if (_formKey.currentState?.validate() ?? false) {
      // Simulating a successful profile update
      setState(() {
        _isEditing = false;
      });
      
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile updated successfully'),
          backgroundColor: Colors.green,
        ),
      );
      
      // In a real app, you would call the auth service to update the profile
      // final authService = Provider.of<AuthService>(context, listen: false);
      // authService.updateProfile({
      //   'fullName': _fullNameController.text,
      //   'email': _emailController.text,
      //   'bio': _bioController.text,
      // });
    }
  }
  
  Widget _buildAchievementsTab(ThemeData theme) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Achievements & Certificates',
          style: AppTextStyles.heading3.copyWith(
            color: theme.colorScheme.onBackground,
          ),
        ),
        const SizedBox(height: 16),
        
        // Badges section
        GlassmorphicCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Badges',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 16),
              
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  _buildAchievementBadge(
                    theme,
                    icon: Icons.rocket_launch,
                    title: 'Fast Learner',
                    description: 'Completed 3 courses in 30 days',
                    color: Colors.blue,
                  ),
                  _buildAchievementBadge(
                    theme,
                    icon: Icons.quiz,
                    title: 'Quiz Master',
                    description: 'Scored 100% on 5 quizzes',
                    color: Colors.purple,
                  ),
                  _buildAchievementBadge(
                    theme,
                    icon: Icons.emoji_events,
                    title: 'First Certificate',
                    description: 'Earned your first certificate',
                    color: Colors.amber,
                    isLocked: false,
                  ),
                  _buildAchievementBadge(
                    theme,
                    icon: Icons.forum,
                    title: 'Community Helper',
                    description: 'Answered 10 questions',
                    color: Colors.green,
                    isLocked: true,
                  ),
                  _buildAchievementBadge(
                    theme,
                    icon: Icons.code,
                    title: 'Code Expert',
                    description: 'Completed all coding exercises',
                    color: Colors.deepOrange,
                    isLocked: true,
                  ),
                ],
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // Certificates section
        Text(
          'Certificates',
          style: AppTextStyles.heading3.copyWith(
            color: theme.colorScheme.onBackground,
          ),
        ),
        const SizedBox(height: 16),
        
        // Certificate cards
        _buildCertificateCard(
          theme,
          title: 'Machine Learning Fundamentals',
          issueDate: 'May 15, 2025',
          courseHours: 40,
        ),
        
        const SizedBox(height: 16),
        
        _buildCertificateCard(
          theme,
          title: 'AI Ethics and Governance',
          issueDate: 'April 3, 2025',
          courseHours: 25,
        ),
      ],
    );
  }
  
  Widget _buildSettingsTab(ThemeData theme) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'App Settings',
          style: AppTextStyles.heading3.copyWith(
            color: theme.colorScheme.onBackground,
          ),
        ),
        const SizedBox(height: 16),
        
        // Appearance section
        GlassmorphicCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Appearance',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 16),
              
              // Theme toggle
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Dark Mode',
                    style: AppTextStyles.bodyLarge.copyWith(
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const ThemeToggleButton(),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Font size
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Font Size',
                    style: AppTextStyles.bodyLarge.copyWith(
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  DropdownButton<String>(
                    value: 'Medium',
                    items: ['Small', 'Medium', 'Large'].map((size) {
                      return DropdownMenuItem<String>(
                        value: size,
                        child: Text(size),
                      );
                    }).toList(),
                    onChanged: (value) {},
                  ),
                ],
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 16),
        
        // Notifications section
        GlassmorphicCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Notifications',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 16),
              
              // Notification switches
              _buildSettingsSwitch(
                theme,
                title: 'Course Updates',
                subtitle: 'Get notified about new content',
                value: true,
                onChanged: (value) {},
              ),
              
              const Divider(),
              
              _buildSettingsSwitch(
                theme,
                title: 'Assignment Reminders',
                subtitle: 'Reminders for upcoming deadlines',
                value: true,
                onChanged: (value) {},
              ),
              
              const Divider(),
              
              _buildSettingsSwitch(
                theme,
                title: 'Community Activity',
                subtitle: 'Replies to your posts and comments',
                value: false,
                onChanged: (value) {},
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 16),
        
        // Account settings section
        GlassmorphicCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Account',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 16),
              
              // Account settings
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(
                  Icons.lock,
                  color: theme.colorScheme.primary,
                ),
                title: Text(
                  'Change Password',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
              
              const Divider(),
              
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(
                  Icons.language,
                  color: theme.colorScheme.primary,
                ),
                title: Text(
                  'Language',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'English',
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                    const Icon(Icons.chevron_right),
                  ],
                ),
                onTap: () {},
              ),
              
              const Divider(),
              
              // Logout button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    // Show confirmation dialog
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Logout'),
                        content: const Text('Are you sure you want to logout?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.of(context).pop(),
                            child: const Text('Cancel'),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              final authService = Provider.of<AuthService>(
                                context,
                                listen: false,
                              );
                              authService.signOut();
                              Navigator.of(context).pop();
                              // Navigate to login screen
                              // context.go('/auth/login');
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                            ),
                            child: const Text('Logout'),
                          ),
                        ],
                      ),
                    );
                  },
                  icon: const Icon(Icons.logout),
                  label: const Text('Logout'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red),
                  ),
                ),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // App version
        Center(
          child: Text(
            'MTXO Labs EdTech v1.0.0',
            style: AppTextStyles.bodySmall.copyWith(
              color: theme.colorScheme.onBackground.withOpacity(0.5),
            ),
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
  
  Widget _buildStatItem(
    BuildContext context, {
    required String label,
    required String value,
    required IconData icon,
  }) {
    final theme = Theme.of(context);
    
    return Column(
      children: [
        Icon(
          icon,
          color: theme.colorScheme.primary,
          size: 24,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: AppTextStyles.heading4.copyWith(
            color: theme.colorScheme.onSurface,
          ),
        ),
        Text(
          label,
          style: AppTextStyles.bodySmall.copyWith(
            color: theme.colorScheme.onSurface.withOpacity(0.7),
          ),
        ),
      ],
    );
  }
  
  Widget _buildVerticalDivider(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      height: 40,
      width: 1,
      color: theme.colorScheme.onSurface.withOpacity(0.2),
    );
  }
  
  Widget _buildInfoRow(
    ThemeData theme, {
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Container(
          height: 40,
          width: 40,
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: theme.colorScheme.primary,
          ),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: AppTextStyles.bodySmall.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
            Text(
              value,
              style: AppTextStyles.bodyMedium.copyWith(
                color: theme.colorScheme.onSurface,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildAchievementBadge(
    ThemeData theme, {
    required IconData icon,
    required String title,
    required String description,
    required Color color,
    bool isLocked = false,
  }) {
    return Container(
      width: 140,
      height: 180,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isLocked 
            ? theme.colorScheme.surface.withOpacity(0.5) 
            : theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isLocked ? Colors.grey.withOpacity(0.3) : color.withOpacity(0.3),
        ),
        boxShadow: isLocked ? [] : AppShadows.small,
      ),
      child: Stack(
        children: [
          // Locked overlay
          if (isLocked)
            Positioned.fill(
              child: Center(
                child: Icon(
                  Icons.lock,
                  size: 40,
                  color: Colors.grey.withOpacity(0.5),
                ),
              ),
            ),
          
          // Badge content (dimmed if locked)
          Opacity(
            opacity: isLocked ? 0.5 : 1.0,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  height: 60,
                  width: 60,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 32,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  title,
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: theme.colorScheme.onSurface,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildCertificateCard(
    ThemeData theme, {
    required String title,
    required String issueDate,
    required int courseHours,
  }) {
    return GlassmorphicCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.workspace_premium,
                color: Colors.amber,
                size: 28,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTextStyles.heading5.copyWith(
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                    Text(
                      'MTXO Labs EdTech',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          Row(
            children: [
              _buildCertificateDetail(
                theme,
                label: 'Issue Date',
                value: issueDate,
                icon: Icons.calendar_today,
              ),
              const SizedBox(width: 24),
              _buildCertificateDetail(
                theme,
                label: 'Duration',
                value: '$courseHours hours',
                icon: Icons.timer,
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          Row(
            children: [
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.download),
                label: const Text('Download'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: Colors.white,
                ),
              ),
              const SizedBox(width: 12),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.share),
                label: const Text('Share'),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildCertificateDetail(
    ThemeData theme, {
    required String label,
    required String value,
    required IconData icon,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: theme.colorScheme.primary,
        ),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: AppTextStyles.bodySmall.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
            Text(
              value,
              style: AppTextStyles.bodyMedium.copyWith(
                color: theme.colorScheme.onSurface,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildSettingsSwitch(
    ThemeData theme, {
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTextStyles.bodyLarge.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              Text(
                subtitle,
                style: AppTextStyles.bodySmall.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.7),
                ),
              ),
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: onChanged,
          activeColor: theme.colorScheme.primary,
        ),
      ],
    );
  }
  
  String _getInitials(String name) {
    final nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return '${nameParts[0][0]}${nameParts[1][0]}';
    } else if (name.isNotEmpty) {
      return name[0];
    } else {
      return '?';
    }
  }
  
  String _capitalizeFirstLetter(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;
  
  _SliverAppBarDelegate(this.tabBar);
  
  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: tabBar,
    );
  }
  
  @override
  double get maxExtent => tabBar.preferredSize.height;
  
  @override
  double get minExtent => tabBar.preferredSize.height;
  
  @override
  bool shouldRebuild(covariant _SliverAppBarDelegate oldDelegate) {
    return tabBar != oldDelegate.tabBar;
  }
}