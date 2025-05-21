import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../theme/app_theme.dart';
import '../widgets/glassmorphic_card.dart';
import '../widgets/animated_gradient_background.dart';

class ModuleQuizScreen extends StatefulWidget {
  final String moduleId;
  final String courseId;

  const ModuleQuizScreen({
    required this.moduleId,
    required this.courseId,
    super.key,
  });

  @override
  State<ModuleQuizScreen> createState() => _ModuleQuizScreenState();
}

class _ModuleQuizScreenState extends State<ModuleQuizScreen> {
  int _currentQuestionIndex = 0;
  List<int> _selectedAnswers = [];
  bool _isSubmitting = false;
  bool _quizCompleted = false;
  double _score = 0;
  
  // Sample quiz data - in a real app, this would come from an API
  final List<Map<String, dynamic>> _questions = [
    {
      'question': 'What is the primary goal of Machine Learning?',
      'options': [
        'To replace human intelligence completely',
        'To enable computers to learn from data and make predictions',
        'To create perfect algorithms that never fail',
        'To reduce the need for data collection'
      ],
      'correctAnswer': 1,
    },
    {
      'question': 'Which of the following is NOT a common type of machine learning?',
      'options': [
        'Supervised Learning',
        'Unsupervised Learning',
        'Reinforcement Learning',
        'Definitive Learning'
      ],
      'correctAnswer': 3,
    },
    {
      'question': 'What is a neural network?',
      'options': [
        'A complex algorithm inspired by the human brain',
        'A network of computers working together',
        'A visualization tool for data analysis',
        'A method for storing data efficiently'
      ],
      'correctAnswer': 0,
    },
    {
      'question': 'Which of these is an example of supervised learning?',
      'options': [
        'Clustering customer profiles',
        'Playing chess against an AI',
        'Predicting house prices based on historical data',
        'Finding patterns in unlabeled data'
      ],
      'correctAnswer': 2,
    },
    {
      'question': 'What is overfitting in machine learning?',
      'options': [
        'When a model performs too well on all datasets',
        'When a model is too complex for the available hardware',
        'When a model learns the training data too well and performs poorly on new data',
        'When the training process takes too long to complete'
      ],
      'correctAnswer': 2,
    }
  ];
  
  @override
  void initState() {
    super.initState();
    _selectedAnswers = List.filled(_questions.length, -1);
  }
  
  void _selectAnswer(int questionIndex, int answerIndex) {
    if (_quizCompleted) return;
    
    setState(() {
      _selectedAnswers[questionIndex] = answerIndex;
    });
  }
  
  bool _canProceedToNext() {
    return _selectedAnswers[_currentQuestionIndex] != -1;
  }
  
  void _goToNextQuestion() {
    if (_currentQuestionIndex < _questions.length - 1) {
      setState(() {
        _currentQuestionIndex++;
      });
    }
  }
  
  void _goToPreviousQuestion() {
    if (_currentQuestionIndex > 0) {
      setState(() {
        _currentQuestionIndex--;
      });
    }
  }
  
