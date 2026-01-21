import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@vehic-aid/auth';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';
import { Ionicons } from '@expo/vector-icons';

// Mock earning data
const RECENT_EARNINGS = [
  { id: 1, service: '🚗 Towing', amount: 450, time: '2:30 PM', status: 'COMPLETED' },
  { id: 2, service: '🔧 Mechanic', amount: 650, time: '1:15 PM', status: 'COMPLETED' },
  { id: 3, service: '⛽ Fuel Delivery', amount: 200, time: '12:45 PM', status: 'COMPLETED' },
  { id: 4, service: '🔋 Battery Jump', amount: 350, time: '11:20 AM', status: 'COMPLETED' },
  { id: 5, service: '🚚 Flatbed Towing', amount: 950, time: '10:00 AM', status: 'COMPLETED' },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(true);
  const [stats] = useState({
    today: 2450,
    this_week: 12300,
    this_month: 89500,
    active_jobs: 3,
    pending_requests: 5,
    acceptance_rate: 94,
    average_rating: 4.8,
    response_time: 28,
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header with Online/Offline Toggle */}
      <View style={styles.headerSection}>
        <View>
          <Text style={[typography.h2, { marginBottom: spacing.xs }]}>
            Welcome, {user?.first_name || 'Provider'}! 👋
          </Text>
          <Text style={[typography.caption, { color: colors.gray[600] }]}>Earnings Dashboard</Text>
        </View>
        <TouchableOpacity
          style={[styles.statusToggle, { backgroundColor: online ? colors.success : colors.gray[300] }]}
          onPress={() => setOnline(!online)}
        >
          <View style={styles.statusDot} />
          <Text style={[typography.caption, { color: 'white', fontWeight: '600' }]}>
            {online ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Earnings Summary Cards */}
      <Card style={styles.earningsCard}>
        <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>💰 Earnings Summary</Text>

        <View style={styles.earningsRow}>
          <View style={styles.earningBox}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Today
            </Text>
            <Text style={[typography.h2, { color: colors.success }]}>₹{stats.today.toLocaleString()}</Text>
            <Text style={[typography.caption, { color: colors.success, marginTop: spacing.xs }]}>
              📈 +12%
            </Text>
          </View>

          <View style={styles.earningBox}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              This Week
            </Text>
            <Text style={[typography.h2, { color: colors.secondary }]}>₹{stats.this_week.toLocaleString()}</Text>
          </View>

          <View style={styles.earningBox}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              This Month
            </Text>
            <Text style={[typography.h2, { color: colors.primary }]}>₹{stats.this_month.toLocaleString()}</Text>
          </View>
        </View>
      </Card>

      {/* Performance KPIs */}
      <Card style={styles.kpiCard}>
        <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>📊 Performance</Text>

        <View style={styles.kpiGrid}>
          <View style={styles.kpiItem}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            <Text style={[typography.body, { fontWeight: '600', marginTop: spacing.xs }]}>
              {stats.active_jobs}
            </Text>
            <Text style={[typography.caption, { color: colors.gray[600] }]}>Active Jobs</Text>
          </View>

          <View style={styles.kpiItem}>
            <Ionicons name="list" size={28} color={colors.secondary} />
            <Text style={[typography.body, { fontWeight: '600', marginTop: spacing.xs }]}>
              {stats.pending_requests}
            </Text>
            <Text style={[typography.caption, { color: colors.gray[600] }]}>Pending</Text>
          </View>

          <View style={styles.kpiItem}>
            <Ionicons name="trending-up" size={28} color={colors.warning} />
            <Text style={[typography.body, { fontWeight: '600', marginTop: spacing.xs }]}>
              {stats.acceptance_rate}%
            </Text>
            <Text style={[typography.caption, { color: colors.gray[600] }]}>Acceptance</Text>
          </View>

          <View style={styles.kpiItem}>
            <Ionicons name="star" size={28} color={colors.warning} />
            <Text style={[typography.body, { fontWeight: '600', marginTop: spacing.xs }]}>
              {stats.average_rating}
            </Text>
            <Text style={[typography.caption, { color: colors.gray[600] }]}>Rating</Text>
          </View>

          <View style={styles.kpiItem}>
            <Ionicons name="time" size={28} color={colors.primary} />
            <Text style={[typography.body, { fontWeight: '600', marginTop: spacing.xs }]}>
              {stats.response_time}s
            </Text>
            <Text style={[typography.caption, { color: colors.gray[600] }]}>Avg Response</Text>
          </View>

          <View style={styles.kpiItem}>
            <Ionicons name="checkmark-done" size={28} color={colors.success} />
            <Text style={[typography.body, { fontWeight: '600', marginTop: spacing.xs }]}>98%</Text>
            <Text style={[typography.caption, { color: colors.gray[600] }]}>Completion</Text>
          </View>
        </View>
      </Card>

      {/* Recent Earnings */}
      <Card style={styles.recentCard}>
        <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>🕐 Recent Earnings</Text>

        {RECENT_EARNINGS.map((earning) => (
          <View key={earning.id} style={styles.earningItem}>
            <View style={styles.earningItemLeft}>
              <Text style={typography.body}>{earning.service}</Text>
              <Text style={[typography.caption, { color: colors.gray[600], marginTop: spacing.xs }]}>
                {earning.time}
              </Text>
            </View>
            <View style={styles.earningItemRight}>
              <Text style={[typography.body, { color: colors.success, fontWeight: '600' }]}>
                +₹{earning.amount}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={[typography.caption, { color: colors.success, fontWeight: '600' }]}>
                  ✓ {earning.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Card>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Button
          title="View Available Jobs"
          onPress={() => {}}
          variant="primary"
          style={{ marginBottom: spacing.md }}
        />
        <Button
          title="Earnings Report"
          onPress={() => {}}
          variant="secondary"
          style={{ marginBottom: spacing.md }}
        />
        <Button title="Settings" onPress={() => {}} variant="outline" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  earningsCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  earningBox: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  kpiCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  recentCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  earningItemLeft: {
    flex: 1,
  },
  earningItemRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  actionsSection: {
    marginBottom: spacing.lg,
  },
});
