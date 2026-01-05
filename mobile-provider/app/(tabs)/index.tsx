import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text, View, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { apiClient } from '../../src/api/client';
import { JobAssignment, ServiceStatus } from '../../src/types';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideTruck, LucideNavigation, LucideCheckCircle, LucideAlertCircle, LucideClock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function JobDashboard() {
  const [jobs, setJobs] = useState<JobAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get('/services/provider/jobs/');
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (jobId: number, status: string) => {
    try {
      await apiClient.patch(`/services/provider/jobs/${jobId}/`, { status });
      Alert.alert('Status Updated', `Job status changed to ${status.replace('_', ' ')}`);
      fetchJobs();
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const renderJobCard = ({ item }: { item: JobAssignment }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'ASSIGNED': return '#f59e0b';
        case 'EN_ROUTE': return '#3b82f6';
        case 'ARRIVED': return '#10b981';
        case 'COMPLETED': return theme.tabIconDefault;
        default: return theme.tint;
      }
    };

    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
          <Text style={[styles.time, { color: theme.tabIconDefault }]}>
            <LucideClock size={12} /> Just Now
          </Text>
        </View>

        <Text style={[styles.serviceType, { color: theme.text }]}>
          {item.service_request.service_type.replace('_', ' ').toUpperCase()}
        </Text>

        <View style={styles.detailRow}>
          <LucideAlertCircle size={16} color={theme.tabIconDefault} />
          <Text style={[styles.detailText, { color: theme.text }]}>Customer: {item.service_request.customer_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <LucideNavigation size={16} color={theme.tabIconDefault} />
          <Text style={[styles.detailText, { color: theme.text }]}>{item.service_request.pickup_location}</Text>
        </View>

        <View style={styles.actions}>
          {(item.status === 'ASSIGNED' || item.status === 'EN_ROUTE') && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.tint, marginBottom: 10 }]}
              onPress={() => router.push({
                pathname: '/navigation',
                params: {
                  lat: item.service_request.latitude,
                  lng: item.service_request.longitude,
                  customer: item.service_request.customer_name
                }
              })}
            >
              <LucideNavigation size={18} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Navigate to Customer</Text>
            </TouchableOpacity>
          )}

          {item.status === 'ASSIGNED' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
              onPress={() => updateStatus(item.id, 'EN_ROUTE')}
            >
              <LucideTruck size={18} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Start Trip</Text>
            </TouchableOpacity>
          )}
          {item.status === 'EN_ROUTE' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              onPress={() => updateStatus(item.id, 'ARRIVED')}
            >
              <LucideNavigation size={18} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>I've Arrived</Text>
            </TouchableOpacity>
          )}
          {item.status === 'ARRIVED' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#9d50bb' }]}
              onPress={() => updateStatus(item.id, 'COMPLETED')}
            >
              <LucideCheckCircle size={18} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Complete Job</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Active Jobs</Text>
        <TouchableOpacity onPress={fetchJobs}>
          <LucideClock size={24} color={theme.tint} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJobs(); }} tintColor={theme.tint} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LucideAlertCircle size={60} color={theme.tabIconDefault} />
            <Text style={[styles.emptyText, { color: theme.tabIconDefault }]}>No active jobs found.</Text>
            <Text style={[styles.emptySubtext, { color: theme.tabIconDefault }]}>New requests will appear here in real-time.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 10,
  },
  actions: {
    marginTop: 20,
  },
  actionButton: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
