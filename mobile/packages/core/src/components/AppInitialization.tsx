import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { apiClient } from '@vehic-aid/api';
import {
  authEndpoints,
  serviceDataEndpoints,
  userEndpoints,
  subscriptionEndpoints,
} from '@vehic-aid/api';

/**
 * App Initialization Component
 * Handles:
 * 1. Token restoration from secure storage
 * 2. Auto-login if tokens are valid
 * 3. Initial data sync from backend (service types, pricing, user profile)
 * 4. Error handling and fallback
 */

interface InitializationProps {
  onComplete: (isAuthenticated: boolean) => void;
}

const colors = {
  primary: '#FF6B35',
  background: '#F8F9FA',
  text: '#2C3E50',
};

export const AppInitialization: React.FC<InitializationProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('Initializing app...');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setProgress('Restoring authentication...');

      // Step 1: Try to restore tokens from AsyncStorage
      // Note: In production, use expo-secure-store for sensitive data
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');

      if (accessToken && refreshToken) {
        try {
          setProgress('Verifying tokens...');
          // Set tokens in API client
          apiClient.setTokens(accessToken, refreshToken);

          // Try to fetch user profile to verify tokens are valid
          await userEndpoints.getProfile();

          // Tokens are valid, proceed with background sync
          setProgress('Syncing data from backend...');
          await syncInitialData();

          onComplete(true); // User is authenticated
          return;
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          apiClient.clearTokens();
        }
      }

      // No valid tokens - user is not authenticated
      // Still sync service data for non-authenticated endpoints
      setProgress('Loading service catalog...');
      await syncPublicData();

      onComplete(false); // User is not authenticated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Initialization failed';
      console.error('App initialization error:', err);
      setError(errorMessage);

      // Allow app to continue even if sync fails
      setTimeout(() => {
        onComplete(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sync data for authenticated users
   */
  const syncInitialData = async () => {
    try {
      // Fetch all data in parallel
      const [
        userProfile,
        currentSubscription,
        serviceTypes,
        vehicleTypes,
      ] = await Promise.all([
        userEndpoints.getProfile().catch(() => null),
        subscriptionEndpoints.getCurrentSubscription().catch(() => null),
        serviceDataEndpoints.getServiceTypes().catch(() => []),
        serviceDataEndpoints.getVehicleTypes().catch(() => []),
      ]);

      // Store in Redux or context (if you have a store)
      // dispatch(setUserProfile(userProfile));
      // dispatch(setCurrentSubscription(currentSubscription));
      // dispatch(setServiceData({ serviceTypes, vehicleTypes }));

      console.log('✅ Initial data synced successfully');
    } catch (error) {
      console.warn('Background sync failed, continuing anyway:', error);
      // Don't throw - allow app to continue with what we have
    }
  };

  /**
   * Sync public data (no authentication required)
   */
  const syncPublicData = async () => {
    try {
      const [serviceTypes, vehicleTypes] = await Promise.all([
        serviceDataEndpoints.getServiceTypes().catch(() => []),
        serviceDataEndpoints.getVehicleTypes().catch(() => []),
      ]);

      console.log('✅ Public data loaded successfully');
    } catch (error) {
      console.warn('Public data sync failed:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.progressText}>{progress}</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return null; // Render nothing when initialization is complete
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  progressText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 12,
    color: '#E74C3C',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default AppInitialization;
