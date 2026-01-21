import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens } from '@vehic-aid/api';

const TOKENS_KEY = '@vehic_aid_tokens';
const USER_KEY = '@vehic_aid_user';
const LANGUAGE_KEY = '@vehic_aid_language';
const SETTINGS_KEY = '@vehic_aid_settings';

class StorageService {
  // Tokens
  async setTokens(tokens: AuthTokens): Promise<void> {
    await AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  }

  async getTokens(): Promise<AuthTokens | null> {
    const tokens = await AsyncStorage.getItem(TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem(TOKENS_KEY);
  }

  // User
  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  async clearUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  }

  // Language
  async setLanguage(language: string): Promise<void> {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  }

  async getLanguage(): Promise<string | null> {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  }

  // Settings
  async setSettings(settings: Record<string, any>): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  async getSettings(): Promise<Record<string, any> | null> {
    const settings = await AsyncStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : null;
  }

  async updateSettings(updates: Record<string, any>): Promise<void> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    await this.setSettings(updated);
  }

  // Generic methods
  async setItem(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async getItem(key: string): Promise<any | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}

export const storageService = new StorageService();
