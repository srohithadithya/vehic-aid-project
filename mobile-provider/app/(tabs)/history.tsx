import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator, Image, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { apiClient } from '../../src/api/client';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideMapPin, LucideDollarSign, LucideCalendar, LucideCheckCircle, LucideXCircle, LucideSearch } from 'lucide-react-native';

interface Mission {
  id: number;
  service_type: string;
  status: string;
  created_at: string;
  customer_notes: string;
  booker_name?: string;
  dynamic_total?: string;
}

export default function MissionLogScreen() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const fetchHistory = async () => {
    try {
      // Using provider jobs endpoint but could filter by status or use a dedicated history endpoint
      // For now, let's assume we fetch all and filter client side or backend supports ?status=COMPLETED
      const response = await apiClient.get('/services/provider/jobs/');
      // In a real scenario, this endpoint might only return active jobs. 
      // We might need /services/provider/history/ or similar. 
      // Only active jobs are in /jobs/, so history might be empty if backend logic filters strictly.
      // Let's assume for now we see all or need to implement a history endpoint.
      // *Self-Correction*: Use /services/my-requests/ but that's for bookers. 
      // Let's try /services/provider/jobs/?status=COMPLETED if implemented, else mock or use what we have.
      // Actually, previously view_file showed filter `status='PENDING_DISPATCH'` in `ProviderJobView`.
      // So we might not see completed jobs there.
      // I will use a placeholder list for now to demonstrate UI parity until backend supports history.
      setMissions([
        { id: 101, service_type: 'TOWING', status: 'COMPLETED', created_at: '2024-03-10T10:00:00Z', customer_notes: 'Indiranagar', booker_name: 'Rohit', dynamic_total: '1500' },
        { id: 102, service_type: 'FUEL', status: 'COMPLETED', created_at: '2024-03-09T14:30:00Z', customer_notes: 'Koramangala', booker_name: 'Adithya', dynamic_total: '500' },
        { id: 103, service_type: 'FLAT_TIRE', status: 'CANCELLED', created_at: '2024-03-08T09:15:00Z', customer_notes: 'MG Road', booker_name: 'Rahul', dynamic_total: '0' },
      ]);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderMission = ({ item }: { item: Mission }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[
            styles.iconBg,
            { backgroundColor: item.status === 'COMPLETED' ? '#22c55e20' : '#ef444420' }
          ]}>
            {item.status === 'COMPLETED' ?
              <LucideCheckCircle size={20} color={item.status === 'COMPLETED' ? '#22c55e' : '#ef4444'} /> :
              <LucideXCircle size={20} color="#ef4444" />
            }
          </View>
          <View>
            <Text style={[styles.serviceType, { color: theme.text }]}>{item.service_type}</Text>
            <Text style={[styles.missionId, { color: theme.tabIconDefault }]}>ID: #{item.id}</Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: item.status === 'COMPLETED' ? theme.text : theme.tabIconDefault, textDecorationLine: item.status !== 'COMPLETED' ? 'line-through' : 'none' }]}>
            ₹{item.dynamic_total || '0'}
          </Text>
          <Text style={[styles.statusText, { color: item.status === 'COMPLETED' ? '#22c55e' : '#ef4444' }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.row}>
          <LucideCalendar size={14} color={theme.tabIconDefault} />
          <Text style={[styles.footerText, { color: theme.tabIconDefault }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.row}>
          <LucideMapPin size={14} color={theme.tabIconDefault} />
          <Text style={[styles.footerText, { color: theme.tabIconDefault }]}>
            {item.customer_notes}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Mission Log</Text>
          <Text style={{ color: theme.tabIconDefault }}>Archive of all operations.</Text>
        </View>
      </View>

      {/* Search Bar Placeholder */}
      <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
        <LucideSearch size={20} color={theme.tabIconDefault} />
        <Text style={{ color: theme.tabIconDefault, marginLeft: 10 }}>Search ID or Location...</Text>
      </View>

      <FlatList
        data={missions}
        renderItem={renderMission}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchHistory(); }} tintColor={theme.tint} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  searchBar: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
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
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 15,
  },
  iconBg: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  missionId: {
    fontSize: 12,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.1)',
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
  },
});
