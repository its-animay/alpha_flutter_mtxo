import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:mtxo_labs_edtech/models/course.dart';
import 'package:mtxo_labs_edtech/services/auth_service.dart';
import 'package:mtxo_labs_edtech/services/course_service.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';
import 'package:mtxo_labs_edtech/widgets/markdown_renderer.dart';

class LessonScreen extends StatefulWidget {
  final String courseId;
  final String lessonId;
  final String? moduleId;
  
  const LessonScreen({
    required this.courseId,
    required this.lessonId,
    this.moduleId,
    super.key,
  });

  @override
  State<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends State<LessonScreen> {
  final CourseService _courseService = CourseService();
  
  Course? _course;
  CourseModule? _currentModule;
  CourseLessonItem? _currentLesson;
  bool _isLoading = true;
  bool _isEnrolled = false;
  bool _isComplete = false;
  int _lessonIndex = 0;
  int _moduleIndex = 0;
  
  // Lesson navigation state
  CourseLessonItem? _previousLesson;
  CourseModule? _previousModule;
  CourseLessonItem? _nextLesson;
  CourseModule? _nextModule;
  
  @override
  void initState() {
    super.initState();
    _loadLessonData();
  }
  
  Future<void> _loadLessonData() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      // Fetch course details
      final courseData = await _courseService.getCourseById(widget.courseId);
      
      if (courseData != null && courseData.modules != null) {
        // Find the current module and lesson
        CourseModule? currentModule;
        CourseLessonItem? currentLesson;
        int moduleIndex = 0;
        int lessonIndex = 0;
        
        // If moduleId is provided, use it to find the module
        if (widget.moduleId != null) {
          for (int i = 0; i < courseData.modules!.length; i++) {
            final module = courseData.modules![i];
            if (module.id == widget.moduleId) {
              currentModule = module;
              moduleIndex = i;
              
              // Find the lesson in this module
              for (int j = 0; j < module.lessons.length; j++) {
                final lesson = module.lessons[j];
                if (lesson.id == widget.lessonId) {
                  currentLesson = lesson;
                  lessonIndex = j;
                  break;
                }
              }
              break;
            }
          }
        } else {
          // If moduleId is not provided, search all modules for the lesson
          bool found = false;
          for (int i = 0; i < courseData.modules!.length && !found; i++) {
            final module = courseData.modules![i];
            for (int j = 0; j < module.lessons.length; j++) {
              final lesson = module.lessons[j];
              if (lesson.id == widget.lessonId) {
                currentModule = module;
                currentLesson = lesson;
                moduleIndex = i;
                lessonIndex = j;
                found = true;
                break;
              }
            }
          }
        }
        
        // Check if user is enrolled
        final enrollments = await _courseService.getUserEnrollments();
        final isEnrolled = enrollments.any(
          (enrollment) => enrollment['courseId'] == widget.courseId
        );
        
        // If the lesson was found, set up navigation for previous and next lessons
        if (currentLesson != null && currentModule != null) {
          _setupLessonNavigation(courseData, moduleIndex, lessonIndex);
        }
        
        setState(() {
          _course = courseData;
          _currentModule = currentModule;
          _currentLesson = currentLesson;
          _moduleIndex = moduleIndex;
          _lessonIndex = lessonIndex;
          _isEnrolled = isEnrolled;
          _isComplete = currentLesson?.completed ?? false;
        });
      }
    } catch (e) {
      debugPrint('Error loading lesson data: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  void _setupLessonNavigation(Course course, int moduleIndex, int lessonIndex) {
    final modules = course.modules ?? [];
    if (modules.isEmpty) return;
    
    final currentModule = modules[moduleIndex];
    
    // Previous lesson setup
    if (lessonIndex > 0) {
      // Previous lesson is in the same module
      _previousLesson = currentModule.lessons[lessonIndex - 1];
      _previousModule = currentModule;
    } else if (moduleIndex > 0) {
      // Previous lesson is the last lesson of the previous module
      _previousModule = modules[moduleIndex - 1];
      _previousLesson = _previousModule!.lessons.isNotEmpty 
          ? _previousModule!.lessons.last 
          : null;
    }
    
    // Next lesson setup
    if (lessonIndex < currentModule.lessons.length - 1) {
      // Next lesson is in the same module
      _nextLesson = currentModule.lessons[lessonIndex + 1];
      _nextModule = currentModule;
    } else if (moduleIndex < modules.length - 1) {
      // Next lesson is the first lesson of the next module
      _nextModule = modules[moduleIndex + 1];
      _nextLesson = _nextModule!.lessons.isNotEmpty 
          ? _nextModule!.lessons.first 
          : null;
    }
  }
  
  Future<void> _markLessonAsComplete() async {
    if (_currentLesson == null || !_isEnrolled) return;
    
    try {
      final success = await _courseService.markLessonAsComplete(
        widget.courseId,
        _currentModule?.id ?? '',
        _currentLesson!.id,
      );
      
      if (success) {
        setState(() {
          _isComplete = true;
        });
        
        if (!mounted) return;
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Progress saved!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      debugPrint('Error marking lesson as complete: $e');
    }
  }
  
  void _navigateToLesson(CourseModule module, CourseLessonItem lesson) {
    context.pushReplacement(
      '/course/${widget.courseId}/lesson/${lesson.id}?moduleId=${module.id}',
    );
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authService = Provider.of<AuthService>(context);
    
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Loading Lesson'),
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    if (_course == null || _currentModule == null || _currentLesson == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Lesson Not Found'),
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
                'Lesson not found',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: 8),
              Text(
                'The lesson you are looking for does not exist or has been removed.',
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
    
    // Check if this lesson is accessible to the user
    final isFreeCourse = _course!.priceType == 'Free';
    final isFreeModule = _currentModule!.isFree;
    final isFreeLesson = _currentLesson!.isFree;
    final canAccessLesson = _isEnrolled || isFreeCourse || isFreeModule || isFreeLesson;
    
    if (!canAccessLesson && authService.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Locked Lesson'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
          ),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.lock,
                  size: 64,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(height: 16),
                Text(
                  'Premium Content',
                  style: AppTextStyles.heading3,
                ),
                const SizedBox(height: 8),
                Text(
                  'This lesson is part of the premium content. Enroll in this course to access all lessons.',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMedium,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => context.go('/course/${widget.courseId}'),
                  child: const Text('Enroll Now'),
                ),
              ],
            ),
          ),
        ),
      );
    } else if (!canAccessLesson) {
      // If not enrolled and not authenticated
      return Scaffold(
        appBar: AppBar(
          title: const Text('Sign In Required'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
          ),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.lock,
                  size: 64,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(height: 16),
                Text(
                  'Sign In Required',
                  style: AppTextStyles.heading3,
                ),
                const SizedBox(height: 8),
                Text(
                  'You need to sign in to access this lesson.',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMedium,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => context.go('/auth/login'),
                  child: const Text('Sign In'),
                ),
              ],
            ),
          ),
        ),
      );
    }
    
    return Scaffold(
      appBar: AppBar(
        title: Text(_currentModule!.title),
        actions: [
          // Course navigation button
          IconButton(
            icon: const Icon(Icons.menu_book),
            onPressed: () => _showLessonsDrawer(context),
            tooltip: 'Course Navigation',
          ),
        ],
      ),
      body: Column(
        children: [
          // Lesson progress indicator
          LinearProgressIndicator(
            value: (_lessonIndex + 1) / _currentModule!.lessons.length,
            backgroundColor: theme.colorScheme.onSurface.withOpacity(0.1),
            valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
          ),
          
          // Lesson content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Lesson title
                  Text(
                    _currentLesson!.title,
                    style: AppTextStyles.heading2,
                  ),
                  const SizedBox(height: 8),
                  
                  // Lesson metadata
                  Row(
                    children: [
                      Icon(
                        Icons.timer,
                        size: 16,
                        color: theme.colorScheme.onSurface.withOpacity(0.6),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _currentLesson!.duration,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.6),
                        ),
                      ),
                      const SizedBox(width: 16),
                      
                      // Module name
                      Icon(
                        Icons.folder,
                        size: 16,
                        color: theme.colorScheme.onSurface.withOpacity(0.6),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          _currentModule!.title,
                          style: AppTextStyles.bodySmall.copyWith(
                            color: theme.colorScheme.onSurface.withOpacity(0.6),
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Lesson video (if available)
                  if (_currentLesson!.videoUrl?.isNotEmpty == true)
                    Container(
                      height: 200,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Icon(
                          Icons.play_circle_outline,
                          size: 64,
                          color: Colors.white.withOpacity(0.8),
                        ),
                      ),
                    ),
                  
                  const SizedBox(height: 24),
                  
                  // Lesson description/content
                  Text(
                    'Lesson Content',
                    style: AppTextStyles.heading4,
                  ),
                  const SizedBox(height: 8),
                  
                  // Use MarkdownRenderer widget to render lesson content
                  // This would need to be implemented separately
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: theme.cardColor,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: AppShadows.small,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _currentLesson!.description,
                          style: AppTextStyles.bodyLarge,
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Resources section
                  if (_currentLesson!.resources?.isNotEmpty == true) ...[
                    Text(
                      'Resources',
                      style: AppTextStyles.heading4,
                    ),
                    const SizedBox(height: 8),
                    
                    // Resources list
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _currentLesson!.resources!.length,
                      itemBuilder: (context, index) {
                        final resource = _currentLesson!.resources![index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: _getResourceIcon(resource.type),
                            title: Text(resource.title),
                            subtitle: Text(
                              'Click to download or view',
                              style: AppTextStyles.bodySmall.copyWith(
                                color: theme.colorScheme.onSurface.withOpacity(0.6),
                              ),
                            ),
                            trailing: const Icon(Icons.download),
                            onTap: () {
                              // Handle resource download or view
                            },
                          ),
                        );
                      },
                    ),
                  ],
                ],
              ),
            ),
          ),
          
          // Lesson navigation and completion
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.cardColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 5,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Previous lesson button
                if (_previousLesson != null)
                  ElevatedButton.icon(
                    onPressed: () => _navigateToLesson(
                      _previousModule!,
                      _previousLesson!,
                    ),
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Previous'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.secondary,
                    ),
                  )
                else
                  const SizedBox(width: 110), // Spacer when no previous lesson
                
                // Mark as complete button
                if (_isEnrolled && !_isComplete)
                  ElevatedButton.icon(
                    onPressed: _markLessonAsComplete,
                    icon: const Icon(Icons.check_circle_outline),
                    label: const Text('Mark Complete'),
                  )
                else if (_isComplete)
                  ElevatedButton.icon(
                    onPressed: null,
                    icon: const Icon(Icons.check_circle),
                    label: const Text('Completed'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      disabledBackgroundColor: AppColors.success.withOpacity(0.7),
                      disabledForegroundColor: Colors.white,
                    ),
                  ),
                
                // Next lesson button
                if (_nextLesson != null)
                  ElevatedButton.icon(
                    onPressed: () => _navigateToLesson(
                      _nextModule!,
                      _nextLesson!,
                    ),
                    icon: const Icon(Icons.arrow_forward),
                    label: const Text('Next'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                    ),
                  )
                else
                  const SizedBox(width: 110), // Spacer when no next lesson
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  void _showLessonsDrawer(BuildContext context) {
    final theme = Theme.of(context);
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true, // Makes the modal take up the full height
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(20),
        ),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.6, // Takes up 60% of the screen
          minChildSize: 0.3, // Can be dragged to 30% minimum
          maxChildSize: 0.9, // Can be expanded to 90% maximum
          expand: false,
          builder: (context, scrollController) {
            return Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Course Content',
                            style: AppTextStyles.heading4,
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                      Text(
                        _course!.title,
                        style: AppTextStyles.bodyLarge.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.7),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const Divider(),
                
                // Course modules and lessons
                Expanded(
                  child: ListView.builder(
                    controller: scrollController,
                    itemCount: _course!.modules?.length ?? 0,
                    itemBuilder: (context, index) {
                      final module = _course!.modules![index];
                      final isCurrentModule = module.id == _currentModule!.id;
                      
                      return ExpansionTile(
                        initiallyExpanded: isCurrentModule,
                        title: Text(
                          module.title,
                          style: AppTextStyles.bodyLarge.copyWith(
                            fontWeight: FontWeight.bold,
                            color: isCurrentModule 
                                ? theme.colorScheme.primary 
                                : theme.colorScheme.onSurface,
                          ),
                        ),
                        subtitle: Text(
                          '${module.lessons.length} lessons • ${module.duration}',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: theme.colorScheme.onSurface.withOpacity(0.6),
                          ),
                        ),
                        leading: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: isCurrentModule 
                                ? theme.colorScheme.primary 
                                : theme.colorScheme.onSurface.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              '${index + 1}',
                              style: TextStyle(
                                color: isCurrentModule 
                                    ? Colors.white 
                                    : theme.colorScheme.onSurface,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                        children: module.lessons.asMap().entries.map((entry) {
                          final lessonIndex = entry.key;
                          final lesson = entry.value;
                          final isCurrentLesson = lesson.id == _currentLesson!.id && isCurrentModule;
                          final isCompleted = lesson.completed ?? false;
                          
                          return ListTile(
                            title: Text(
                              lesson.title,
                              style: TextStyle(
                                fontWeight: isCurrentLesson ? FontWeight.bold : FontWeight.normal,
                                color: isCurrentLesson 
                                    ? theme.colorScheme.primary 
                                    : theme.colorScheme.onSurface,
                              ),
                            ),
                            subtitle: Text(
                              lesson.duration,
                              style: AppTextStyles.bodySmall.copyWith(
                                color: theme.colorScheme.onSurface.withOpacity(0.6),
                              ),
                            ),
                            leading: Container(
                              width: 24,
                              height: 24,
                              margin: const EdgeInsets.only(left: 16),
                              decoration: BoxDecoration(
                                color: isCompleted 
                                    ? AppColors.success 
                                    : (isCurrentLesson 
                                        ? theme.colorScheme.primary 
                                        : theme.colorScheme.onSurface.withOpacity(0.1)),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: isCompleted 
                                    ? const Icon(
                                        Icons.check,
                                        color: Colors.white,
                                        size: 16,
                                      )
                                    : Text(
                                        '${lessonIndex + 1}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isCurrentLesson 
                                              ? Colors.white 
                                              : theme.colorScheme.onSurface,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                              ),
                            ),
                            trailing: isCurrentLesson 
                                ? const Icon(
                                    Icons.play_circle_filled,
                                    color: AppColors.primary,
                                  )
                                : null,
                            onTap: () {
                              Navigator.pop(context);
                              if (lesson.id != _currentLesson!.id) {
                                _navigateToLesson(module, lesson);
                              }
                            },
                          );
                        }).toList(),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }
  
  Widget _getResourceIcon(String resourceType) {
    switch (resourceType) {
      case 'pdf':
        return Icon(
          Icons.picture_as_pdf,
          color: Colors.red,
        );
      case 'code':
        return Icon(
          Icons.code,
          color: Colors.blue,
        );
      case 'link':
        return Icon(
          Icons.link,
          color: Colors.purple,
        );
      case 'video':
        return Icon(
          Icons.video_library,
          color: Colors.orange,
        );
      default:
        return Icon(
          Icons.insert_drive_file,
          color: Colors.grey,
        );
    }
  }
}