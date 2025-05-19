import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const { theme, isDark } = useTheme();
  
  // Define styles based on variant
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            borderWidth: 1,
          },
          text: {
            color: 'white',
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.secondary,
            borderColor: theme.secondary,
            borderWidth: 1,
          },
          text: {
            color: 'white',
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: theme.primary,
            borderWidth: 1,
          },
          text: {
            color: theme.primary,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: theme.primary,
          },
        };
      default:
        return {
          container: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            borderWidth: 1,
          },
          text: {
            color: 'white',
          },
        };
    }
  };
  
  // Define styles based on size
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
          },
          text: {
            fontSize: 14,
          },
        };
      case 'large':
        return {
          container: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
          },
          text: {
            fontSize: 18,
          },
        };
      case 'medium':
      default:
        return {
          container: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
          },
          text: {
            fontSize: 16,
          },
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  const buttonStyles = [
    styles.button,
    variantStyles.container,
    sizeStyles.container,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    disabled && { backgroundColor: theme.gray[300], borderColor: theme.gray[300] },
    style,
  ];
  
  const textStyles = [
    styles.text,
    variantStyles.text,
    sizeStyles.text,
    disabled && { color: theme.gray[500] },
    textStyle,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? theme.primary : 'white'} 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;