  Future<void> _submitQuiz() async {
    if (_quizCompleted) return;
    
    setState(() {
      _isSubmitting = true;
    });
    
    // Calculate score
    int correctAnswers = 0;
    for (int i = 0; i < _questions.length; i++) {
      if (_selectedAnswers[i] == _questions[i]['correctAnswer']) {
        correctAnswers++;
      }
    }
    
    final score = (correctAnswers / _questions.length) * 100;
    
    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));
    
    setState(() {
      _quizCompleted = true;
      _score = score;
      _isSubmitting = false;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Module Quiz'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      extendBodyBehindAppBar: true,
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: _quizCompleted
                ? _buildQuizResults(theme)
                : _buildQuiz(theme),
          ),
        ),
      ),
    );
  }
  
  Widget _buildQuiz(ThemeData theme) {
    final question = _questions[_currentQuestionIndex];
    final options = question['options'] as List<String>;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Progress indicator
        Row(
          children: [
            Text(
              'Question ${_currentQuestionIndex + 1} of ${_questions.length}',
              style: AppTextStyles.heading5.copyWith(
                color: theme.colorScheme.onBackground,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: LinearProgressIndicator(
                value: (_currentQuestionIndex + 1) / _questions.length,
                backgroundColor: theme.colorScheme.surface,
                color: theme.colorScheme.primary,
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 24),
        
        // Question
        GlassmorphicCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                question['question'],
                style: AppTextStyles.heading4.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 20),
              
              // Options
              ...List.generate(options.length, (index) {
                final isSelected = _selectedAnswers[_currentQuestionIndex] == index;
                
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: InkWell(
                    onTap: () => _selectAnswer(_currentQuestionIndex, index),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isSelected 
                            ? theme.colorScheme.primary.withOpacity(0.2) 
                            : theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected 
                              ? theme.colorScheme.primary 
                              : theme.colorScheme.onSurface.withOpacity(0.2),
                          width: 2,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isSelected 
                                  ? theme.colorScheme.primary 
                                  : theme.colorScheme.surface,
                              border: Border.all(
                                color: isSelected 
                                    ? theme.colorScheme.primary 
                                    : theme.colorScheme.onSurface.withOpacity(0.5),
                                width: 2,
                              ),
                            ),
                            child: isSelected 
                                ? const Icon(
                                    Icons.check,
                                    size: 16,
                                    color: Colors.white,
                                  ) 
                                : null,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              options[index],
                              style: TextStyle(
                                color: theme.colorScheme.onSurface,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
        
        const Spacer(),
        
        // Navigation buttons
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            if (_currentQuestionIndex > 0)
              OutlinedButton.icon(
                onPressed: _goToPreviousQuestion,
                icon: const Icon(Icons.arrow_back),
                label: const Text('Previous'),
              )
            else
              const SizedBox(),
              
            if (_currentQuestionIndex < _questions.length - 1)
              ElevatedButton.icon(
                onPressed: _canProceedToNext() ? _goToNextQuestion : null,
                icon: const Icon(Icons.arrow_forward),
                label: const Text('Next'),
              )
            else
              ElevatedButton.icon(
                onPressed: _isSubmitting || !_canProceedToNext() ? null : _submitQuiz,
                icon: _isSubmitting 
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      ) 
                    : const Icon(Icons.check_circle),
                label: const Text('Submit Quiz'),
              ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildQuizResults(ThemeData theme) {
    final isPassed = _score >= 70;
    
    return Center(
      child: GlassmorphicCard(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header and score
            Icon(
              isPassed ? Icons.celebration : Icons.school,
              size: 60,
              color: isPassed ? Colors.amber : theme.colorScheme.primary,
            ),
            const SizedBox(height: 16),
            Text(
              isPassed ? 'Congratulations!' : 'Quiz Completed',
              style: AppTextStyles.heading3.copyWith(
                color: theme.colorScheme.onSurface,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              isPassed 
                  ? 'You\'ve successfully passed the quiz.' 
                  : 'You didn\'t pass this time, but keep learning!',
              style: AppTextStyles.bodyMedium.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.8),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            
            // Score indicator
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 120,
                  height: 120,
                  child: CircularProgressIndicator(
                    value: _score / 100,
                    strokeWidth: 10,
                    backgroundColor: theme.colorScheme.surface,
                    color: _getScoreColor(theme),
                  ),
                ),
                Column(
                  children: [
                    Text(
                      '${_score.toInt()}%',
                      style: AppTextStyles.heading2.copyWith(
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                    Text(
                      'Score',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Review answers section
            Text(
              'Answer Summary',
              style: AppTextStyles.heading5.copyWith(
                color: theme.colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 16),
            
            ..._buildAnswerSummary(theme),
            
            const SizedBox(height: 24),
            
            // Action buttons
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                icon: const Icon(Icons.arrow_back),
                label: const Text('Back to Module'),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  setState(() {
                    _quizCompleted = false;
                    _currentQuestionIndex = 0;
                    _selectedAnswers = List.filled(_questions.length, -1);
                  });
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Retry Quiz'),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  List<Widget> _buildAnswerSummary(ThemeData theme) {
    return List.generate(
      _questions.length > 3 ? 3 : _questions.length, 
      (index) {
        final question = _questions[index];
        final selectedAnswer = _selectedAnswers[index];
        final correctAnswer = question['correctAnswer'] as int;
        final isCorrect = selectedAnswer == correctAnswer;
        
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(
            children: [
              Icon(
                isCorrect ? Icons.check_circle : Icons.cancel,
                color: isCorrect ? Colors.green : Colors.red,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  question['question'],
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: theme.colorScheme.onSurface,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
  
  Color _getScoreColor(ThemeData theme) {
    if (_score >= 80) {
      return Colors.green;
    } else if (_score >= 70) {
      return theme.colorScheme.primary;
    } else if (_score >= 50) {
      return Colors.orange;
    } else {
      return Colors.red;
    }
  }
}