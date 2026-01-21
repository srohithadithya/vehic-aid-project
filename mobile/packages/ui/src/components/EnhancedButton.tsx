import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Text,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  gradient = true,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return [colors.secondary, colors.secondary];
      case 'success':
        return [colors.success, colors.success];
      case 'error':
        return [colors.error, colors.error];
      case 'outline':
        return [colors.white, colors.white];
      default:
        return [colors.primary, colors.primaryDark];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: spacing.sm, paddingHorizontal: spacing.md };
      case 'large':
        return { padding: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { padding: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return typography.body;
      case 'large':
        return typography.subtitle;
      default:
        return typography.body;
    }
  };

  const [colors1, colors2] = getVariantColors();
  const isOutline = variant === 'outline';

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && { width: '100%' },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          if (!disabled && !loading) onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {gradient && !isOutline ? (
          <LinearGradient
            colors={[colors1, colors2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, getSizeStyles(), style]}
          >
            <ButtonContent
              title={title}
              loading={loading}
              icon={icon}
              textSize={getTextSize()}
              disabled={disabled}
              color="white"
            />
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              getSizeStyles(),
              isOutline && styles.outlineButton,
              isOutline && { borderColor: colors.primary, borderWidth: 2 },
              style,
            ]}
            disabled={disabled || loading}
          >
            <ButtonContent
              title={title}
              loading={loading}
              icon={icon}
              textSize={getTextSize()}
              disabled={disabled}
              color={isOutline ? colors.primary : 'white'}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

interface ButtonContentProps {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
  textSize: any;
  disabled?: boolean;
  color: string;
}

const ButtonContent: React.FC<ButtonContentProps> = ({
  title,
  loading,
  icon,
  textSize,
  disabled,
  color,
}) => (
  <React.Fragment>
    {loading ? (
      <ActivityIndicator color={color} size="small" />
    ) : (
      <>
        {icon && icon}
        <Text
          style={[
            textSize,
            {
              color,
              opacity: disabled ? 0.5 : 1,
              marginLeft: icon ? spacing.sm : 0,
            },
          ]}
        >
          {title}
        </Text>
      </>
    )}
  </React.Fragment>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButton: {
    backgroundColor: colors.white,
  },
});

export default EnhancedButton;
