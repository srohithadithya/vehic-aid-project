// ServiceProviderApp/src/components/JobCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, DollarSign, Clock } from 'lucide-react-native';

interface JobCardProps {
  job: {
    id: number;
    customer_name: string;
    vehicle_plate: string;
    service_type: string;
    distance_km: number;
    priority: 'HIGH' | 'URGENT' | 'MEDIUM';
    time_since_request: string;
  };
  onAccept: (jobId: number) => void;
  onReject: (jobId: number) => void;
}

const getPriorityColor = (priority: JobCardProps['job']['priority']) => {
  if (priority === 'URGENT') return '#DC3545'; // Red
  if (priority === 'HIGH') return '#FFC107'; // Yellow
  return '#17A2B8'; // Blue-green
};

const JobCard: React.FC<JobCardProps> = ({ job, onAccept, onReject }) => {
  const priorityColor = getPriorityColor(job.priority);
  
  return (
    <View style={styles.card}>
      {/* HEADER: Priority and Status */}
      <View style={[styles.header, { borderLeftColor: priorityColor }]}>
        <Text style={styles.priorityText}>{job.priority} REQUEST</Text>
        <View style={styles.infoRow}>
            <Clock size={14} color="#6C757D" />
            <Text style={styles.infoText}>{job.time_since_request} ago</Text>
        </View>
      </View>

      {/* BODY: Details */}
      <View style={styles.body}>
        <Text style={styles.serviceType}>{job.service_type}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Customer:</Text>
          <Text style={styles.value}>{job.customer_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Vehicle:</Text>
          <Text style={styles.value}>{job.vehicle_plate}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={16} color="#495057" style={{marginRight: 5}} />
          <Text style={styles.value}>{job.distance_km.toFixed(1)} km away</Text>
        </View>
      </View>

      {/* FOOTER: Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.acceptButton]}
          onPress={() => onAccept(job.id)}
        >
          <Text style={styles.buttonText}>Accept & Go</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(job.id)}
        >
          <Text style={styles.rejectText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6C757D',
    marginLeft: 4,
  },
  body: {
    padding: 15,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    color: '#343A40',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#343A40',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#28A745',
    borderBottomLeftRadius: 12,
    borderRightWidth: 1,
    borderRightColor: '#FFFFFF44',
  },
  rejectButton: {
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  rejectText: {
    color: '#DC3545',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default JobCard;