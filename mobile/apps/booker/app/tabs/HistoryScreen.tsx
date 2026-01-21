import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';
import { Ionicons } from '@expo/vector-icons';

interface ServiceRecord {
  id: string;
  vehicle: string;
  service_type: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  provider_name: string;
  rating?: number;
}

const FILTER_OPTIONS = ['All', 'Completed', 'Pending', 'Cancelled'];

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [services, setServices] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setServices([
        {
          id: '1',
          vehicle: 'Honda Civic 2023',
          service_type: 'Engine Oil Change',
          date: '2026-01-15',
          amount: 450,
          status: 'completed',
          provider_name: 'Raj Services',
          rating: 5,
        },
        {
          id: '2',
          vehicle: 'Honda Civic 2023',
          service_type: 'Tire Repair',
          date: '2026-01-10',
          amount: 300,
          status: 'completed',
          provider_name: 'AutoCare Plus',
          rating: 4.5,
        },
        {
          id: '3',
          vehicle: 'Honda Civic 2023',
          service_type: 'Battery Service',
          date: '2026-01-05',
          amount: 600,
          status: 'completed',
          provider_name: 'Premium Auto',
          rating: 4.8,
        },
        {
          id: '4',
          vehicle: 'Honda Civic 2023',
          service_type: 'General Maintenance',
          date: '2026-01-20',
          amount: 800,
          status: 'pending',
          provider_name: 'Quick Service',
        },
        {
          id: '5',
          vehicle: 'Honda Civic 2023',
          service_type: 'Brake Service',
          date: '2025-12-25',
          amount: 1200,
          status: 'cancelled',
          provider_name: 'Expert Repair',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredServices = services.filter((service) => {
    if (filter === 'All') return true;
    return service.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray[400];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderServiceItem = ({ item }: { item: ServiceRecord }) => (
    <Card style={styles.serviceItem}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Ionicons name="car" size={20} color={colors.primary} />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={[typography.body, { fontWeight: '600' }]}>
              {item.service_type}
            </Text>
            <Text style={[typography.caption, { color: colors.gray[500], marginTop: spacing.xs }]}>
              {item.vehicle}
            </Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text style={[typography.caption, { color: getStatusColor(item.status), marginLeft: spacing.xs }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.serviceDivider} />

      <View style={styles.serviceDetails}>
        <View style={styles.detailRow}>
          <Text style={[typography.caption, { color: colors.gray[500] }]}>Date</Text>
          <Text style={typography.body}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[typography.caption, { color: colors.gray[500] }]}>Provider</Text>
          <Text style={typography.body}>{item.provider_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[typography.caption, { color: colors.gray[500] }]}>Amount</Text>
          <Text style={[typography.body, { fontWeight: '600', color: colors.primary }]}>
            ₹{item.amount}
          </Text>
        </View>
        {item.rating && (
          <View style={styles.detailRow}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>Your Rating</Text>
            <View style={styles.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(item.rating || 0) ? 'star' : 'star-outline'}
                  size={14}
                  color={colors.warning}
                />
              ))}
              <Text style={[typography.caption, { marginLeft: spacing.xs }]}>
                {item.rating}
              </Text>
            </View>
          </View>
        )}
      </View>

      {item.status === 'completed' && !item.rating && (
        <Button
          title="Rate & Review"
          onPress={() => {}}
          variant="outline"
          style={{ marginTop: spacing.md }}
        />
      )}
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              filter === option && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(option)}
          >
            <Text
              style={[
                typography.body,
                filter === option
                  ? { color: colors.white, fontWeight: '600' }
                  : { color: colors.gray[600] },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Service List */}
      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color={colors.gray[300]} />
          <Text style={[typography.subtitle, { color: colors.gray[500], marginTop: spacing.md }]}>
            No services found
          </Text>
          <Text style={[typography.caption, { color: colors.gray[400], marginTop: spacing.sm }]}>
            Book a service to see your service history here
          </Text>
        </View>
      )}

      {/* Summary Stats */}
      {filteredServices.length > 0 && (
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>
              Total Services
            </Text>
            <Text style={[typography.h3, { color: colors.primary }]}>
              {filteredServices.length}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>
              Total Amount Spent
            </Text>
            <Text style={[typography.h3, { color: colors.success }]}>
              ₹{filteredServices.reduce((sum, s) => sum + s.amount, 0)}
            </Text>
          </View>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  serviceItem: {
    marginBottom: spacing.sm,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
  },
  serviceDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  serviceDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  summaryCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.sm,
  },
});
