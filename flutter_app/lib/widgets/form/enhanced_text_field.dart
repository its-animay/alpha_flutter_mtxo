import 'package:flutter/material.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';

/// An enhanced text field with interactive validation feedback
class EnhancedTextField extends StatefulWidget {
  final TextEditingController controller;
  final String label;
  final String? hint;
  final IconData? prefixIcon;
  final bool obscureText;
  final TextInputType keyboardType;
  final TextInputAction textInputAction;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;
  final Function(String)? onSubmitted;
  final bool autofocus;
  final int? maxLines;
  final int? minLines;
  final bool readOnly;
  final FocusNode? focusNode;
  
  const EnhancedTextField({
    required this.controller,
    required this.label,
    this.hint,
    this.prefixIcon,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.textInputAction = TextInputAction.next,
    this.validator,
    this.onChanged,
    this.onSubmitted,
    this.autofocus = false,
    this.maxLines = 1,
    this.minLines,
    this.readOnly = false,
    this.focusNode,
    super.key,
  });

  @override
  State<EnhancedTextField> createState() => _EnhancedTextFieldState();
}

class _EnhancedTextFieldState extends State<EnhancedTextField> {
  bool _obscureText = false;
  bool _hasFocus = false;
  bool _hasError = false;
  String? _errorText;
  bool _isValid = false;
  
  final FocusNode _focusNode = FocusNode();
  
  @override
  void initState() {
    super.initState();
    _obscureText = widget.obscureText;
    
    final focusNode = widget.focusNode ?? _focusNode;
    
    focusNode.addListener(() {
      setState(() {
        _hasFocus = focusNode.hasFocus;
        
        // Validate on focus lost
        if (!_hasFocus && widget.validator != null) {
          _validate(widget.controller.text);
        }
      });
    });
    
    // Initial validation
    if (widget.controller.text.isNotEmpty && widget.validator != null) {
      _validate(widget.controller.text);
    }
  }
  
  void _validate(String value) {
    if (widget.validator != null) {
      final error = widget.validator!(value);
      setState(() {
        _hasError = error != null;
        _errorText = error;
        _isValid = error == null && value.isNotEmpty;
      });
    }
  }
  
  @override
  void dispose() {
    if (widget.focusNode == null) {
      _focusNode.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Field label
        if (widget.label.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              widget.label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: _hasFocus
                    ? theme.colorScheme.primary
                    : (_hasError
                        ? theme.colorScheme.error
                        : theme.colorScheme.onSurface.withOpacity(0.8)),
              ),
            ),
          ),
        ],
        
        // Text field
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: BoxDecoration(
            color: theme.inputDecorationTheme.fillColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: _hasFocus
                  ? theme.colorScheme.primary
                  : (_hasError
                      ? theme.colorScheme.error
                      : (_isValid 
                          ? AppColors.success
                          : theme.colorScheme.onSurface.withOpacity(0.1))),
              width: _hasFocus || _hasError || _isValid ? 2 : 1,
            ),
            boxShadow: _hasFocus
                ? [
                    BoxShadow(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      blurRadius: 8,
                      spreadRadius: 2,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: TextFormField(
            controller: widget.controller,
            focusNode: widget.focusNode ?? _focusNode,
            obscureText: _obscureText,
            keyboardType: widget.keyboardType,
            textInputAction: widget.textInputAction,
            maxLines: widget.obscureText ? 1 : widget.maxLines,
            minLines: widget.minLines,
            autofocus: widget.autofocus,
            readOnly: widget.readOnly,
            style: TextStyle(
              color: theme.colorScheme.onSurface,
              fontSize: 16,
            ),
            onChanged: (value) {
              if (widget.onChanged != null) {
                widget.onChanged!(value);
              }
              
              // Live validation
              if (widget.validator != null) {
                _validate(value);
              }
            },
            onFieldSubmitted: widget.onSubmitted,
            validator: widget.validator,
            decoration: InputDecoration(
              hintText: widget.hint,
              hintStyle: TextStyle(
                color: theme.colorScheme.onSurface.withOpacity(0.4),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 16,
              ),
              border: InputBorder.none,
              prefixIcon: widget.prefixIcon != null
                  ? Icon(
                      widget.prefixIcon,
                      color: _hasFocus
                          ? theme.colorScheme.primary
                          : (_hasError
                              ? theme.colorScheme.error
                              : theme.colorScheme.onSurface.withOpacity(0.5)),
                    )
                  : null,
              suffixIcon: widget.obscureText
                  ? IconButton(
                      icon: Icon(
                        _obscureText
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: theme.colorScheme.onSurface.withOpacity(0.5),
                      ),
                      onPressed: () {
                        setState(() {
                          _obscureText = !_obscureText;
                        });
                      },
                    )
                  : (_isValid
                      ? Icon(
                          Icons.check_circle,
                          color: AppColors.success,
                        )
                      : null),
            ),
          ),
        ),
        
        // Error message or helper text
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(
              opacity: animation,
              child: SizeTransition(
                sizeFactor: animation,
                child: child,
              ),
            );
          },
          child: _hasError && _errorText != null
              ? Padding(
                  padding: const EdgeInsets.only(left: 16, top: 8),
                  key: ValueKey(_errorText),
                  child: Row(
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 14,
                        color: theme.colorScheme.error,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _errorText!,
                          style: TextStyle(
                            color: theme.colorScheme.error,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : const SizedBox(
                  height: 8,
                  key: ValueKey('empty'),
                ),
        ),
      ],
    );
  }
}