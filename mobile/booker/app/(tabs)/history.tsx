import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { apiClient } from '../../src/api/client';
import { ServiceRequest } from '../../src/types';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideClock, LucideCheckCircle, LucideAlertCircle, LucideMapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BookingHistoryScreen() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get('/services/request/');
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const renderRequestCard = ({ item }: { item: ServiceRequest }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'PENDING_DISPATCH': return '#f59e0b';
        case 'DISPATCHED': return '#3b82f6';
        case 'ARRIVED': return '#10b981';
        case 'COMPLETED': return '#10b981';
        case 'CANCELLED': return '#ef4444';
        default: return theme.tint;
      }
    };

    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.serviceType, { color: theme.text }]}>
            {item.service_type.replace('_', ' ').toUpperCase()}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.replace('_', ' ')}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <LucideMapPin size={16} color={theme.tabIconDefault} />
          <Text style={[styles.detailText, { color: theme.tabIconDefault }]}>Current Status: {item.status.toLowerCase()}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.timestamp, { color: theme.tabIconDefault }]}>
            {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>

          <View style={styles.actionButtons}>
            {(item.status === 'DISPATCHED' || item.status === 'ARRIVED') && (
              <TouchableOpacity
                style={[styles.miniButton, { backgroundColor: theme.tint }]}
                onPress={() => router.push({
                  pathname: '/tracking',
                  params: { requestId: item.id, providerName: 'Rahul Sharma' }
                })}
              >
                <Text style={styles.miniButtonText}>Track Provider</Text>
              </TouchableOpacity>
            )}

            {(item.status === 'COMPLETED' || item.status === 'QUOTE_PENDING') && (
              <TouchableOpacity
                style={[styles.miniButton, { backgroundColor: '#10b981' }]}
                onPress={() => router.push({
                  pathname: '/payment',
                  params: { requestId: item.id, amount: item.dynamic_total || '1499' }
                })}
              >
                <Text style={styles.miniButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
          </View>
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
      <Text style={[styles.headerTitle, { color: theme.text }]}>Service History</Text>

      <FlatList
        data={requests}
        renderItem={renderRequestCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRequests(); }} tintColor={theme.tint} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LucideClock size={60} color={theme.tabIconDefault} />
            <Text style={[styles.emptyText, { color: theme.tabIconDefault }]}>No requests yet.</Text>
            <Text style={[styles.emptySubtext, { color: theme.tabIconDefault }]}>Your service request history will appear here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  list: {
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10,
  },
  timestamp: {
    fontSize: 12,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  miniButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  miniButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
