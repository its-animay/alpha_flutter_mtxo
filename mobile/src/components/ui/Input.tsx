import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...rest
}) => {
  const { theme, isDark } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Determine secure text entry based on isPassword and visibility state
  const isSecureEntry = isPassword ? !isPasswordVisible : secureTextEntry;

  // Create custom password visibility toggle icon
  const passwordToggleIcon = isPassword ? (
    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
      <Feather
        name={isPasswordVisible ? 'eye-off' : 'eye'}
        size={20}
        color={theme.gray[500]}
      />
    </TouchableOpacity>
  ) : null;

  // Combine rightIcon with password toggle
  const rightElement = isPassword ? passwordToggleIcon : rightIcon;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }, labelStyle]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? theme.gray[800] : theme.gray[50],
            borderColor: error ? theme.danger : theme.border,
            borderWidth: 1,
          },
          error && styles.errorInput,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            leftIcon && styles.inputWithLeftIcon,
            rightElement && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={theme.gray[400]}
          secureTextEntry={isSecureEntry}
          autoCapitalize="none"
          {...rest}
        />
        {rightElement && <View style={styles.iconContainer}>{rightElement}</View>}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.danger }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorInput: {
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;