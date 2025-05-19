import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:mtxo_labs_edtech/models/course.dart';
import 'package:mtxo_labs_edtech/services/auth_service.dart';
import 'package:mtxo_labs_edtech/services/course_service.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId;
  
  const CourseDetailScreen({
    required this.courseId,
    super.key,
  });

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  final CourseService _courseService = CourseService();
  
  Course? _course;
  bool _isLoading = true;
  bool _isEnrolled = false;
  List<String> _expandedModules = [];
  
  @override
  void initState() {
    super.initState();
    _loadCourseDetails();
  }
  
  Future<void> _loadCourseDetails() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      // Fetch course details
      final courseData = await _courseService.getCourseById(widget.courseId);
      
      if (courseData != null) {
        // Check if user is enrolled
        final enrollments = await _courseService.getUserEnrollments();
        final isEnrolled = enrollments.any(
          (enrollment) => enrollment['courseId'] == widget.courseId
        );
        
        setState(() {
          _course = courseData;
          _isEnrolled = isEnrolled;
          
          // Expand first module by default
          if (courseData.modules != null && courseData.modules!.isNotEmpty) {
            _expandedModules = [courseData.modules!.first.id];
          }
        });
      }
    } catch (e) {
      debugPrint('Error loading course details: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  void _toggleModuleExpansion(String moduleId) {
    setState(() {
      if (_expandedModules.contains(moduleId)) {
        _expandedModules.remove(moduleId);
      } else {
        _expandedModules.add(moduleId);
      }
    });
  }
  
  Future<void> _handleEnrollment(BuildContext context) async {
    final authService = Provider.of<AuthService>(context, listen: false);
    
    // Check if user is authenticated
    if (!authService.isAuthenticated) {
      _showSignInRequiredDialog(context);
      return;
    }
    
    if (_course == null) return;
    
    // If course is free, enroll directly
    if (_course!.priceType == 'Free') {
      _enrollInCourse(context);
    } else {
      // Navigate to checkout for paid courses
      context.push('/checkout/${widget.courseId}');
    }
  }
  
  Future<void> _enrollInCourse(BuildContext context) async {
    try {
      final success = await _courseService.enrollInCourse(widget.courseId);
      
      if (success) {
        setState(() {
          _isEnrolled = true;
        });
        
        if (!mounted) return;
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Successfully enrolled in course!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        if (!mounted) return;
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to enroll in course. Please try again.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      debugPrint('Error enrolling in course: $e');
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('An error occurred. Please try again.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
  
  void _showSignInRequiredDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign In Required'),
        content: const Text('You need to sign in to enroll in this course.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.go('/auth/login');
            },
            child: const Text('Sign In'),
          ),
        ],
      ),
    );
  }
  
  void _navigateToLesson(String moduleId, String lessonId) {
    if (_isEnrolled) {
      context.push('/course/${widget.courseId}/lesson/$lessonId?moduleId=$moduleId');
    } else {
      // Check if the lesson is free
      final module = _course?.modules?.firstWhere(
        (module) => module.id == moduleId,
        orElse: () => throw Exception('Module not found'),
      );
      
      final lesson = module?.lessons.firstWhere(
        (lesson) => lesson.id == lessonId,
        orElse: () => throw Exception('Lesson not found'),
      );
      
      if (module?.isFree == true || lesson?.isFree == true) {
        context.push('/course/${widget.courseId}/lesson/$lessonId?moduleId=$moduleId');
      } else {
        // Show enrollment dialog for paid lessons
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Enrollment Required'),
            content: const Text('You need to enroll in this course to access this lesson.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  _handleEnrollment(context);
                },
                child: const Text('Enroll Now'),
              ),
            ],
          ),
        );
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Course Details'),
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    if (_course == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Course Details'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: theme.colorScheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                'Course not found',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: 8),
              Text(
                'The course you are looking for does not exist or has been removed.',
                textAlign: TextAlign.center,
                style: AppTextStyles.bodyMedium,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.pop(),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }
    
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Sliver app bar with course image
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // Course image
                  CachedNetworkImage(
                    imageUrl: _course!.thumbnail,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      child: const Center(child: Icon(Icons.error)),
                    ),
                  ),
                  
                  // Gradient overlay for better text visibility
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                        ],
                        stops: const [0.6, 1.0],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Course content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Course title and subtitle
                  Text(
                    _course!.title,
                    style: AppTextStyles.heading2,
                  ),
                  if (_course!.subtitle.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      _course!.subtitle,
                      style: AppTextStyles.heading5.copyWith(
                        fontWeight: FontWeight.normal,
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ],
                  
                  const SizedBox(height: 16),
                  
                  // Course metadata (rating, students, etc.)
                  Row(
                    children: [
                      // Rating
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            color: Colors.amber,
                            size: 18,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _course!.rating.toStringAsFixed(1),
                            style: AppTextStyles.bodyMedium.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '(${_course!.reviewCount})',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: theme.colorScheme.onSurface.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(width: 16),
                      
                      // Students count
                      Row(
                        children: [
                          const Icon(
                            Icons.people,
                            size: 18,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${_course!.studentsEnrolled} students',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: theme.colorScheme.onSurface.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(width: 16),
                      
                      // Skill level
                      Row(
                        children: [
                          const Icon(
                            Icons.bar_chart,
                            size: 18,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _course!.skillLevel,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: theme.colorScheme.onSurface.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Course action button (Enroll or Continue Learning)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isEnrolled
                          ? () => _navigateToLesson(
                                _course!.modules!.first.id,
                                _course!.modules!.first.lessons.first.id,
                              )
                          : () => _handleEnrollment(context),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        _isEnrolled
                            ? 'Continue Learning'
                            : _course!.priceType == 'Free'
                                ? 'Enroll For Free'
                                : 'Enroll Now - \$${_course!.price.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Course description
                  Text(
                    'About This Course',
                    style: AppTextStyles.heading4,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _course!.description,
                    style: AppTextStyles.bodyMedium,
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // What you'll learn
                  if (_course!.whatYoullLearn?.isNotEmpty == true) ...[
                    Text(
                      'What You\'ll Learn',
                      style: AppTextStyles.heading4,
                    ),
                    const SizedBox(height: 8),
                    Column(
                      children: _course!.whatYoullLearn!.map((point) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(
                                Icons.check_circle,
                                color: theme.colorScheme.primary,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  point,
                                  style: AppTextStyles.bodyMedium,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                  ],
                  
                  // Prerequisites
                  if (_course!.prerequisites?.isNotEmpty == true) ...[
                    Text(
                      'Prerequisites',
                      style: AppTextStyles.heading4,
                    ),
                    const SizedBox(height: 8),
                    Column(
                      children: _course!.prerequisites!.map((point) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(
                                Icons.arrow_right,
                                color: theme.colorScheme.primary,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  point,
                                  style: AppTextStyles.bodyMedium,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                  ],
                  
                  // Instructor
                  Text(
                    'Instructor',
                    style: AppTextStyles.heading4,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      // Instructor avatar
                      ClipRRect(
                        borderRadius: BorderRadius.circular(30),
                        child: CachedNetworkImage(
                          imageUrl: _course!.instructor.avatar,
                          width: 60,
                          height: 60,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            child: const Center(
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            child: const Icon(Icons.person),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      
                      // Instructor info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _course!.instructor.name,
                              style: AppTextStyles.heading5,
                            ),
                            if (_course!.instructor.title != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                _course!.instructor.title!,
                                style: AppTextStyles.bodyMedium.copyWith(
                                  color: theme.colorScheme.onSurface.withOpacity(0.7),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  if (_course!.instructor.bio != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      _course!.instructor.bio!,
                      style: AppTextStyles.bodyMedium,
                    ),
                  ],
                  
                  const SizedBox(height: 24),
                  
                  // Course content/modules
                  Text(
                    'Course Content',
                    style: AppTextStyles.heading4,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${_course!.modules?.length ?? 0} modules • ${_course!.totalLessons} lessons • ${_course!.totalDuration} total',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Modules list
                  if (_course!.modules != null) ...[
                    ...List.generate(_course!.modules!.length, (index) {
                      final module = _course!.modules![index];
                      final isExpanded = _expandedModules.contains(module.id);
                      
                      return Column(
                        children: [
                          // Module header
                          Container(
                            decoration: BoxDecoration(
                              color: theme.cardColor,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: AppShadows.small,
                            ),
                            child: InkWell(
                              onTap: () => _toggleModuleExpansion(module.id),
                              borderRadius: BorderRadius.circular(8),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Row(
                                  children: [
                                    // Module info
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            module.title,
                                            style: AppTextStyles.heading5,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            '${module.lessons.length} lessons • ${module.duration}',
                                            style: AppTextStyles.bodySmall.copyWith(
                                              color: theme.colorScheme.onSurface.withOpacity(0.7),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    
                                    // Free badge
                                    if (module.isFree) ...[
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 8,
                                          vertical: 4,
                                        ),
                                        decoration: BoxDecoration(
                                          color: AppColors.success.withOpacity(0.2),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          'Free',
                                          style: TextStyle(
                                            color: AppColors.success,
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                    ],
                                    
                                    // Expand/collapse icon
                                    Icon(
                                      isExpanded
                                          ? Icons.keyboard_arrow_up
                                          : Icons.keyboard_arrow_down,
                                      color: theme.colorScheme.primary,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          
                          // Lessons list (if module is expanded)
                          if (isExpanded) ...[
                            const SizedBox(height: 1),
                            Container(
                              decoration: BoxDecoration(
                                color: theme.cardColor,
                                borderRadius: BorderRadius.only(
                                  bottomLeft: Radius.circular(8),
                                  bottomRight: Radius.circular(8),
                                ),
                                boxShadow: AppShadows.small,
                              ),
                              child: ListView.separated(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: module.lessons.length,
                                separatorBuilder: (context, index) => Divider(
                                  height: 1,
                                  color: theme.dividerColor,
                                ),
                                itemBuilder: (context, lessonIndex) {
                                  final lesson = module.lessons[lessonIndex];
                                  final isCompleted = lesson.completed ?? false;
                                  final isFree = module.isFree || lesson.isFree;
                                  
                                  return InkWell(
                                    onTap: () => _navigateToLesson(module.id, lesson.id),
                                    child: Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Row(
                                        children: [
                                          // Lesson indicator
                                          Container(
                                            width: 24,
                                            height: 24,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              color: isCompleted
                                                  ? theme.colorScheme.primary
                                                  : theme.colorScheme.onSurface.withOpacity(0.1),
                                            ),
                                            child: Center(
                                              child: isCompleted
                                                  ? const Icon(
                                                      Icons.check,
                                                      size: 16,
                                                      color: Colors.white,
                                                    )
                                                  : Text(
                                                      '${lessonIndex + 1}',
                                                      style: TextStyle(
                                                        color: theme.colorScheme.onSurface.withOpacity(0.8),
                                                        fontSize: 12,
                                                        fontWeight: FontWeight.bold,
                                                      ),
                                                    ),
                                            ),
                                          ),
                                          const SizedBox(width: 16),
                                          
                                          // Lesson info
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  lesson.title,
                                                  style: AppTextStyles.bodyLarge.copyWith(
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  lesson.duration,
                                                  style: AppTextStyles.bodySmall.copyWith(
                                                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          
                                          // Lesson status
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: isFree
                                                  ? AppColors.success.withOpacity(0.2)
                                                  : (_isEnrolled
                                                      ? theme.colorScheme.primary.withOpacity(0.2)
                                                      : theme.colorScheme.onSurface.withOpacity(0.1)),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: Text(
                                              isFree
                                                  ? 'Free'
                                                  : (_isEnrolled ? 'Preview' : 'Locked'),
                                              style: TextStyle(
                                                color: isFree
                                                    ? AppColors.success
                                                    : (_isEnrolled
                                                        ? theme.colorScheme.primary
                                                        : theme.colorScheme.onSurface.withOpacity(0.8)),
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                          
                          const SizedBox(height: 16),
                        ],
                      );
                    }),
                  ],
                  
                  // Reviews
                  if (_course!.reviews?.isNotEmpty == true) ...[
                    const SizedBox(height: 8),
                    Text(
                      'Student Reviews',
                      style: AppTextStyles.heading4,
                    ),
                    const SizedBox(height: 16),
                    
                    // Reviews list
                    ...List.generate(_course!.reviews!.length.clamp(0, 3), (index) {
                      final review = _course!.reviews![index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: theme.cardColor,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: AppShadows.small,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Reviewer info
                            Row(
                              children: [
                                // Avatar
                                CircleAvatar(
                                  radius: 20,
                                  backgroundImage: review.userAvatar != null
                                      ? CachedNetworkImageProvider(review.userAvatar!)
                                      : null,
                                  child: review.userAvatar == null
                                      ? Text(
                                          review.userName.substring(0, 1).toUpperCase(),
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                          ),
                                        )
                                      : null,
                                ),
                                const SizedBox(width: 12),
                                
                                // Name and date
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        review.userName,
                                        style: AppTextStyles.bodyLarge.copyWith(
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        review.date,
                                        style: AppTextStyles.bodySmall.copyWith(
                                          color: theme.colorScheme.onSurface.withOpacity(0.6),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                
                                // Rating
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.star,
                                      color: Colors.amber,
                                      size: 18,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      review.rating.toStringAsFixed(1),
                                      style: AppTextStyles.bodyMedium.copyWith(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 12),
                            
                            // Review comment
                            Text(
                              review.comment,
                              style: AppTextStyles.bodyMedium,
                            ),
                          ],
                        ),
                      );
                    }),
                    
                    // View more reviews button
                    if ((_course!.reviews?.length ?? 0) > 3)
                      Center(
                        child: TextButton.icon(
                          onPressed: () {
                            // Navigate to all reviews page
                          },
                          icon: const Icon(Icons.comment),
                          label: Text(
                            'View All ${_course!.reviews!.length} Reviews',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}