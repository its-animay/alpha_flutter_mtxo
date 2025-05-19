# MTXO Labs EdTech - Flutter App

A futuristic, next-generation learning platform built with Flutter.

## Features

- **Immersive User Interface**: Modern, animated UI with fluid transitions
- **Course Discovery**: Browse, filter, and search through available courses
- **Interactive Lessons**: Text-based course modules with rich markdown content
- **Progress Tracking**: Track your learning journey with visual progress indicators
- **User Authentication**: Secure login, signup, and password recovery
- **Profile Management**: Customize your profile and view achievements
- **Helpdesk Support**: Get help from support staff through the integrated chat system

## Architecture

The app follows a clean architecture approach with clear separation of concerns:

- **Models**: Data models representing entities like User, Course, and Message
- **Services**: Business logic and data management
- **Screens**: UI components for each major section of the app
- **Widgets**: Reusable UI components shared across multiple screens
- **Theme**: Consistent styling and theming throughout the app
- **Routes**: Application navigation and routing system

## Screens

1. **Authentication Screens**
   - Login
   - Sign up
   - Forgot password

2. **Main Screens**
   - Dashboard: Shows enrolled courses and recommendations
   - Courses: Browse all available courses with filtering
   - Course Detail: In-depth course information and enrollment options
   - Lesson: Text-based learning content with navigation
   - Profile: User information and achievements
   - Helpdesk: Support center for assistance

## Getting Started

1. **Prerequisites**
   - Flutter SDK (3.0.0 or higher)
   - Dart SDK (2.17.0 or higher)
   - Android Studio / VS Code with Flutter extensions

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/mtxo-labs/edtech-flutter.git
   
   # Navigate to the project directory
   cd edtech-flutter
   
   # Install dependencies
   flutter pub get
   
   # Run the app
   flutter run
   ```

## Development

The app uses several key Flutter packages:

- **Provider**: State management
- **Go Router**: Navigation and routing
- **Shared Preferences**: Local storage
- **HTTP**: API communication
- **Flutter Markdown**: Rendering markdown content
- **Cached Network Image**: Efficient image loading
- **URL Launcher**: Opening links in browsers

## Authentication

The app supports:

- Username/password authentication
- Password recovery via email
- Secure token storage

## Course System

Courses are structured as:

- **Course**: Top-level entity with metadata
- **Module**: Section of a course containing lessons
- **Lesson**: Individual learning unit with content
- **Resource**: Additional materials for lessons

## Offline Support

The app includes offline capabilities:

- Cached course data
- Offline progress tracking
- Synchronization when online

## Design System

The app follows a consistent design system with:

- Typography hierarchy
- Color system with light/dark themes
- Spacing and layout guidelines
- Custom animations and transitions
- Reusable components