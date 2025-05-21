import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../theme/app_theme.dart';
import '../../utils/validation_utils.dart';
import '../../widgets/animated_gradient_background.dart';
import '../../widgets/form/enhanced_text_field.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  String? _errorMessage;
  bool _passwordStrength = false;
  
  // Password requirements tracking
  bool _hasMinLength = false;
  bool _hasUpperCase = false;
  bool _hasLowerCase = false;
  bool _hasDigit = false;
  bool _hasSpecialChar = false;
  bool _passwordsMatch = false;
  
  // Animation controller for form entry
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  
  @override
  void initState() {
    super.initState();
    
    // Initialize animation controller
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    
    // Start animation when screen loads
    _animationController.forward();
    
    // Add listeners to password field to check strength in real-time
    _passwordController.addListener(_checkPasswordStrength);
    _confirmPasswordController.addListener(_checkPasswordsMatch);
  }
  
  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _fullNameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _animationController.dispose();
    super.dispose();
  }
  
  // Check password strength in real-time
  void _checkPasswordStrength() {
    final password = _passwordController.text;
    
    setState(() {
      _hasMinLength = password.length >= 8;
      _hasUpperCase = password.contains(RegExp(r'[A-Z]'));
      _hasLowerCase = password.contains(RegExp(r'[a-z]'));
      _hasDigit = password.contains(RegExp(r'[0-9]'));
      _hasSpecialChar = password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
      
      // Overall password strength
      _passwordStrength = _hasMinLength && _hasUpperCase && _hasLowerCase && _hasDigit && _hasSpecialChar;
      
      // Check if passwords match when password changes
      if (_confirmPasswordController.text.isNotEmpty) {
        _passwordsMatch = _confirmPasswordController.text == password;
      }
    });
  }
  
  // Check if passwords match in real-time
  void _checkPasswordsMatch() {
    if (_passwordController.text.isNotEmpty && _confirmPasswordController.text.isNotEmpty) {
      setState(() {
        _passwordsMatch = _confirmPasswordController.text == _passwordController.text;
      });
    }
  }
  
  Future<void> _handleSignup() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _errorMessage = null;
      });
      
      final authService = Provider.of<AuthService>(context, listen: false);
      final success = await authService.signUp(
        _usernameController.text,
        _emailController.text,
        _passwordController.text,
        _fullNameController.text,
      );
      
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Account created successfully! Please sign in.',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
            backgroundColor: AppColors.success,
            duration: Duration(seconds: 3),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
        context.go('/auth/login');
      } else if (mounted) {
        setState(() {
          _errorMessage = 'Failed to create account. Username or email might already be in use.';
        });
        
        // Shake animation for error
        _animationController.reset();
        _animationController.forward();
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final theme = Theme.of(context);
    
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: FadeTransition(
                opacity: _fadeAnimation,
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Logo and App Name
                      Column(
                        children: [
                          Container(
                            height: 80,
                            width: 80,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                              boxShadow: [
                                BoxShadow(
                                  color: theme.colorScheme.primary.withOpacity(0.3),
                                  blurRadius: 20,
                                  spreadRadius: 2,
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.school_rounded,
                              size: 50,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Create Account',
                            style: AppTextStyles.heading2.copyWith(
                              color: Colors.white,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Join MTXO Labs community to start learning',
                            style: AppTextStyles.bodyLarge.copyWith(
                              color: Colors.white.withOpacity(0.9),
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 32),
                      
                      // Card with form
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: theme.cardColor.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 10,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Error message if signup fails
                            if (_errorMessage != null) ...[
                              AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.error.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: theme.colorScheme.error.withOpacity(0.3),
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.error_outline,
                                      color: theme.colorScheme.error,
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        _errorMessage!,
                                        style: TextStyle(
                                          color: theme.colorScheme.error,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 16),
                            ],
                            
                            // Username field
                            EnhancedTextField(
                              controller: _usernameController,
                              label: 'Username',
                              hint: 'Choose a unique username',
                              prefixIcon: Icons.person_outline,
                              textInputAction: TextInputAction.next,
                              validator: ValidationUtils.validateUsername,
                            ),
                            const SizedBox(height: 16),
                            
                            // Email field
                            EnhancedTextField(
                              controller: _emailController,
                              label: 'Email',
                              hint: 'Enter your email address',
                              prefixIcon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              textInputAction: TextInputAction.next,
                              validator: ValidationUtils.validateEmail,
                            ),
                            const SizedBox(height: 16),
                            
                            // Full Name field
                            EnhancedTextField(
                              controller: _fullNameController,
                              label: 'Full Name',
                              hint: 'Enter your full name',
                              prefixIcon: Icons.badge_outlined,
                              textInputAction: TextInputAction.next,
                              validator: ValidationUtils.validateName,
                            ),
                            const SizedBox(height: 16),
                            
                            // Password field
                            EnhancedTextField(
                              controller: _passwordController,
                              label: 'Password',
                              hint: 'Create a secure password',
                              prefixIcon: Icons.lock_outline,
                              obscureText: true,
                              textInputAction: TextInputAction.next,
                              validator: ValidationUtils.validatePassword,
                            ),
                            
                            // Password strength indicator
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              margin: EdgeInsets.only(
                                top: 8, 
                                bottom: _passwordController.text.isNotEmpty ? 8 : 0
                              ),
                              padding: EdgeInsets.all(
                                _passwordController.text.isNotEmpty ? 12 : 0
                              ),
                              decoration: BoxDecoration(
                                color: _passwordController.text.isNotEmpty
                                    ? (_passwordStrength
                                        ? AppColors.success.withOpacity(0.1)
                                        : theme.colorScheme.primary.withOpacity(0.05))
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(8),
                                border: _passwordController.text.isNotEmpty
                                    ? Border.all(
                                        color: _passwordStrength
                                            ? AppColors.success.withOpacity(0.3)
                                            : theme.colorScheme.primary.withOpacity(0.1),
                                      )
                                    : null,
                              ),
                              child: _passwordController.text.isNotEmpty
                                  ? Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Password requirements:',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: theme.colorScheme.onSurface.withOpacity(0.7),
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        _buildRequirementRow(
                                          _hasMinLength,
                                          'At least 8 characters',
                                        ),
                                        _buildRequirementRow(
                                          _hasUpperCase,
                                          'At least one uppercase letter',
                                        ),
                                        _buildRequirementRow(
                                          _hasLowerCase,
                                          'At least one lowercase letter',
                                        ),
                                        _buildRequirementRow(
                                          _hasDigit,
                                          'At least one number',
                                        ),
                                        _buildRequirementRow(
                                          _hasSpecialChar,
                                          'At least one special character',
                                        ),
                                      ],
                                    )
                                  : const SizedBox.shrink(),
                            ),
                            
                            const SizedBox(height: 16),
                            
                            // Confirm Password field
                            EnhancedTextField(
                              controller: _confirmPasswordController,
                              label: 'Confirm Password',
                              hint: 'Confirm your password',
                              prefixIcon: Icons.lock_outline,
                              obscureText: true,
                              textInputAction: TextInputAction.done,
                              validator: (value) => ValidationUtils.validatePasswordConfirmation(
                                value, 
                                _passwordController.text,
                              ),
                              onSubmitted: (_) => _handleSignup(),
                            ),
                            
                            // Password match indicator
                            if (_confirmPasswordController.text.isNotEmpty) ...[
                              AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.only(top: 8),
                                child: Row(
                                  children: [
                                    Icon(
                                      _passwordsMatch
                                          ? Icons.check_circle
                                          : Icons.error_outline,
                                      size: 16,
                                      color: _passwordsMatch
                                          ? AppColors.success
                                          : theme.colorScheme.error,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _passwordsMatch
                                          ? 'Passwords match'
                                          : 'Passwords do not match',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: _passwordsMatch
                                            ? AppColors.success
                                            : theme.colorScheme.error,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                            
                            const SizedBox(height: 24),
                            
                            // Signup button
                            SizedBox(
                              height: 50,
                              child: ElevatedButton(
                                onPressed: authService.isLoading ? null : _handleSignup,
                                style: ElevatedButton.styleFrom(
                                  elevation: 3,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                child: authService.isLoading
                                    ? const SizedBox(
                                        width: 24,
                                        height: 24,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2,
                                        ),
                                      )
                                    : const Text(
                                        'Create Account',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Sign in link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Already have an account?',
                            style: TextStyle(
                              color: Colors.white,
                            ),
                          ),
                          TextButton(
                            onPressed: () => context.push('/auth/login'),
                            child: Text(
                              'Sign In',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
  
  // Helper method to build password requirement row
  Widget _buildRequirementRow(bool isMet, String requirement) {
    final theme = Theme.of(context);
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(
            isMet ? Icons.check_circle_outline : Icons.circle_outlined,
            size: 14,
            color: isMet ? AppColors.success : theme.colorScheme.onSurface.withOpacity(0.4),
          ),
          const SizedBox(width: 8),
          Text(
            requirement,
            style: TextStyle(
              fontSize: 12,
              color: isMet 
                  ? AppColors.success 
                  : theme.colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
}