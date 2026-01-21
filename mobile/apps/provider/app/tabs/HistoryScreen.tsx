import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, colors, spacing, typography } from '@vehic-aid/ui';
import { SERVICE_TYPES, SERVICE_TYPE_LABELS, VEHICLE_TYPE_LABELS } from '../constants';

interface CompletedJob {
  id: string;
  service: string;
  vehicle: string;
  customerName: string;
  customerRating: number;
  amount: number;
  date: string;
  duration: string;
  status: 'completed' | 'cancelled' | 'disputed';
}

export default function HistoryScreen() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'cancelled' | 'disputed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const MOCK_JOBS: CompletedJob[] = [
    {
      id: '1',
      service: SERVICE_TYPES.TOWING,
      vehicle: 'FOUR_WHEELER',
      customerName: 'Rajesh Kumar',
      customerRating: 5,
      amount: 450,
      date: '2024-01-15 14:30',
      duration: '45 mins',
      status: 'completed',
    },
    {
      id: '2',
      service: SERVICE_TYPES.MECHANIC,
      vehicle: 'SUV',
      customerName: 'Priya Singh',
      customerRating: 4.5,
      amount: 650,
      date: '2024-01-15 10:15',
      duration: '1 hr 20 mins',
      status: 'completed',
    },
    {
      id: '3',
      service: SERVICE_TYPES.FLATBED_TOWING,
      vehicle: 'TRUCK',
      customerName: 'Amit Patel',
      customerRating: 5,
      amount: 950,
      date: '2024-01-14 16:45',
      duration: '2 hrs 15 mins',
      status: 'completed',
    },
    {
      id: '4',
      service: SERVICE_TYPES.FUEL_DELIVERY,
      vehicle: 'THREE_WHEELER',
      customerName: 'Neha Gupta',
      customerRating: 4,
      amount: 200,
      date: '2024-01-14 09:20',
      duration: '20 mins',
      status: 'cancelled',
    },
    {
      id: '5',
      service: SERVICE_TYPES.BATTERY_JUMP,
      vehicle: 'FOUR_WHEELER',
      customerName: 'Vikram Singh',
      customerRating: 3.5,
      amount: 350,
      date: '2024-01-13 15:10',
      duration: '30 mins',
      status: 'disputed',
    },
  ];

  const filteredJobs =
    filterStatus === 'all'
      ? MOCK_JOBS
      : MOCK_JOBS.filter((job) => job.status === filterStatus);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleViewDetails = (job: CompletedJob) => {
    Alert.alert(
      'Job Details',
      `Service: ${SERVICE_TYPE_LABELS[job.service]}\nVehicle: ${VEHICLE_TYPE_LABELS[job.vehicle]}\nCustomer: ${job.customerName}\nAmount: ₹${job.amount}\nDuration: ${job.duration}`,
      [{ text: 'Close', onPress: () => {} }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.warning;
      case 'disputed':
        return colors.error;
      default:
        return colors.gray[600];
    }
  };

  const renderJobCard = ({ item }: { item: CompletedJob }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => handleViewDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.serviceName}>{SERVICE_TYPE_LABELS[item.service]}</Text>
          <Text style={styles.vehicleName}>{VEHICLE_TYPE_LABELS[item.vehicle]}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="person" size={14} color={colors.gray[600]} />
            <Text style={styles.detailText}>{item.customerName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.detailText}>{item.customerRating}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={14} color={colors.gray[600]} />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={14} color={colors.gray[600]} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.amountText}>₹{item.amount}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const stats = {
    total: MOCK_JOBS.length,
    completed: MOCK_JOBS.filter((j) => j.status === 'completed').length,
    cancelled: MOCK_JOBS.filter((j) => j.status === 'cancelled').length,
    disputed: MOCK_JOBS.filter((j) => j.status === 'disputed').length,
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { flex: 1 }] as any}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </Card>
          <Card style={[styles.statCard, { flex: 1 }] as any}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {stats.completed}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card>
          <Card style={[styles.statCard, { flex: 1 }] as any}>
            <Text style={[styles.statValue, { color: colors.error }]}>
              {stats.disputed}
            </Text>
            <Text style={styles.statLabel}>Disputed</Text>
          </Card>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Status</Text>
          <View style={styles.filterButtons}>
            {(['all', 'completed', 'cancelled', 'disputed'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Jobs List */}
        <Card style={styles.jobsCard}>
          {filteredJobs.length > 0 ? (
            <FlatList
              data={filteredJobs}
              renderItem={renderJobCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color={colors.gray[400]} />
              <Text style={styles.emptyText}>No jobs found</Text>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            title="Download Report"
            variant="secondary"
            onPress={() =>
              Alert.alert('Download', 'Your monthly report will be sent to your email')
            }
            style={styles.actionButton}
          />
          <Button
            title="Contact Support"
            variant="secondary"
            onPress={() => Alert.alert('Support', 'Support team will contact you soon')}
            style={styles.actionButton}
          />
        </View>
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray[600],
    textAlign: 'center',
    ...typography.caption,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: colors.gray[700],
  },
  filterButtonTextActive: {
    color: 'white',
  },
  jobsCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  jobCard: {
    paddingVertical: spacing.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  jobInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  vehicleName: {
    fontSize: 12,
    color: colors.gray[600],
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  jobDetails: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
