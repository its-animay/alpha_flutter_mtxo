import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';

class CourseRecommendationCard extends StatelessWidget {
  final Course course;

  const CourseRecommendationCard({
    required this.course,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () => context.go('/course/${course.id}'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // "Recommended" badge
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.star,
                      size: 16,
                      color: theme.colorScheme.primary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Recommended',
                      style: TextStyle(
                        color: theme.colorScheme.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 12),
              
              // Course title
              Text(
                course.title,
                style: AppTextStyles.heading5,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              
              const SizedBox(height: 8),
              
              // Course description
              Text(
                course.description,
                style: TextStyle(
                  color: theme.colorScheme.onSurface.withOpacity(0.8),
                  fontSize: 14,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              
              const SizedBox(height: 16),
              
              // Course info row
              Row(
                children: [
                  // Skill level
                  _buildInfoChip(
                    context,
                    Icons.signal_cellular_alt,
                    course.skillLevel,
                  ),
                  
                  const SizedBox(width: 8),
                  
                  // Duration
                  _buildInfoChip(
                    context,
                    Icons.timer_outlined,
                    course.totalDuration,
                  ),
                  
                  const SizedBox(width: 8),
                  
                  // Rating
                  _buildInfoChip(
                    context,
                    Icons.star_outline,
                    '${course.rating}',
                    showIconInGold: true,
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Bottom row with price and explore button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Price
                  Text(
                    course.priceType == 'Free'
                        ? 'Free'
                        : '\$${course.price.toStringAsFixed(2)}',
                    style: TextStyle(
                      color: course.priceType == 'Free'
                          ? Colors.green
                          : theme.colorScheme.onSurface,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  
                  // Explore button
                  ElevatedButton(
                    onPressed: () {
                      context.go('/course/${course.id}');
                    },
                    child: const Text('Explore'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildInfoChip(
    BuildContext context,
    IconData icon,
    String label, {
    bool showIconInGold = false,
  }) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 8,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: theme.colorScheme.onSurface.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: showIconInGold
                ? const Color(0xFFFFD700)
                : theme.colorScheme.onSurface.withOpacity(0.7),
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
}