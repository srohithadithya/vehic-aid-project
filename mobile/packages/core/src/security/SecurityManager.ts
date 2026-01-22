import AsyncStorage from '@react-native-async-storage/async-storage';

const ENCRYPTION_KEY = 'vehic-aid-encryption-key-2026';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

// Secure store simulation using AsyncStorage + encryption
const SECURE_PREFIX = '@vehic-aid-secure:';

export class SecurityManager {
  /**
   * Securely store sensitive data
   */
  static async storeSecurely(key: string, value: string): Promise<void> {
    try {
      // In production, use expo-secure-store
      // For now, we encrypt and store in AsyncStorage
      const encrypted = await this.encryptData(value);
      await AsyncStorage.setItem(`${SECURE_PREFIX}${key}`, encrypted);
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  }

  /**
   * Retrieve securely stored data
   */
  static async getSecurely(key: string): Promise<string | null> {
    try {
      const encrypted = await AsyncStorage.getItem(`${SECURE_PREFIX}${key}`);
      if (!encrypted) return null;
      // In production, decrypt here
      return encrypted;
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  }

  /**
   * Remove securely stored data
   */
  static async removeSecurely(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${SECURE_PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  }

  /**
   * Encrypt sensitive string data
   */
  static async encryptData(data: string): Promise<string> {
    try {
      // Simple SHA256 hash simulation using string manipulation
      // In production, use expo-crypto for actual encryption
      const hash = btoa(data + ENCRYPTION_KEY).substring(0, 64);
      return hash;
    } catch (error) {
      console.error('Error encrypting data:', error);
      return data;
    }
  }

  /**
   * Generate secure hash for password
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      // Simple hash for demo purposes
      // In production, use proper hashing algorithms
      return btoa(password + ENCRYPTION_KEY).substring(0, 64);
    } catch (error) {
      console.error('Error hashing password:', error);
      return password;
    }
  }

  /**
   * Validate if JWT token is about to expire
   */
  static isTokenExpiringSoon(expirationTime: number): boolean {
    const currentTime = Date.now();
    return expirationTime - currentTime <= TOKEN_REFRESH_THRESHOLD;
  }

  /**
   * Store JWT tokens securely
   */
  static async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await this.storeSecurely('accessToken', accessToken);
      await this.storeSecurely('refreshToken', refreshToken);
      // Store expiration time
      const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await AsyncStorage.setItem('tokenExpiration', tokenExpiration.toString());
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  /**
   * Retrieve stored tokens
   */
  static async getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    try {
      const accessToken = await this.getSecurely('accessToken');
      const refreshToken = await this.getSecurely('refreshToken');
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  /**
   * Clear all sensitive data on logout
   */
  static async clearAllSecureData(): Promise<void> {
    try {
      await this.removeSecurely('accessToken');
      await this.removeSecurely('refreshToken');
      await AsyncStorage.removeItem('tokenExpiration');
      await AsyncStorage.removeItem('userProfile');
    } catch (error) {
      console.error('Error clearing secure data:', error);
    }
  }

  /**
   * Validate API response signature (optional, for extra security)
   */
  static async validateResponseSignature(data: string, signature: string): Promise<boolean> {
    try {
      const hash = await this.encryptData(data);
      return hash === signature;
    } catch (error) {
      console.error('Error validating signature:', error);
      return false;
    }
  }

  /**
   * Generate secure random token
   */
  static async generateSecureToken(): Promise<string> {
    try {
      // Generate random token using Math.random
      // In production, use expo-crypto for secure random bytes
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    } catch (error) {
      console.error('Error generating secure token:', error);
      return Math.random().toString(36).substr(2, 9);
    }
  }
}

export default SecurityManager;
