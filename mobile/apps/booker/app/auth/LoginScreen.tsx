import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@vehic-aid/auth';
import { Button, Input, Card, colors, typography, spacing } from '@vehic-aid/ui';
import { validateEmail } from '@vehic-aid/core';

export default function LoginScreen({ navigation }: any) {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[typography.h1, { color: colors.primary, marginBottom: spacing.md }]}>
            VehicAid
          </Text>
          <Text style={[typography.body, { color: colors.gray[600], textAlign: 'center' }]}>
            24/7 Vehicle Service at Your Doorstep
          </Text>
        </View>

        {/* Form Card */}
        <Card style={styles.card}>
          <Text style={[typography.h2, { marginBottom: spacing.lg }]}>Welcome Back</Text>

          {/* Error Message */}
          {(localError || error) && (
            <View style={styles.errorContainer}>
              <Text style={[typography.bodySmall, { color: colors.error }]}>
                {localError || error}
              </Text>
            </View>
          )}

          {/* Email Input */}
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            containerStyle={{ marginBottom: spacing.lg }}
          />

          {/* Password Input */}
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
            containerStyle={{ marginBottom: spacing.md }}
          />

          {/* Show Password Toggle */}
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ marginBottom: spacing.lg }}
          >
            <Text style={[typography.bodySmall, { color: colors.primary }]}>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            title={isLoading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            style={{ marginBottom: spacing.md }}
          />

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={[typography.body, { color: colors.gray[600] }]}>
              Don&apos;t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Demo Info */}
        <Text style={[typography.caption, { color: colors.gray[400], textAlign: 'center', marginTop: spacing.lg }]}>
          For testing, use any valid email and password
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  errorContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
