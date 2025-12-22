
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { apiClient } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  console.log('LoginScreen Rendering');

  // Safety Fallback
  const bg = theme?.colors?.background || '#000';
  const text = theme?.colors?.text || '#FFF';
  const surface = theme?.colors?.surface || '#333';
  const primary = theme?.colors?.primary || '#00FFFF';
  const textSecondary = theme?.colors?.textSecondary || '#AAA';
  const border = theme?.colors?.border || '#444';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/users/token/', {
        username,
        password
      });

      const { access, refresh } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      // Navigate to Main App
      navigation.replace('Main');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Upgrade: Logo Integration */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your command center</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: customer1"
              placeholderTextColor={theme.colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Register</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme?.colors?.background || '#0B0E14',
  },
  content: {
    flex: 1,
    padding: theme?.spacing?.xl || 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme?.spacing?.m || 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme?.colors?.text || '#FFF',
    marginBottom: theme?.spacing?.s || 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme?.colors?.textSecondary || '#AAA',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: theme?.spacing?.l || 24,
  },
  label: {
    color: theme?.colors?.textSecondary || '#AAA',
    marginBottom: theme?.spacing?.s || 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: theme?.colors?.surface || '#333',
    borderRadius: theme?.borderRadius?.m || 16,
    padding: theme?.spacing?.m || 16,
    color: theme?.colors?.text || '#FFF',
    borderWidth: 1,
    borderColor: theme?.colors?.border || '#444',
    fontSize: 16,
  },
  button: {
    backgroundColor: theme?.colors?.primary || '#00E5FF',
    borderRadius: theme?.borderRadius?.m || 16,
    padding: theme?.spacing?.m || 16,
    alignItems: 'center',
    marginTop: theme?.spacing?.m || 16,
    shadowColor: theme?.colors?.primary || '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#000', // Black text on Neon Cyan for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: theme?.spacing?.l || 24,
    alignItems: 'center',
  },
  linkText: {
    color: theme?.colors?.textSecondary || '#AAA',
  },
  linkHighlight: {
    color: theme?.colors?.primary || '#00E5FF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;