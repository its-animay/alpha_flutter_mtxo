/// Configuration for API endpoints
class ApiConfig {
  /// Base URL for API requests
  /// In a real app, this would be different for different environments
  /// and would be set in the environment variables
  static const String baseUrl = 'https://api.mtxolabs.com/v1';
  
  /// Default timeout for API requests in seconds
  static const int timeout = 30;
  
  /// Whether to use mock data for API requests
  /// This is useful for development and testing
  static const bool useMockData = true;
  
  /// API version
  static const String apiVersion = 'v1';
}