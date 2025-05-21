import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';

class EnrollmentCard extends StatelessWidget {
  final String courseId;
  final String title;
  final String instructorName;
  final String thumbnailUrl;
  final int progress;
  final String lastAccessDate;

  const EnrollmentCard({
    required this.courseId,
    required this.title,
    required this.instructorName,
    required this.thumbnailUrl,
    required this.progress,
    required this.lastAccessDate,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () => context.go('/course/$courseId'),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course thumbnail with progress indicator
            Stack(
              children: [
                // Thumbnail
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                  ),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.network(
                      thumbnailUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          color: theme.colorScheme.primary.withOpacity(0.2),
                          child: Center(
                            child: Icon(
                              Icons.image_not_supported_outlined,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
                
                // Progress indicator
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: LinearProgressIndicator(
                    value: progress / 100,
                    backgroundColor: Colors.black.withOpacity(0.2),
                    valueColor: AlwaysStoppedAnimation<Color>(
                      theme.colorScheme.primary,
                    ),
                    minHeight: 6,
                  ),
                ),
              ],
            ),
            
            // Course details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    title,
                    style: AppTextStyles.heading5,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  const SizedBox(height: 4),
                  
                  // Progress text
                  Text(
                    '$progress% complete',
                    style: TextStyle(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Bottom row with lessons count and continue button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Lessons count
                      Text(
                        'By: $instructorName',
                        style: TextStyle(
                          color: theme.colorScheme.onSurface.withOpacity(0.6),
                        ),
                      ),
                      
                      // Continue button
                      OutlinedButton(
                        onPressed: () {
                          // In a real app, continue from where user left off
                          context.go('/course/$courseId');
                        },
                        child: const Text('Continue'),
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
}