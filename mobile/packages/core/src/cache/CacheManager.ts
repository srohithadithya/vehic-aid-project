import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour
const CACHE_PREFIX = '@vehic-aid-cache:';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiryTime: number;
}

export class CacheManager {
  /**
   * Set cache with automatic expiry
   */
  static async setCache(key: string, data: any, expiryTime: number = CACHE_EXPIRY_TIME): Promise<void> {
    try {
      const cacheEntry: CacheEntry = {
        data,
        timestamp: Date.now(),
        expiryTime,
      };
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify(cacheEntry)
      );
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  /**
   * Get cache if not expired
   */
  static async getCache(key: string): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!cached) return null;

      const cacheEntry: CacheEntry = JSON.parse(cached);
      const now = Date.now();

      // Check if cache has expired
      if (now - cacheEntry.timestamp > cacheEntry.expiryTime) {
        await this.removeCache(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  static async removeCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  }

  /**
   * Clear all expired cache entries
   */
  static async clearExpiredCache(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_PREFIX));

      const now = Date.now();
      const keysToRemove: string[] = [];

      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          try {
            const cacheEntry: CacheEntry = JSON.parse(cached);
            if (now - cacheEntry.timestamp > cacheEntry.expiryTime) {
              keysToRemove.push(key);
            }
          } catch (error) {
            keysToRemove.push(key);
          }
        }
      }

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }

  /**
   * Clear all cache
   */
  static async clearAllCache(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalEntries: number;
    totalSize: number;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_PREFIX));

      let totalSize = 0;
      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }

      return {
        totalEntries: cacheKeys.length,
        totalSize,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { totalEntries: 0, totalSize: 0 };
    }
  }
}

export default CacheManager;
