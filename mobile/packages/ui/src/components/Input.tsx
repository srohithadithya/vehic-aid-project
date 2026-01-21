import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  placeholder,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[typography.bodySmall, { marginBottom: spacing.sm, color: colors.gray[700] }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          error && { borderColor: colors.error },
          props.editable === false && { backgroundColor: colors.gray[100] },
        ]}
      >
        {leftIcon}
        <TextInput
          style={[styles.input, typography.body]}
          placeholderTextColor={colors.gray[400]}
          {...props}
          placeholder={placeholder}
        />
        {rightIcon}
      </View>
      {error && (
        <Text style={[typography.caption, { marginTop: spacing.xs, color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.gray[900],
  },
});
