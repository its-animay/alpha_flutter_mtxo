import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../services/auth_service.dart';
import '../services/course_service.dart';
import '../theme/app_theme.dart';
import '../models/course.dart';
import '../widgets/dashboard/enrollment_card.dart';
import '../widgets/dashboard/course_recommendation_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final CourseService _courseService = CourseService();
  bool _isLoading = true;
  List<dynamic> _enrollments = [];
  List<Course> _recommendedCourses = [];
  
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Load enrollments and recommended courses
      final enrollments = await _courseService.getUserEnrollments();
      final recommendedCourses = await _courseService.getRecommendedCourses();

      setState(() {
        _enrollments = enrollments;
        _recommendedCourses = recommendedCourses;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading dashboard data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final theme = Theme.of(context);
    final user = authService.currentUser;

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: _loadData,
        color: theme.colorScheme.primary,
        child: _isLoading
            ? _buildLoadingState()
            : _buildDashboardContent(context, user?.fullName ?? 'Student'),
      ),
    );
  }

  Widget _buildLoadingState() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }

  Widget _buildDashboardContent(BuildContext context, String userName) {
    final theme = Theme.of(context);
    final firstName = userName.split(' ').first;
    
    // Format current date
    final now = DateTime.now();
    final dateFormatter = DateFormat('EEEE, MMMM d');
    final formattedDate = dateFormatter.format(now);

    return CustomScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      slivers: [
        // App Bar
        SliverAppBar(
          floating: true,
          pinned: false,
          expandedHeight: 120,
          backgroundColor: theme.scaffoldBackgroundColor,
          elevation: 0,
          flexibleSpace: FlexibleSpaceBar(
            titlePadding: const EdgeInsets.all(16),
            title: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome back, $firstName',
                  style: AppTextStyles.heading4.copyWith(
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  formattedDate,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.notifications_outlined),
              onPressed: () {
                // Show notifications
              },
              color: theme.colorScheme.onSurface,
            ),
            const SizedBox(width: 8),
          ],
        ),

        // Dashboard content
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // My Courses Section
                Text(
                  'My Courses',
                  style: AppTextStyles.heading3.copyWith(
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Enrolled courses
                if (_enrollments.isEmpty)
                  _buildEmptyEnrollmentState(context)
                else
                  // Display enrolled courses
                  ...List.generate(_enrollments.length, (index) {
                    final enrollment = _enrollments[index];
                    
                    // Format last access date
                    final lastAccess = DateTime.parse(enrollment['lastAccessDate']);
                    final lastAccessStr = DateFormat('MMM d, yyyy').format(lastAccess);
                    
                    return EnrollmentCard(
                      courseId: enrollment['courseId'],
                      title: enrollment['courseName'] ?? 'Course Title',
                      instructorName: enrollment['instructorName'] ?? 'Instructor',
                      thumbnailUrl: enrollment['thumbnail'] ?? 'https://placehold.co/600x400/1a202c/e2e8f0?text=Course',
                      progress: enrollment['progress'] ?? 0,
                      lastAccessDate: lastAccessStr,
                    );
                  }),
                
                const SizedBox(height: 24),
                
                // Recommended Courses Section
                if (_recommendedCourses.isNotEmpty) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Recommended For You',
                        style: AppTextStyles.heading3.copyWith(
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push('/courses'),
                        child: Text(
                          'View All',
                          style: TextStyle(
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Horizontal list of recommended courses
                  SizedBox(
                    height: 280,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _recommendedCourses.length,
                      itemBuilder: (context, index) {
                        final course = _recommendedCourses[index];
                        return CourseRecommendationCard(
                          courseId: course.id,
                          title: course.title,
                          subtitle: course.subtitle,
                          instructorName: course.instructor.name,
                          thumbnailUrl: course.thumbnail,
                          rating: course.rating,
                          reviewCount: course.reviewCount,
                          tags: course.tags,
                          price: course.price,
                          priceType: course.priceType,
                        );
                      },
                    ),
                  ),
                ],
                
                const SizedBox(height: 16),
                
                // Quick Access Section
                Text(
                  'Quick Access',
                  style: AppTextStyles.heading3.copyWith(
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Quick access buttons in a grid
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 3 / 2,
                  children: [
                    _buildQuickAccessCard(
                      context,
                      title: 'Browse Courses',
                      icon: Icons.menu_book,
                      color: theme.colorScheme.primary,
                      onTap: () => context.push('/courses'),
                    ),
                    _buildQuickAccessCard(
                      context,
                      title: 'My Profile',
                      icon: Icons.person,
                      color: theme.colorScheme.secondary,
                      onTap: () => context.push('/profile'),
                    ),
                    _buildQuickAccessCard(
                      context,
                      title: 'Get Help',
                      icon: Icons.chat_bubble,
                      color: theme.colorScheme.tertiary,
                      onTap: () => context.push('/helpdesk'),
                    ),
                    _buildQuickAccessCard(
                      context,
                      title: 'Certificates',
                      icon: Icons.card_membership,
                      color: Colors.teal,
                      onTap: () {
                        // Navigate to certificates page
                      },
                    ),
                  ],
                ),
                
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyEnrollmentState(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        children: [
          Icon(
            Icons.school_outlined,
            size: 60,
            color: theme.colorScheme.primary.withOpacity(0.7),
          ),
          const SizedBox(height: 16),
          Text(
            'You\'re not enrolled in any courses yet',
            style: AppTextStyles.heading5.copyWith(
              color: theme.colorScheme.onSurface,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Start your learning journey by enrolling in a course',
            style: AppTextStyles.bodyMedium.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => context.push('/courses'),
              child: const Text('Browse Courses'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAccessCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: AppShadows.small,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(isDark ? 0.2 : 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: color,
                size: 28,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: AppTextStyles.bodyLarge.copyWith(
                color: theme.colorScheme.onSurface,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}