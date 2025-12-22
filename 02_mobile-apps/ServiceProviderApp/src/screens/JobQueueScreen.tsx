
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react-native';
import { theme } from '../theme';
import { apiClient } from '../config/api';

const JobQueueScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      // In a real agentic flow, we might fetch 'assigned' jobs or 'open' pool
      // For this demo, let's fetch all pending/assigned to me
      const response = await apiClient.get('/services/requests/'); // Adjust filter as needed
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load jobs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAcceptJob = async (id: number) => {
    try {
      await apiClient.post(`/services/requests/${id}/accept/`);
      Alert.alert('Success', 'Job Accepted! Navigate to location.');
      fetchJobs();
    } catch (error) {
      Alert.alert('Error', 'Could not accept job.');
    }
  };

  const renderJobItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.service_type}</Text>
        </View>
        <Text style={styles.timeText}>Now</Text>
      </View>

      <View style={styles.row}>
        <MapPin size={16} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </Text>
      </View>

      <Text style={styles.notesText}>
        {item.customer_notes || "No additional notes."}
      </Text>

      <View style={styles.actionRow}>
        {item.status === 'PENDING' ? (
          <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptJob(item.id)}>
            <Text style={styles.buttonText}>Accept Job</Text>
          </TouchableOpacity>
        ) : item.status === 'DISPATCHED' ? (
          <TouchableOpacity style={styles.activeButton} disabled>
            <Navigation size={16} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>En Route</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>{item.status}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Queue</Text>
        <Text style={styles.subtitle}>Available Assignments</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.success} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJobs(); }} tintColor={theme.colors.success} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No jobs available right now.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  badgeContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)', // Green tint
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  badgeText: {
    color: theme.colors.success,
    fontWeight: 'bold',
    fontSize: 12,
  },
  timeText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  locationText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  notesText: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.m,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: theme.colors.primary, // Cyan for active
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  completedBadge: {
    padding: 8,
  },
  completedText: {
    color: theme.colors.textSecondary,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  }
});

export default JobQueueScreen;