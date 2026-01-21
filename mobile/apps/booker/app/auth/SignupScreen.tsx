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
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUsername,
} from '@vehic-aid/core';

export default function SignupScreen({ navigation }: any) {
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) newErrors.username = 'Username is required';
    else if (!validateUsername(formData.username))
      newErrors.username = 'Username must be 3-20 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.phone_number) newErrors.phone_number = 'Phone is required';
    else if (!validatePhoneNumber(formData.phone_number)) newErrors.phone_number = 'Invalid phone';

    if (!formData.password) newErrors.password = 'Password is required';
    else {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) newErrors.password = validation.errors[0];
    }

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role: 'CUSTOMER',
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
    } catch (err: any) {
      setErrors({
        submit: err.response?.data?.detail || 'Signup failed',
      });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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
            Create Account to Get Started
          </Text>
        </View>

        {/* Form Card */}
        <Card style={styles.card}>
          <Text style={[typography.h2, { marginBottom: spacing.lg }]}>Sign Up</Text>

          {/* Submit Error */}
          {errors.submit && (
            <View style={styles.errorContainer}>
              <Text style={[typography.bodySmall, { color: colors.error }]}>
                {errors.submit}
              </Text>
            </View>
          )}

          {/* Username */}
          <Input
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChangeText={(val) => updateField('username', val)}
            autoCapitalize="none"
            error={errors.username}
            editable={!isLoading}
            containerStyle={{ marginBottom: spacing.lg }}
          />

          {/* Email */}
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChangeText={(val) => updateField('email', val)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            editable={!isLoading}
            containerStyle={{ marginBottom: spacing.lg }}
          />

          {/* Phone */}
          <Input
            label="Phone Number"
            placeholder="+91 9876543210"
            value={formData.phone_number}
            onChangeText={(val) => updateField('phone_number', val)}
            keyboardType="phone-pad"
            error={errors.phone_number}
            editable={!isLoading}
            containerStyle={{ marginBottom: spacing.lg }}
          />

          {/* Password */}
          <Input
            label="Password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            value={formData.password}
            onChangeText={(val) => updateField('password', val)}
            secureTextEntry={!showPassword}
            error={errors.password}
            editable={!isLoading}
            containerStyle={{ marginBottom: spacing.md }}
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(val) => updateField('confirmPassword', val)}
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            editable={!isLoading}
            containerStyle={{ marginBottom: spacing.md }}
          />

          {/* Show Password Toggle */}
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ marginBottom: spacing.lg }}
          >
            <Text style={[typography.bodySmall, { color: colors.primary }]}>
              {showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <Button
            title={isLoading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignup}
            loading={isLoading}
            variant="primary"
            style={{ marginBottom: spacing.md }}
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[typography.body, { color: colors.gray[600] }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
