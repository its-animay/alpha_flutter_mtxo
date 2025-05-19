// Define models for the course structure
class Course {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final String thumbnail;
  final Instructor instructor;
  final String skillLevel;
  final List<String> tags;
  final double rating;
  final int reviewCount;
  final int studentsEnrolled;
  final double price;
  final String priceType;
  final String duration;
  final int totalLessons;
  final String totalDuration;
  final List<String>? whatYoullLearn;
  final List<String>? prerequisites;
  final List<CourseModule>? modules;
  final List<CourseReview>? reviews;
  final EnrollmentOptions? enrollmentOptions;

  Course({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.thumbnail,
    required this.instructor,
    required this.skillLevel,
    required this.tags,
    required this.rating,
    required this.reviewCount,
    required this.studentsEnrolled,
    required this.price,
    required this.priceType,
    required this.duration,
    required this.totalLessons,
    required this.totalDuration,
    this.whatYoullLearn,
    this.prerequisites,
    this.modules,
    this.reviews,
    this.enrollmentOptions,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'],
      title: json['title'],
      subtitle: json['subtitle'],
      description: json['description'],
      thumbnail: json['thumbnail'],
      instructor: Instructor.fromJson(json['instructor']),
      skillLevel: json['skillLevel'],
      tags: List<String>.from(json['tags'] ?? []),
      rating: (json['rating'] as num).toDouble(),
      reviewCount: json['reviewCount'],
      studentsEnrolled: json['studentsEnrolled'] ?? 0,
      price: (json['price'] as num).toDouble(),
      priceType: json['priceType'],
      duration: json['duration'],
      totalLessons: json['totalLessons'],
      totalDuration: json['totalDuration'],
      whatYoullLearn: json['whatYoullLearn'] != null
          ? List<String>.from(json['whatYoullLearn'])
          : null,
      prerequisites: json['prerequisites'] != null
          ? List<String>.from(json['prerequisites'])
          : null,
      modules: json['modules'] != null
          ? (json['modules'] as List)
              .map((module) => CourseModule.fromJson(module))
              .toList()
          : null,
      reviews: json['reviews'] != null
          ? (json['reviews'] as List)
              .map((review) => CourseReview.fromJson(review))
              .toList()
          : null,
      enrollmentOptions: json['enrollmentOptions'] != null
          ? EnrollmentOptions.fromJson(json['enrollmentOptions'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'description': description,
      'thumbnail': thumbnail,
      'instructor': instructor.toJson(),
      'skillLevel': skillLevel,
      'tags': tags,
      'rating': rating,
      'reviewCount': reviewCount,
      'studentsEnrolled': studentsEnrolled,
      'price': price,
      'priceType': priceType,
      'duration': duration,
      'totalLessons': totalLessons,
      'totalDuration': totalDuration,
      'whatYoullLearn': whatYoullLearn,
      'prerequisites': prerequisites,
      'modules': modules?.map((module) => module.toJson()).toList(),
      'reviews': reviews?.map((review) => review.toJson()).toList(),
      'enrollmentOptions': enrollmentOptions?.toJson(),
    };
  }
}

class Instructor {
  final String id;
  final String name;
  final String avatar;
  final String? title;
  final String? bio;
  final String? status;

  Instructor({
    required this.id,
    required this.name,
    required this.avatar,
    this.title,
    this.bio,
    this.status,
  });

  factory Instructor.fromJson(Map<String, dynamic> json) {
    return Instructor(
      id: json['id'],
      name: json['name'],
      avatar: json['avatar'],
      title: json['title'],
      bio: json['bio'],
      status: json['status'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'avatar': avatar,
      'title': title,
      'bio': bio,
      'status': status,
    };
  }
}

class CourseModule {
  final String id;
  final String title;
  final List<CourseLessonItem> lessons;
  final bool isFree;
  final String description;
  final String duration;

  CourseModule({
    required this.id,
    required this.title,
    required this.lessons,
    required this.isFree,
    required this.description,
    required this.duration,
  });

  factory CourseModule.fromJson(Map<String, dynamic> json) {
    return CourseModule(
      id: json['id'],
      title: json['title'],
      lessons: (json['lessons'] as List)
          .map((lesson) => CourseLessonItem.fromJson(lesson))
          .toList(),
      isFree: json['isFree'],
      description: json['description'],
      duration: json['duration'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'lessons': lessons.map((lesson) => lesson.toJson()).toList(),
      'isFree': isFree,
      'description': description,
      'duration': duration,
    };
  }
}

class CourseLessonItem {
  final String id;
  final String title;
  final String duration;
  final bool isFree;
  final bool? completed;
  final String? videoUrl;
  final String description;
  final List<CourseResource>? resources;

  CourseLessonItem({
    required this.id,
    required this.title,
    required this.duration,
    required this.isFree,
    required this.description,
    this.completed,
    this.videoUrl,
    this.resources,
  });

  factory CourseLessonItem.fromJson(Map<String, dynamic> json) {
    return CourseLessonItem(
      id: json['id'],
      title: json['title'],
      duration: json['duration'],
      isFree: json['isFree'],
      completed: json['completed'],
      videoUrl: json['videoUrl'],
      description: json['description'],
      resources: json['resources'] != null
          ? (json['resources'] as List)
              .map((resource) => CourseResource.fromJson(resource))
              .toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'duration': duration,
      'isFree': isFree,
      'completed': completed,
      'videoUrl': videoUrl,
      'description': description,
      'resources': resources?.map((resource) => resource.toJson()).toList(),
    };
  }
}

class CourseResource {
  final String id;
  final String title;
  final String type;
  final String url;

  CourseResource({
    required this.id,
    required this.title,
    required this.type,
    required this.url,
  });

  factory CourseResource.fromJson(Map<String, dynamic> json) {
    return CourseResource(
      id: json['id'],
      title: json['title'],
      type: json['type'],
      url: json['url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'type': type,
      'url': url,
    };
  }
}

class CourseReview {
  final String id;
  final String userName;
  final String? userAvatar;
  final double rating;
  final String comment;
  final String date;

  CourseReview({
    required this.id,
    required this.userName,
    this.userAvatar,
    required this.rating,
    required this.comment,
    required this.date,
  });

  factory CourseReview.fromJson(Map<String, dynamic> json) {
    return CourseReview(
      id: json['id'],
      userName: json['userName'],
      userAvatar: json['userAvatar'],
      rating: (json['rating'] as num).toDouble(),
      comment: json['comment'],
      date: json['date'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userName': userName,
      'userAvatar': userAvatar,
      'rating': rating,
      'comment': comment,
      'date': date,
    };
  }
}

class EnrollmentOptions {
  final bool freeTrial;
  final OneTimePrice oneTime;
  final SubscriptionPrice subscription;

  EnrollmentOptions({
    required this.freeTrial,
    required this.oneTime,
    required this.subscription,
  });

  factory EnrollmentOptions.fromJson(Map<String, dynamic> json) {
    return EnrollmentOptions(
      freeTrial: json['freeTrial'],
      oneTime: OneTimePrice.fromJson(json['oneTime']),
      subscription: SubscriptionPrice.fromJson(json['subscription']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'freeTrial': freeTrial,
      'oneTime': oneTime.toJson(),
      'subscription': subscription.toJson(),
    };
  }
}

class OneTimePrice {
  final double price;
  final double? discountedPrice;

  OneTimePrice({
    required this.price,
    this.discountedPrice,
  });

  factory OneTimePrice.fromJson(Map<String, dynamic> json) {
    return OneTimePrice(
      price: (json['price'] as num).toDouble(),
      discountedPrice: json['discountedPrice'] != null
          ? (json['discountedPrice'] as num).toDouble()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'price': price,
      'discountedPrice': discountedPrice,
    };
  }
}

class SubscriptionPrice {
  final double monthly;
  final double yearly;

  SubscriptionPrice({
    required this.monthly,
    required this.yearly,
  });

  factory SubscriptionPrice.fromJson(Map<String, dynamic> json) {
    return SubscriptionPrice(
      monthly: (json['monthly'] as num).toDouble(),
      yearly: (json['yearly'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'monthly': monthly,
      'yearly': yearly,
    };
  }
}