import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      ...spacing[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'] && {
        paddingVertical: spacing[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'],
        paddingHorizontal: spacing[size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'],
      },
    };

    let variantStyle: ViewStyle = {};

    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: colors.primary,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: colors.secondary,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: colors.transparent,
          borderWidth: 2,
          borderColor: colors.primary,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: colors.transparent,
        };
        break;
    }

    if (disabled || loading) {
      variantStyle.opacity = 0.5;
    }

    return [baseStyle, variantStyle, style];
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle = {
      ...typography.body,
      fontWeight: '600',
    };

    let variantTextStyle: TextStyle = {};

    switch (variant) {
      case 'primary':
      case 'secondary':
        variantTextStyle = { color: colors.white };
        break;
      case 'outline':
      case 'ghost':
        variantTextStyle = { color: colors.primary };
        break;
    }

    return [baseStyle, variantTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
