import 'package:flutter/material.dart';
import 'package:mtxo_labs_edtech/models/course.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';

/// A card widget that displays an enrolled course on the dashboard
class EnrollmentCard extends StatelessWidget {
  final String courseId;
  final String title;
  final String instructorName;
  final String thumbnailUrl;
  final int progress;
  final String lastAccessDate;
  final VoidCallback? onTap;

  const EnrollmentCard({
    required this.courseId,
    required this.title,
    required this.instructorName,
    required this.thumbnailUrl,
    required this.progress,
    required this.lastAccessDate,
    this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return GestureDetector(
      onTap: onTap ?? () => context.push('/course/$courseId'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(12),
          boxShadow: AppShadows.small,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Course thumbnail
              Stack(
                children: [
                  // Image
                  SizedBox(
                    height: 140,
                    width: double.infinity,
                    child: CachedNetworkImage(
                      imageUrl: thumbnailUrl,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: theme.colorScheme.primary.withOpacity(0.1),
                        child: Center(
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: theme.colorScheme.primary.withOpacity(0.1),
                        child: Center(
                          child: Icon(
                            Icons.image_not_supported_outlined,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                    ),
                  ),
                  
                  // Progress indicator overlay
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      height: 8,
                      width: double.infinity,
                      color: Colors.black.withOpacity(0.5),
                      child: Row(
                        children: [
                          // Filled portion
                          Container(
                            width: (progress / 100) * MediaQuery.of(context).size.width,
                            color: theme.colorScheme.primary,
                          ),
                          // Remaining portion is transparent
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              
              // Course info
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Course title
                    Text(
                      title,
                      style: AppTextStyles.heading5.copyWith(
                        color: theme.colorScheme.onSurface,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    
                    // Instructor name
                    Text(
                      "Instructor: $instructorName",
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                    
                    const SizedBox(height: 12),
                    
                    // Progress and last accessed info
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Progress text
                        Text(
                          "$progress% complete",
                          style: AppTextStyles.bodySmall.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        
                        // Last accessed date
                        Text(
                          "Last accessed: $lastAccessDate",
                          style: AppTextStyles.bodySmall.copyWith(
                            color: theme.colorScheme.onSurface.withOpacity(0.5),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Continue button
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: ElevatedButton.icon(
                  onPressed: onTap ?? () => context.push('/course/$courseId'),
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
      ),
    );
  }
}