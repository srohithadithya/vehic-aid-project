import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator } from 'react-native';
import { apiClient } from '../../src/api/client';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideClock, LucideMapPin, LucideDollarSign } from 'lucide-react-native';

export default function HistoryScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // In a real app we would have a specific history endpoint or filter by status=COMPLETED
        // For now we mock or use the same jobs endpoint
        const response = await apiClient.get('/services/provider/jobs/');
        // Filter for completed or mock some data if empty
        const completed = response.data.filter((j: any) => j.status === 'COMPLETED');
        if (completed.length === 0) {
          // Inject mock history for demo
          setJobs([
            { id: 101, created_at: '2025-10-12T10:00:00Z', service_type: 'TOWING', amount: 1200, location: 'MG Road, Bangalore' },
            { id: 102, created_at: '2025-10-11T14:30:00Z', service_type: 'TIRE_CHANGE', amount: 500, location: 'Indiranagar' },
            { id: 103, created_at: '2025-10-10T09:15:00Z', service_type: 'BATTERY_JUMP', amount: 800, location: 'Koramangala' },
          ] as any);
        } else {
          setJobs(completed);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.serviceType, { color: theme.text }]}>{item.service_type.replace('_', ' ')}</Text>
        <View style={[styles.badge, { backgroundColor: '#10b98120' }]}>
          <Text style={[styles.status, { color: '#10b981' }]}>COMPLETED</Text>
        </View>
      </View>

      <View style={styles.row}>
        <LucideClock size={16} color={theme.tabIconDefault} />
        <Text style={[styles.text, { color: theme.tabIconDefault }]}>{new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>

      <View style={styles.row}>
        <LucideMapPin size={16} color={theme.tabIconDefault} />
        <Text style={[styles.text, { color: theme.tabIconDefault }]}>{item.location || 'Bangalore, KA'}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={[styles.label, { color: theme.tabIconDefault }]}>EARNINGS</Text>
        <Text style={[styles.amount, { color: theme.tint }]}>₹{item.amount || '0'}</Text>
      </View>
    </View>
  );

  if (loading) return <View style={[styles.centered, { backgroundColor: theme.background }]}><ActivityIndicator color={theme.tint} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Ride History</Text>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  serviceType: { fontSize: 18, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  status: { fontSize: 12, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  text: { fontSize: 14 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  amount: { fontSize: 20, fontWeight: 'bold' },
});
