import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const Button = ({
  title,
  onPress,
  icon,
  type = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  style,
}) => {
  // Determine button colors based on type
  const getButtonColors = () => {
    if (disabled) {
      return {
        backgroundColor: COLORS.textSecondary,
        textColor: COLORS.surface,
      };
    }
    
    switch (type) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
          textColor: COLORS.surface,
        };
      case 'income':
        return {
          backgroundColor: COLORS.income,
          textColor: COLORS.surface,
        };
      case 'expense':
        return {
          backgroundColor: COLORS.expense,
          textColor: COLORS.surface,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: COLORS.primary,
          borderColor: COLORS.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          textColor: COLORS.primary,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          textColor: COLORS.surface,
        };
    }
  };
  
  // Determine button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: SIZES.small,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          fontSize: SIZES.large,
          iconSize: 24,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          fontSize: SIZES.medium,
          iconSize: 20,
        };
    }
  };
  
  const buttonColors = getButtonColors();
  const buttonSize = getButtonSize();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColors.backgroundColor,
          borderColor: buttonColors.borderColor,
          borderWidth: buttonColors.borderWidth,
          paddingVertical: buttonSize.paddingVertical,
          paddingHorizontal: buttonSize.paddingHorizontal,
          width: fullWidth ? '100%' : 'auto',
        },
        type !== 'text' && SHADOWS.small,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={buttonSize.iconSize}
          color={buttonColors.textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.title,
          {
            color: buttonColors.textColor,
            fontSize: buttonSize.fontSize,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
  },
  title: {
    fontWeight: '500',
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
