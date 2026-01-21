import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '@vehic-aid/ui';
import { EnhancedButtonComponent } from '@vehic-aid/ui';

interface Provider {
  id: string;
  name: string;
  distance: number;
  eta: number;
  rating: number;
  reviews: number;
  avatar: string;
  vehicle: string;
  plate: string;
  lat: number;
  lng: number;
}

interface LocationUpdate {
  timestamp: Date;
  status: 'arrived' | 'en_route' | 'approaching' | 'working';
  message: string;
}

const LocationTrackingScreen: React.FC = () => {
  const provider: Provider = {
    id: '1',
    name: 'Raj Kumar',
    distance: 2.3,
    eta: 8,
    rating: 4.8,
    reviews: 342,
    avatar: '👨‍🔧',
    vehicle: 'Hyundai i20',
    plate: 'KA-01-AB-1234',
    lat: 12.9716,
    lng: 77.5946,
  };

  const [locationUpdates] = useState<LocationUpdate[]>([
    {
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: 'arrived',
      message: 'Service Provider Arrived',
    },
    {
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'approaching',
      message: 'Approaching Your Location',
    },
    {
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'en_route',
      message: 'Started towards your location',
    },
  ]);

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const markerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for live marker
    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
    ]);

    const pulseLoop = Animated.loop(pulseSequence);
    pulseLoop.start();

    // Marker entrance animation
    Animated.timing(markerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();

    return () => pulseLoop.stop();
  }, []);

  const renderMapPreview = () => (
    <View style={styles.mapContainer}>
      <LinearGradient
        colors={['#E0F2FE', '#F0F9FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mapPreview}
      >
        {/* Map background simulation */}
        <View style={styles.mapContent}>
          {/* User location marker */}
          <View style={styles.userMarkerContainer}>
            <Text style={styles.userMarkerEmoji}>📍</Text>
            <Text style={styles.markerLabel}>You</Text>
          </View>

          {/* Live animated marker */}
          <Animated.View
            style={[
              styles.providerMarkerContainer,
              {
                opacity: markerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    translateY: markerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 0],
                  }),
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.providerMarkerEmoji}>🚗</Text>
            <Text style={styles.markerLabel}>{provider.distance} km</Text>
          </Animated.View>

          {/* Distance line */}
          <View style={styles.distanceLine} />
        </View>

        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>📞</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderProviderCard = () => (
    <LinearGradient
      colors={[colors.white, colors.gray[50]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.providerCard, shadows.md]}
    >
      <View style={styles.providerHeader}>
        <View style={styles.providerAvatar}>
          <Text style={styles.avatarEmoji}>{provider.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingValue}>⭐ {provider.rating}</Text>
            <Text style={styles.reviewsCount}>({provider.reviews})</Text>
          </View>
        </View>
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>{provider.eta}m</Text>
          <Text style={styles.etaLabel}>ETA</Text>
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleLabel}>Vehicle Details</Text>
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleName}>{provider.vehicle}</Text>
          <View style={styles.plateBadge}>
            <Text style={styles.plateText}>{provider.plate}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderLocationUpdate = (update: LocationUpdate, index: number) => (
    <View key={index} style={styles.updateItem}>
      <View
        style={[
          styles.updateDot,
          {
            backgroundColor:
              update.status === 'arrived'
                ? colors.success
                : update.status === 'approaching'
                ? colors.warning
                : colors.primary,
          },
        ]}
      >
        <Text style={styles.updateDotIcon}>
          {update.status === 'arrived'
            ? '✓'
            : update.status === 'approaching'
            ? '→'
            : '•'}
        </Text>
      </View>
      {index < locationUpdates.length - 1 && <View style={styles.updateLine} />}
      <View style={styles.updateContent}>
        <Text style={styles.updateMessage}>{update.message}</Text>
        <Text style={styles.updateTime}>
          {formatUpdateTime(update.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Map Section */}
      {renderMapPreview()}

      {/* Provider Info */}
      <View style={styles.content}>
        {renderProviderCard()}

        {/* Location Updates */}
        <View style={styles.updatesSection}>
          <Text style={styles.updatesTitle}>Live Updates</Text>
          <View style={styles.updatesList}>
            {locationUpdates.map((update, index) =>
              renderLocationUpdate(update, index)
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <EnhancedButtonComponent
            title="Call Provider"
            onPress={() => {}}
            size="large"
            fullWidth
            variant="primary"
            style={{ marginBottom: spacing.md }}
          />
          <EnhancedButtonComponent
            title="Cancel Booking"
            onPress={() => {}}
            size="large"
            fullWidth
            variant="error"
          />
        </View>

        {/* Distance & Time Info */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, shadows.sm]}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{provider.distance} km</Text>
          </View>
          <View style={[styles.infoCard, shadows.sm]}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>{provider.eta} min</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const formatUpdateTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  mapContainer: {
    width: '100%',
    height: 400,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  mapPreview: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: spacing.lg,
    ...shadows.lg,
  },
  mapContent: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  userMarkerContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  userMarkerEmoji: {
    fontSize: 40,
  },
  markerLabel: {
    ...typography.bodySmall,
    color: colors.black,
    marginTop: spacing.xs,
  },
  providerMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerMarkerEmoji: {
    fontSize: 48,
    zIndex: 2,
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 1,
  },
  distanceLine: {
    position: 'absolute',
    width: 2,
    height: 80,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  mapControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  controlText: {
    fontSize: 20,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  providerCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  providerName: {
    ...typography.subtitle,
    color: colors.black,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  ratingValue: {
    ...typography.bodySmall,
    color: colors.warning,
    fontWeight: '600',
  },
  reviewsCount: {
    ...typography.bodySmall,
    color: colors.gray[500],
    marginLeft: spacing.xs,
  },
  etaBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  etaText: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: '700',
  },
  etaLabel: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  vehicleInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.lg,
  },
  vehicleLabel: {
    ...typography.caption,
    color: colors.gray[500],
    marginBottom: spacing.md,
  },
  vehicleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.black,
  },
  plateBadge: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  plateText: {
    ...typography.bodySmall,
    color: colors.black,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  updatesSection: {
    marginBottom: spacing.lg,
  },
  updatesTitle: {
    ...typography.h3,
    color: colors.black,
    marginBottom: spacing.md,
  },
  updatesList: {
    paddingLeft: spacing.lg,
  },
  updateItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  updateDot: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: spacing.sm,
  },
  updateDotIcon: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  updateLine: {
    position: 'absolute',
    left: 16,
    top: 32,
    width: 2,
    height: 40,
    backgroundColor: colors.gray[200],
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    ...typography.body,
    fontWeight: '600',
    color: colors.black,
  },
  updateTime: {
    ...typography.caption,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  actionButtons: {
    marginBottom: spacing.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  infoLabel: {
    ...typography.caption,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
  infoValue: {
    ...typography.h3,
    color: colors.primary,
  },
});

export default LocationTrackingScreen;
