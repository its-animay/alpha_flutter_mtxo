import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/course_service.dart';
import '../models/course.dart';
import '../theme/app_theme.dart';
import '../widgets/glassmorphic_card.dart';
import '../widgets/animated_gradient_background.dart';

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  final CourseService _courseService = CourseService();
  final TextEditingController _searchController = TextEditingController();
  
  List<Course> _courses = [];
  List<Course> _filteredCourses = [];
  bool _isLoading = true;
  String _searchQuery = '';
  
  // Filter states
  String _selectedSkillLevel = 'All';
  final List<String> _selectedTags = [];
  String _selectedPriceType = 'All';
  String _selectedDuration = 'All';
  
  // Available filter options
  final List<String> _skillLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  final List<String> _tags = ['GenAI', 'Python', 'MLOps', 'RealWorld', 'Agents', 'LLMs', 'Computer Vision', 'NLP'];
  final List<String> _priceTypes = ['All', 'Free', 'Paid'];
  final List<String> _durations = ['All', 'Short', 'Medium', 'Long'];
  
  bool _isFilterDrawerOpen = false;
  
  @override
  void initState() {
    super.initState();
    _loadCourses();
    
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text;
        _applyFilters();
      });
    });
  }
  
  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
  
  Future<void> _loadCourses() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final courses = await _courseService.getCourses();
      
      setState(() {
        _courses = courses;
        _filteredCourses = List.from(courses);
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to load courses: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
  
  void _applyFilters() {
    List<Course> filtered = List.from(_courses);
    
    // Apply search query
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      filtered = filtered.where((course) {
        return course.title.toLowerCase().contains(query) ||
               course.subtitle.toLowerCase().contains(query) ||
               course.description.toLowerCase().contains(query) ||
               course.instructor.name.toLowerCase().contains(query);
      }).toList();
    }
    
    // Apply skill level filter
    if (_selectedSkillLevel != 'All') {
      filtered = filtered.where((course) => 
        course.skillLevel == _selectedSkillLevel).toList();
    }
    
    // Apply tags filter
    if (_selectedTags.isNotEmpty) {
      filtered = filtered.where((course) {
        for (final tag in _selectedTags) {
          if (course.tags.contains(tag)) {
            return true;
          }
        }
        return false;
      }).toList();
    }
    
    // Apply price type filter
    if (_selectedPriceType != 'All') {
      filtered = filtered.where((course) => 
        course.priceType == _selectedPriceType).toList();
    }
    
    // Apply duration filter
    if (_selectedDuration != 'All') {
      filtered = filtered.where((course) => 
        course.duration == _selectedDuration).toList();
    }
    
    setState(() {
      _filteredCourses = filtered;
    });
  }
  
  void _toggleFilterDrawer() {
    setState(() {
      _isFilterDrawerOpen = !_isFilterDrawerOpen;
    });
  }
  
  void _resetFilters() {
    setState(() {
      _selectedSkillLevel = 'All';
      _selectedTags.clear();
      _selectedPriceType = 'All';
      _selectedDuration = 'All';
      _searchController.clear();
      _searchQuery = '';
    });
    
    _applyFilters();
  }
  
  void _toggleTagFilter(String tag) {
    setState(() {
      if (_selectedTags.contains(tag)) {
        _selectedTags.remove(tag);
      } else {
        _selectedTags.add(tag);
      }
    });
    
    _applyFilters();
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: Stack(
            children: [
              // Main content
              Column(
                children: [
                  // Search and filter bar
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: _buildSearchBar(theme),
                  ),
                  
                  // Active filters chips
                  if (_hasActiveFilters())
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: _buildActiveFilters(theme),
                    ),
                  
                  // Course grid
                  Expanded(
                    child: _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : _filteredCourses.isEmpty
                            ? _buildEmptyState(theme)
                            : _buildCourseGrid(theme),
                  ),
                ],
              ),
              
              // Filter drawer
              AnimatedPositioned(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
                right: _isFilterDrawerOpen ? 0 : -300,
                top: 0,
                bottom: 0,
                width: 300,
                child: GestureDetector(
                  onTap: () {}, // Prevent tap through
                  child: _buildFilterDrawer(theme),
                ),
              ),
              
              // Overlay when filter drawer is open
              if (_isFilterDrawerOpen)
                Positioned.fill(
                  child: GestureDetector(
                    onTap: _toggleFilterDrawer,
                    child: Container(
                      color: Colors.black.withOpacity(0.5),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildSearchBar(ThemeData theme) {
    return GlassmorphicCard(
      padding: const EdgeInsets.all(8),
      child: Row(
        children: [
          // Search field
          Expanded(
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search courses, instructors...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: theme.colorScheme.surface,
                contentPadding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              ),
              style: TextStyle(
                color: theme.colorScheme.onSurface,
              ),
            ),
          ),
          
          const SizedBox(width: 8),
          
          // Filter button
          ElevatedButton.icon(
            onPressed: _toggleFilterDrawer,
            icon: const Icon(Icons.tune),
            label: const Text('Filter'),
            style: ElevatedButton.styleFrom(
              foregroundColor: _hasActiveFilters() 
                  ? Colors.white 
                  : theme.colorScheme.primary,
              backgroundColor: _hasActiveFilters() 
                  ? theme.colorScheme.primary 
                  : theme.colorScheme.primaryContainer.withOpacity(0.5),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildActiveFilters(ThemeData theme) {
    return SizedBox(
      height: 40,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          // Level filter
          if (_selectedSkillLevel != 'All')
            _buildFilterChip(
              theme,
              label: 'Level: $_selectedSkillLevel',
              onRemove: () {
                setState(() {
                  _selectedSkillLevel = 'All';
                });
                _applyFilters();
              },
            ),
          
          // Tags filters
          ..._selectedTags.map(
            (tag) => _buildFilterChip(
              theme,
              label: tag,
              onRemove: () => _toggleTagFilter(tag),
            ),
          ),
          
          // Price filter
          if (_selectedPriceType != 'All')
            _buildFilterChip(
              theme,
              label: 'Price: $_selectedPriceType',
              onRemove: () {
                setState(() {
                  _selectedPriceType = 'All';
                });
                _applyFilters();
              },
            ),
          
          // Duration filter
          if (_selectedDuration != 'All')
            _buildFilterChip(
              theme,
              label: 'Duration: $_selectedDuration',
              onRemove: () {
                setState(() {
                  _selectedDuration = 'All';
                });
                _applyFilters();
              },
            ),
          
          // Clear all filters
          if (_hasActiveFilters())
            Padding(
              padding: const EdgeInsets.only(left: 8),
              child: GestureDetector(
                onTap: _resetFilters,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: theme.colorScheme.error.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(
                        'Clear All',
                        style: TextStyle(
                          color: theme.colorScheme.error,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.close,
                        size: 16,
                        color: theme.colorScheme.error,
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
  
  Widget _buildFilterChip(
    ThemeData theme, {
    required String label,
    required VoidCallback onRemove,
  }) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: theme.colorScheme.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: theme.colorScheme.primary.withOpacity(0.3),
          ),
        ),
        child: Row(
          children: [
            Text(
              label,
              style: TextStyle(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
            const SizedBox(width: 4),
            GestureDetector(
              onTap: onRemove,
              child: Icon(
                Icons.close,
                size: 16,
                color: theme.colorScheme.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildCourseGrid(ThemeData theme) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.75,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: _filteredCourses.length,
      itemBuilder: (context, index) {
        final course = _filteredCourses[index];
        return _buildCourseCard(theme, course);
      },
    );
  }
  
  Widget _buildCourseCard(ThemeData theme, Course course) {
    return GestureDetector(
      onTap: () => context.push('/course/${course.id}'),
      child: GlassmorphicCard(
        padding: EdgeInsets.zero,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course thumbnail with overlay for tags
            Stack(
              children: [
                // Thumbnail
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(16),
                    topRight: Radius.circular(16),
                  ),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.network(
                      course.thumbnail,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          color: theme.colorScheme.primary.withOpacity(0.2),
                          child: Center(
                            child: Icon(
                              Icons.image,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
                
                // Price badge
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: course.priceType == 'Free'
                          ? Colors.green.withOpacity(0.8)
                          : theme.colorScheme.primary.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      course.priceType == 'Free'
                          ? 'Free'
                          : '\$${course.price.toStringAsFixed(0)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
                
                // Skill level badge
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      course.skillLevel,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            
            // Course info
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Course title
                  Text(
                    course.title,
                    style: AppTextStyles.bodyLarge.copyWith(
                      color: theme.colorScheme.onSurface,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  
                  // Instructor
                  Text(
                    course.instructor.name,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.7),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  
                  // Stats row (rating, lessons)
                  Row(
                    children: [
                      Icon(
                        Icons.star,
                        size: 16,
                        color: Colors.amber,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        course.rating.toString(),
                        style: AppTextStyles.bodySmall.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Icon(
                        Icons.menu_book_outlined,
                        size: 16,
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${course.totalLessons} lessons',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.7),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  
                  // Tags
                  if (course.tags.isNotEmpty)
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: course.tags.take(2).map((tag) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: _getTagColor(tag).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                              color: _getTagColor(tag).withOpacity(0.3),
                            ),
                          ),
                          child: Text(
                            tag,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: _getTagColor(tag),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildEmptyState(ThemeData theme) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: 80,
              color: theme.colorScheme.primary.withOpacity(0.5),
            ),
            const SizedBox(height: 24),
            Text(
              'No courses found',
              style: AppTextStyles.heading4.copyWith(
                color: theme.colorScheme.onBackground,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              'Try adjusting your filters or search query to find what you\'re looking for.',
              style: AppTextStyles.bodyMedium.copyWith(
                color: theme.colorScheme.onBackground.withOpacity(0.7),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _resetFilters,
              icon: const Icon(Icons.refresh),
              label: const Text('Reset Filters'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildFilterDrawer(ThemeData theme) {
    return Container(
      color: theme.scaffoldBackgroundColor,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filter Courses',
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onBackground,
                ),
              ),
              IconButton(
                onPressed: _toggleFilterDrawer,
                icon: const Icon(Icons.close),
                color: theme.colorScheme.onBackground,
              ),
            ],
          ),
          
          const Divider(),
          
          // Filters
          Expanded(
            child: ListView(
              children: [
                // Skill Level filter
                _buildFilterSection(
                  theme,
                  title: 'Skill Level',
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _skillLevels.map((level) {
                      final isSelected = _selectedSkillLevel == level;
                      
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedSkillLevel = level;
                          });
                          _applyFilters();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? theme.colorScheme.primary
                                : theme.colorScheme.surface,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? theme.colorScheme.primary
                                  : theme.colorScheme.onSurface.withOpacity(0.2),
                            ),
                          ),
                          child: Text(
                            level,
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : theme.colorScheme.onSurface,
                              fontWeight: isSelected 
                                  ? FontWeight.bold 
                                  : FontWeight.normal,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Tags filter
                _buildFilterSection(
                  theme,
                  title: 'Topics',
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _tags.map((tag) {
                      final isSelected = _selectedTags.contains(tag);
                      final tagColor = _getTagColor(tag);
                      
                      return GestureDetector(
                        onTap: () => _toggleTagFilter(tag),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? tagColor.withOpacity(0.2)
                                : theme.colorScheme.surface,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? tagColor
                                  : theme.colorScheme.onSurface.withOpacity(0.2),
                            ),
                          ),
                          child: Text(
                            tag,
                            style: TextStyle(
                              color: isSelected ? tagColor : theme.colorScheme.onSurface,
                              fontWeight: isSelected 
                                  ? FontWeight.bold 
                                  : FontWeight.normal,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Price Type filter
                _buildFilterSection(
                  theme,
                  title: 'Price',
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _priceTypes.map((price) {
                      final isSelected = _selectedPriceType == price;
                      
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedPriceType = price;
                          });
                          _applyFilters();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? (price == 'Free' 
                                    ? Colors.green 
                                    : theme.colorScheme.primary)
                                : theme.colorScheme.surface,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? (price == 'Free' 
                                      ? Colors.green 
                                      : theme.colorScheme.primary)
                                  : theme.colorScheme.onSurface.withOpacity(0.2),
                            ),
                          ),
                          child: Text(
                            price,
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : theme.colorScheme.onSurface,
                              fontWeight: isSelected 
                                  ? FontWeight.bold 
                                  : FontWeight.normal,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Duration filter
                _buildFilterSection(
                  theme,
                  title: 'Duration',
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _durations.map((duration) {
                      final isSelected = _selectedDuration == duration;
                      
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedDuration = duration;
                          });
                          _applyFilters();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? theme.colorScheme.secondary
                                : theme.colorScheme.surface,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? theme.colorScheme.secondary
                                  : theme.colorScheme.onSurface.withOpacity(0.2),
                            ),
                          ),
                          child: Text(
                            duration,
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : theme.colorScheme.onSurface,
                              fontWeight: isSelected 
                                  ? FontWeight.bold 
                                  : FontWeight.normal,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          
          const Divider(),
          
          // Action buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: _resetFilters,
                  child: const Text('Reset'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: () {
                    _applyFilters();
                    _toggleFilterDrawer();
                  },
                  child: Text('Apply (${_filteredCourses.length})'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildFilterSection(
    ThemeData theme, {
    required String title,
    required Widget child,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTextStyles.heading5.copyWith(
            color: theme.colorScheme.onBackground,
          ),
        ),
        const SizedBox(height: 12),
        child,
      ],
    );
  }
  
  bool _hasActiveFilters() {
    return _selectedSkillLevel != 'All' ||
           _selectedTags.isNotEmpty ||
           _selectedPriceType != 'All' ||
           _selectedDuration != 'All' ||
           _searchQuery.isNotEmpty;
  }
  
  Color _getTagColor(String tag) {
    switch (tag) {
      case 'GenAI':
        return Colors.purple;
      case 'Python':
        return Colors.blue;
      case 'MLOps':
        return Colors.green;
      case 'RealWorld':
        return Colors.orange;
      case 'Agents':
        return Colors.teal;
      case 'LLMs':
        return Colors.indigo;
      case 'Computer Vision':
        return Colors.red;
      case 'NLP':
        return Colors.amber.shade800;
      default:
        return Colors.grey;
    }
  }
}