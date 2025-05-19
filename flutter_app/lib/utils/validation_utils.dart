/// Utility class for form field validation
class ValidationUtils {
  /// Validates that a field is not empty
  static String? validateRequired(String? value, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return 'Please enter ${fieldName ?? 'this field'}';
    }
    return null;
  }
  
  /// Validates email format
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email address';
    }
    
    // Regular expression for email validation
    final emailRegExp = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!emailRegExp.hasMatch(value)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }
  
  /// Validates password strength
  static String? validatePassword(String? value, {bool requiresSpecialChar = true}) {
    if (value == null || value.isEmpty) {
      return 'Please enter a password';
    }
    
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    final hasUpperCase = value.contains(RegExp(r'[A-Z]'));
    final hasLowerCase = value.contains(RegExp(r'[a-z]'));
    final hasNumbers = value.contains(RegExp(r'[0-9]'));
    final hasSpecialChar = value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
    
    if (!hasUpperCase || !hasLowerCase) {
      return 'Password must contain both upper and lowercase letters';
    }
    
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    
    if (requiresSpecialChar && !hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    
    return null;
  }
  
  /// Validates password confirmation
  static String? validatePasswordConfirmation(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    
    if (value != password) {
      return 'Passwords do not match';
    }
    
    return null;
  }
  
  /// Validates username format
  static String? validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter a username';
    }
    
    if (value.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    
    // Check for valid characters (alphanumeric, dashes, and underscores only)
    final validCharactersRegExp = RegExp(r'^[a-zA-Z0-9_-]+$');
    if (!validCharactersRegExp.hasMatch(value)) {
      return 'Username can only contain letters, numbers, underscores, and dashes';
    }
    
    return null;
  }
  
  /// Validates name format
  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your name';
    }
    
    if (value.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    return null;
  }
  
  /// Validates phone number format
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your phone number';
    }
    
    // Simple regex for international phone numbers
    final phoneRegExp = RegExp(r'^\+?[0-9]{8,15}$');
    if (!phoneRegExp.hasMatch(value.replaceAll(RegExp(r'\s|-|\(|\)'), ''))) {
      return 'Please enter a valid phone number';
    }
    
    return null;
  }
  
  /// Validates URL format
  static String? validateUrl(String? value) {
    if (value == null || value.isEmpty) {
      return null; // URL can be optional
    }
    
    // Simple URL validation
    final urlRegExp = RegExp(
      r'^(http|https)://'
      r'([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?'
      r'(/[a-zA-Z0-9_\.-]*)*/?$',
    );
    
    if (!urlRegExp.hasMatch(value)) {
      return 'Please enter a valid URL';
    }
    
    return null;
  }
  
  /// Validates numeric values
  static String? validateNumeric(String? value, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return 'Please enter ${fieldName ?? 'this field'}';
    }
    
    if (double.tryParse(value) == null) {
      return '${fieldName ?? 'This field'} must be a number';
    }
    
    return null;
  }
  
  /// Validates maximum length
  static String? validateMaxLength(String? value, int maxLength, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return null; // Let other validators handle empty fields
    }
    
    if (value.length > maxLength) {
      return '${fieldName ?? 'This field'} must be no more than $maxLength characters';
    }
    
    return null;
  }
  
  /// Validates minimum length
  static String? validateMinLength(String? value, int minLength, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return null; // Let other validators handle empty fields
    }
    
    if (value.length < minLength) {
      return '${fieldName ?? 'This field'} must be at least $minLength characters';
    }
    
    return null;
  }
  
  /// Validates a date against minimum and maximum values
  static String? validateDateRange(DateTime? value, {DateTime? minDate, DateTime? maxDate}) {
    if (value == null) {
      return 'Please select a date';
    }
    
    if (minDate != null && value.isBefore(minDate)) {
      return 'Date cannot be before ${_formatDate(minDate)}';
    }
    
    if (maxDate != null && value.isAfter(maxDate)) {
      return 'Date cannot be after ${_formatDate(maxDate)}';
    }
    
    return null;
  }
  
  /// Format a date as a string (helper function)
  static String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
  
  /// Combine multiple validators into one
  static String? Function(String?) combineValidators(List<String? Function(String?)> validators) {
    return (String? value) {
      for (final validator in validators) {
        final error = validator(value);
        if (error != null) {
          return error;
        }
      }
      return null;
    };
  }
  
  /// Create a custom validator
  static String? Function(String?) custom(String? Function(String?) validator) {
    return validator;
  }
}