/// Course model representing a course in the application
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
  final CourseEnrollmentOptions enrollmentOptions;

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
    required this.enrollmentOptions,
  });

  /// Create a Course from JSON
  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'].toString(),
      title: json['title'],
      subtitle: json['subtitle'],
      description: json['description'],
      thumbnail: json['thumbnail'],
      instructor: Instructor.fromJson(json['instructor']),
      skillLevel: json['skillLevel'],
      tags: List<String>.from(json['tags']),
      rating: json['rating'].toDouble(),
      reviewCount: json['reviewCount'],
      studentsEnrolled: json['studentsEnrolled'],
      price: json['price'].toDouble(),
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
          ? List<CourseModule>.from(
              json['modules'].map((x) => CourseModule.fromJson(x)))
          : null,
      reviews: json['reviews'] != null
          ? List<CourseReview>.from(
              json['reviews'].map((x) => CourseReview.fromJson(x)))
          : null,
      enrollmentOptions: CourseEnrollmentOptions.fromJson(json['enrollmentOptions']),
    );
  }

  /// Convert Course to JSON
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
      'modules': modules?.map((x) => x.toJson()).toList(),
      'reviews': reviews?.map((x) => x.toJson()).toList(),
      'enrollmentOptions': enrollmentOptions.toJson(),
    };
  }

  @override
  String toString() {
    return 'Course(id: $id, title: $title, instructor: ${instructor.name})';
  }
}

/// Instructor model representing a course instructor
class Instructor {
  final String id;
  final String name;
  final String avatar;
  final String? title;
  final String? bio;

  Instructor({
    required this.id,
    required this.name,
    required this.avatar,
    this.title,
    this.bio,
  });

  /// Create an Instructor from JSON
  factory Instructor.fromJson(Map<String, dynamic> json) {
    return Instructor(
      id: json['id'].toString(),
      name: json['name'],
      avatar: json['avatar'],
      title: json['title'],
      bio: json['bio'],
    );
  }

  /// Convert Instructor to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'avatar': avatar,
      'title': title,
      'bio': bio,
    };
  }
}

/// Course module model representing a section of a course
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

  /// Create a CourseModule from JSON
  factory CourseModule.fromJson(Map<String, dynamic> json) {
    return CourseModule(
      id: json['id'].toString(),
      title: json['title'],
      lessons: List<CourseLessonItem>.from(
          json['lessons'].map((x) => CourseLessonItem.fromJson(x))),
      isFree: json['isFree'],
      description: json['description'],
      duration: json['duration'],
    );
  }

  /// Convert CourseModule to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'lessons': lessons.map((x) => x.toJson()).toList(),
      'isFree': isFree,
      'description': description,
      'duration': duration,
    };
  }
}

/// Course lesson model representing a single lesson in a course module
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
    this.completed,
    this.videoUrl,
    required this.description,
    this.resources,
  });

  /// Create a CourseLessonItem from JSON
  factory CourseLessonItem.fromJson(Map<String, dynamic> json) {
    return CourseLessonItem(
      id: json['id'].toString(),
      title: json['title'],
      duration: json['duration'],
      isFree: json['isFree'],
      completed: json['completed'],
      videoUrl: json['videoUrl'],
      description: json['description'],
      resources: json['resources'] != null
          ? List<CourseResource>.from(
              json['resources'].map((x) => CourseResource.fromJson(x)))
          : null,
    );
  }

  /// Convert CourseLessonItem to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'duration': duration,
      'isFree': isFree,
      'completed': completed,
      'videoUrl': videoUrl,
      'description': description,
      'resources': resources?.map((x) => x.toJson()).toList(),
    };
  }
}

/// Course resource model representing additional materials for a lesson
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

  /// Create a CourseResource from JSON
  factory CourseResource.fromJson(Map<String, dynamic> json) {
    return CourseResource(
      id: json['id'].toString(),
      title: json['title'],
      type: json['type'],
      url: json['url'],
    );
  }

  /// Convert CourseResource to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'type': type,
      'url': url,
    };
  }
}

/// Course review model representing a user review of a course
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

  /// Create a CourseReview from JSON
  factory CourseReview.fromJson(Map<String, dynamic> json) {
    return CourseReview(
      id: json['id'].toString(),
      userName: json['userName'],
      userAvatar: json['userAvatar'],
      rating: json['rating'].toDouble(),
      comment: json['comment'],
      date: json['date'],
    );
  }

  /// Convert CourseReview to JSON
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

/// Course enrollment options model
class CourseEnrollmentOptions {
  final bool freeTrial;
  final CourseOneTimeEnrollment oneTime;
  final CourseSubscriptionEnrollment subscription;

  CourseEnrollmentOptions({
    required this.freeTrial,
    required this.oneTime,
    required this.subscription,
  });

  /// Create a CourseEnrollmentOptions from JSON
  factory CourseEnrollmentOptions.fromJson(Map<String, dynamic> json) {
    return CourseEnrollmentOptions(
      freeTrial: json['freeTrial'],
      oneTime: CourseOneTimeEnrollment.fromJson(json['oneTime']),
      subscription: CourseSubscriptionEnrollment.fromJson(json['subscription']),
    );
  }

  /// Convert CourseEnrollmentOptions to JSON
  Map<String, dynamic> toJson() {
    return {
      'freeTrial': freeTrial,
      'oneTime': oneTime.toJson(),
      'subscription': subscription.toJson(),
    };
  }
}

/// One-time enrollment option for a course
class CourseOneTimeEnrollment {
  final double price;
  final double? discountedPrice;

  CourseOneTimeEnrollment({
    required this.price,
    this.discountedPrice,
  });

  /// Create a CourseOneTimeEnrollment from JSON
  factory CourseOneTimeEnrollment.fromJson(Map<String, dynamic> json) {
    return CourseOneTimeEnrollment(
      price: json['price'].toDouble(),
      discountedPrice: json['discountedPrice'] != null 
          ? json['discountedPrice'].toDouble() 
          : null,
    );
  }

  /// Convert CourseOneTimeEnrollment to JSON
  Map<String, dynamic> toJson() {
    return {
      'price': price,
      'discountedPrice': discountedPrice,
    };
  }
}

/// Subscription enrollment option for a course
class CourseSubscriptionEnrollment {
  final double monthly;
  final double yearly;

  CourseSubscriptionEnrollment({
    required this.monthly,
    required this.yearly,
  });

  /// Create a CourseSubscriptionEnrollment from JSON
  factory CourseSubscriptionEnrollment.fromJson(Map<String, dynamic> json) {
    return CourseSubscriptionEnrollment(
      monthly: json['monthly'].toDouble(),
      yearly: json['yearly'].toDouble(),
    );
  }

  /// Convert CourseSubscriptionEnrollment to JSON
  Map<String, dynamic> toJson() {
    return {
      'monthly': monthly,
      'yearly': yearly,
    };
  }
}