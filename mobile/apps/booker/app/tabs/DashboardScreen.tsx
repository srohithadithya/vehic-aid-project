import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '@vehic-aid/auth';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';
import { Ionicons } from '@expo/vector-icons';

// All 7 Service Types reference
const SERVICE_TYPES: Record<string, { emoji: string; name: string; desc: string }> = {
  TOWING: { emoji: '🚗', name: 'Towing', desc: 'Basic towing service' },
  FLATBED_TOWING: { emoji: '🚚', name: 'Flatbed Towing', desc: 'For damaged vehicles' },
  MECHANIC: { emoji: '🔧', name: 'Mechanic', desc: 'On-site mechanical repair' },
  FUEL_DELIVERY: { emoji: '⛽', name: 'Fuel Delivery', desc: 'Emergency fuel delivery' },
  BATTERY_JUMP: { emoji: '🔋', name: 'Battery Jump', desc: 'Jumpstart service' },
  LOCKOUT: { emoji: '🔐', name: 'Lockout', desc: 'Vehicle lockout assistance' },
  FLAT_TIRE: { emoji: '🛞', name: 'Flat Tire', desc: 'Tire repair/replacement' },
};

interface DashboardStats {
  active_requests: number;
  total_services: number;
  subscription_plan: string;
  wallet_balance: number;
  next_service_date?: string;
  average_rating?: number;
}

interface RecentService {
  id: string;
  type: string;
  status: 'completed' | 'pending' | 'cancelled';
  cost: number;
  date: string;
}

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    active_requests: 0,
    total_services: 0,
    subscription_plan: 'FREE',
    wallet_balance: 0,
    next_service_date: undefined,
    average_rating: 0,
  });
  const [recentServices, setRecentServices] = useState<RecentService[]>([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data with all 7 service types
      setStats({
        active_requests: 1,
        total_services: 18,
        subscription_plan: 'BASIC',
        wallet_balance: 850,
        next_service_date: '2024-02-28',
        average_rating: 4.8,
      });

      setRecentServices([
        { id: '1', type: 'TOWING', status: 'completed', cost: 349, date: '2024-01-20' },
        { id: '2', type: 'FLATBED_TOWING', status: 'completed', cost: 579, date: '2024-01-18' },
        { id: '3', type: 'FUEL_DELIVERY', status: 'completed', cost: 149, date: '2024-01-15' },
        { id: '4', type: 'MECHANIC', status: 'pending', cost: 449, date: '2024-02-05' },
        { id: '5', type: 'BATTERY_JUMP', status: 'completed', cost: 299, date: '2024-01-10' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Card */}
      <Card style={styles.welcomeCard}>
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeText}>
            <Text style={[typography.h2, { marginBottom: spacing.sm }]}>
              Welcome, {user?.first_name || user?.username}! 👋
            </Text>
            <Text style={[typography.body, { color: colors.gray[600] }]}>
              24/7 Vehicle Service at Your Doorstep
            </Text>
          </View>
          {stats.average_rating !== undefined && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={[typography.caption, { marginLeft: spacing.xs }]}>
                {stats.average_rating}
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* KPI Stats - 2x2 Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="alert-circle" size={24} color={colors.error} />
            <Text style={[typography.caption, { color: colors.gray[600], marginTop: spacing.sm }]}>
              Active Requests
            </Text>
            <Text style={[typography.h2, { color: colors.error }]}>
              {stats.active_requests}
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={[typography.caption, { color: colors.gray[600], marginTop: spacing.sm }]}>
              Total Services
            </Text>
            <Text style={[typography.h2, { color: colors.success }]}>
              {stats.total_services}
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="wallet" size={24} color={colors.warning} />
            <Text style={[typography.caption, { color: colors.gray[600], marginTop: spacing.sm }]}>
              Wallet Balance
            </Text>
            <Text style={[typography.h2, { color: colors.warning }]}>
              ₹{stats.wallet_balance}
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="gift" size={24} color={colors.secondary} />
            <Text style={[typography.caption, { color: colors.gray[600], marginTop: spacing.sm }]}>
              Subscription
            </Text>
            <Text style={[typography.body, { color: colors.secondary, fontWeight: '600' }]}>
              {stats.subscription_plan}
            </Text>
          </View>
        </Card>
      </View>

      {/* Next Service Card */}
      {stats.next_service_date && (
        <Card style={styles.nextServiceCard}>
          <View style={styles.nextServiceContent}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={[typography.caption, { color: colors.gray[600] }]}>
                Next Service
              </Text>
              <Text style={[typography.body, { marginTop: spacing.xs, fontWeight: '600' }]}>
                {stats.next_service_date}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
          </View>
        </Card>
      )}

      {/* Recent Services */}
      {recentServices.length > 0 && (
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>
            Recent Services (All 7 Types Available)
          </Text>
          {recentServices.map((service) => {
            const serviceInfo = SERVICE_TYPES[service.type] || { emoji: '❓', name: service.type, desc: '' };
            return (
              <View key={service.id} style={styles.serviceItem}>
                <View style={styles.serviceIcon}>
                  <Text style={{ fontSize: 20 }}>{serviceInfo.emoji}</Text>
                </View>
                <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                  <Text style={[typography.body, { fontWeight: '600' }]}>
                    {serviceInfo.name}
                  </Text>
                  <Text style={[typography.caption, { color: colors.gray[500], marginTop: spacing.xs }]}>
                    {service.date}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[typography.body, { fontWeight: '600', color: colors.primary }]}>
                    ₹{service.cost}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: service.status === 'completed' ? colors.success + '20' : colors.warning + '20' }
                  ]}>
                    <Text style={[
                      typography.caption,
                      { color: service.status === 'completed' ? colors.success : colors.warning }
                    ]}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.quickActions}>
        <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>Quick Actions</Text>
        <Button
          title="📅 Book New Service"
          onPress={() => {}}
          variant="primary"
          style={{ marginBottom: spacing.md }}
        />
        <Button
          title="🚗 Manage Vehicles"
          onPress={() => {}}
          variant="outline"
          style={{ marginBottom: spacing.md }}
        />
        <Button
          title="🎁 Subscription Plans"
          onPress={() => {}}
          variant="outline"
          style={{ marginBottom: spacing.md }}
        />
        <Button
          title="💳 Add Wallet Balance"
          onPress={() => {}}
          variant="outline"
          style={{ marginBottom: spacing.md }}
        />
        <Button
          title="Logout"
          onPress={logout}
          variant="secondary"
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  welcomeCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
  },
  statContent: {
    alignItems: 'center',
  },
  nextServiceCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  nextServiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  quickActions: {
    marginBottom: spacing.lg,
  },
});
