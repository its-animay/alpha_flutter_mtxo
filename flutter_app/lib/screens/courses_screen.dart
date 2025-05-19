import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mtxo_labs_edtech/models/course.dart';
import 'package:mtxo_labs_edtech/services/course_service.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> with SingleTickerProviderStateMixin {
  final CourseService _courseService = CourseService();
  final TextEditingController _searchController = TextEditingController();
  
  List<Course> _allCourses = [];
  List<Course> _filteredCourses = [];
  bool _isLoading = true;
  bool _isSearching = false;
  
  // Filter states
  String _selectedSkillLevel = 'All';
  String _selectedPriceType = 'All';
  String _selectedDuration = 'All';
  List<String> _selectedTags = [];
  
  // Available filter options
  final List<String> _skillLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  final List<String> _priceTypes = ['All', 'Free', 'Paid'];
  final List<String> _durations = ['All', 'Short', 'Medium', 'Long'];
  final List<String> _availableTags = [
    'GenAI', 'Python', 'MLOps', 'RealWorld', 'Agents', 'LLMs', 'Computer Vision', 'NLP'
  ];
  
  late TabController _tabController;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadCourses();
  }
  
  @override
  void dispose() {
    _searchController.dispose();
    _tabController.dispose();
    super.dispose();
  }
  
  Future<void> _loadCourses() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final courses = await _courseService.getCourses();
      
      setState(() {
        _allCourses = courses;
        _filteredCourses = courses;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading courses: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  void _handleSearch(String query) {
    if (query.isEmpty) {
      setState(() {
        _isSearching = false;
        _filteredCourses = _allCourses;
      });
      return;
    }
    
    setState(() {
      _isSearching = true;
      _filteredCourses = _allCourses.where((course) {
        return course.title.toLowerCase().contains(query.toLowerCase()) ||
               course.description.toLowerCase().contains(query.toLowerCase()) ||
               course.instructor.name.toLowerCase().contains(query.toLowerCase());
      }).toList();
    });
  }
  
  void _applyFilters() {
    List<Course> filtered = _allCourses;
    
    // Apply skill level filter
    if (_selectedSkillLevel != 'All') {
      filtered = filtered.where((course) => course.skillLevel == _selectedSkillLevel).toList();
    }
    
    // Apply price type filter
    if (_selectedPriceType != 'All') {
      filtered = filtered.where((course) => course.priceType == _selectedPriceType).toList();
    }
    
    // Apply duration filter
    if (_selectedDuration != 'All') {
      filtered = filtered.where((course) => course.duration == _selectedDuration).toList();
    }
    
    // Apply tags filter
    if (_selectedTags.isNotEmpty) {
      filtered = filtered.where((course) {
        return _selectedTags.any((tag) => course.tags.contains(tag));
      }).toList();
    }
    
    setState(() {
      _filteredCourses = filtered;
    });
  }
  
  void _resetFilters() {
    setState(() {
      _selectedSkillLevel = 'All';
      _selectedPriceType = 'All';
      _selectedDuration = 'All';
      _selectedTags = [];
      _filteredCourses = _allCourses;
      _searchController.clear();
      _isSearching = false;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                controller: _searchController,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Search courses...',
                  hintStyle: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                  border: InputBorder.none,
                ),
                style: TextStyle(color: theme.colorScheme.onSurface),
                onChanged: _handleSearch,
              )
            : const Text('Explore Courses'),
        actions: [
          // Search button
          IconButton(
            icon: Icon(_isSearching ? Icons.close : Icons.search),
            onPressed: () {
              setState(() {
                _isSearching = !_isSearching;
                if (!_isSearching) {
                  _searchController.clear();
                  _filteredCourses = _allCourses;
                }
              });
            },
          ),
          // Filter button
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              _showFilterBottomSheet(context);
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Popular'),
            Tab(text: 'New'),
          ],
          indicatorColor: theme.colorScheme.primary,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.colorScheme.onSurface.withOpacity(0.7),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                // All Courses Tab
                _buildCoursesList(_filteredCourses),
                
                // Popular Courses Tab (would normally sort by popularity)
                _buildCoursesList(_filteredCourses
                    .where((course) => course.studentsEnrolled > 500)
                    .toList()
                    ..sort((a, b) => b.rating.compareTo(a.rating))),
                
                // New Courses Tab (would normally sort by date)
                _buildCoursesList(_filteredCourses.take(5).toList()),
              ],
            ),
    );
  }
  
  Widget _buildCoursesList(List<Course> courses) {
    if (courses.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: 64,
              color: Theme.of(context).colorScheme.primary.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'No courses found',
              style: AppTextStyles.heading4,
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your filters',
              style: AppTextStyles.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _resetFilters,
              child: const Text('Reset Filters'),
            ),
          ],
        ),
      );
    }
    
    return RefreshIndicator(
      onRefresh: _loadCourses,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: courses.length,
        itemBuilder: (context, index) {
          final course = courses[index];
          return _buildCourseCard(course);
        },
      ),
    );
  }
  
  Widget _buildCourseCard(Course course) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () => context.push('/course/${course.id}'),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course thumbnail
            Stack(
              children: [
                SizedBox(
                  height: 160,
                  width: double.infinity,
                  child: CachedNetworkImage(
                    imageUrl: course.thumbnail,
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
                ),
                
                // Price badge
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: course.priceType == 'Free'
                          ? AppColors.success
                          : theme.colorScheme.primary,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      course.priceType == 'Free'
                          ? 'Free'
                          : '\$${course.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                
                // Skill level badge
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      course.skillLevel,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            
            // Course content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    course.title,
                    style: AppTextStyles.heading5,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Instructor
                  Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: CachedNetworkImage(
                          imageUrl: course.instructor.avatar,
                          width: 30,
                          height: 30,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            child: const Icon(Icons.person, size: 16),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        course.instructor.name,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.7),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Course meta info
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                            course.rating.toStringAsFixed(1),
                            style: AppTextStyles.bodyMedium.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '(${course.reviewCount})',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: theme.colorScheme.onSurface.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                      
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
                            '${course.studentsEnrolled} students',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: theme.colorScheme.onSurface.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Tags
                  if (course.tags.isNotEmpty)
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: course.tags.map((tag) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: isDark 
                              ? theme.colorScheme.primary.withOpacity(0.2)
                              : theme.colorScheme.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            tag,
                            style: TextStyle(
                              color: theme.colorScheme.primary,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  
                  const SizedBox(height: 12),
                  
                  // Course info
                  Row(
                    children: [
                      _buildInfoChip(
                        Icons.timer_outlined,
                        course.totalDuration,
                      ),
                      const SizedBox(width: 12),
                      _buildInfoChip(
                        Icons.menu_book_outlined,
                        '${course.totalLessons} lessons',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildInfoChip(IconData icon, String label) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 8,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: theme.colorScheme.onSurface.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: theme.colorScheme.onSurface.withOpacity(0.7),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: theme.colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
  
  void _showFilterBottomSheet(BuildContext context) {
    final theme = Theme.of(context);
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(20),
        ),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return DraggableScrollableSheet(
              initialChildSize: 0.6,
              minChildSize: 0.4,
              maxChildSize: 0.9,
              expand: false,
              builder: (context, scrollController) {
                return Column(
                  children: [
                    // Header
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Filter Courses',
                            style: AppTextStyles.heading4,
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                    ),
                    const Divider(),
                    
                    // Filter options
                    Expanded(
                      child: ListView(
                        controller: scrollController,
                        padding: const EdgeInsets.all(16),
                        children: [
                          // Skill Level filter
                          Text(
                            'Skill Level',
                            style: AppTextStyles.heading6,
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _skillLevels.map((level) {
                              final isSelected = _selectedSkillLevel == level;
                              return ChoiceChip(
                                label: Text(level),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedSkillLevel = selected ? level : 'All';
                                  });
                                },
                                selectedColor: theme.colorScheme.primary,
                                labelStyle: TextStyle(
                                  color: isSelected 
                                    ? Colors.white 
                                    : theme.colorScheme.onSurface,
                                ),
                              );
                            }).toList(),
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Price Type filter
                          Text(
                            'Price',
                            style: AppTextStyles.heading6,
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _priceTypes.map((type) {
                              final isSelected = _selectedPriceType == type;
                              return ChoiceChip(
                                label: Text(type),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedPriceType = selected ? type : 'All';
                                  });
                                },
                                selectedColor: theme.colorScheme.primary,
                                labelStyle: TextStyle(
                                  color: isSelected 
                                    ? Colors.white 
                                    : theme.colorScheme.onSurface,
                                ),
                              );
                            }).toList(),
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Duration filter
                          Text(
                            'Duration',
                            style: AppTextStyles.heading6,
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _durations.map((duration) {
                              final isSelected = _selectedDuration == duration;
                              return ChoiceChip(
                                label: Text(duration),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedDuration = selected ? duration : 'All';
                                  });
                                },
                                selectedColor: theme.colorScheme.primary,
                                labelStyle: TextStyle(
                                  color: isSelected 
                                    ? Colors.white 
                                    : theme.colorScheme.onSurface,
                                ),
                              );
                            }).toList(),
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Tags filter
                          Text(
                            'Topics',
                            style: AppTextStyles.heading6,
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _availableTags.map((tag) {
                              final isSelected = _selectedTags.contains(tag);
                              return FilterChip(
                                label: Text(tag),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    if (selected) {
                                      _selectedTags.add(tag);
                                    } else {
                                      _selectedTags.remove(tag);
                                    }
                                  });
                                },
                                selectedColor: theme.colorScheme.primary,
                                labelStyle: TextStyle(
                                  color: isSelected 
                                    ? Colors.white 
                                    : theme.colorScheme.onSurface,
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                    
                    // Filter actions
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: theme.cardColor,
                        border: Border(
                          top: BorderSide(color: theme.dividerColor),
                        ),
                      ),
                      child: Row(
                        children: [
                          // Reset button
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                setState(() {
                                  _selectedSkillLevel = 'All';
                                  _selectedPriceType = 'All';
                                  _selectedDuration = 'All';
                                  _selectedTags = [];
                                });
                              },
                              child: const Text('Reset'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          
                          // Apply button
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () {
                                _applyFilters();
                                Navigator.pop(context);
                              },
                              child: const Text('Apply Filters'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            );
          },
        );
      },
    );
  }
}