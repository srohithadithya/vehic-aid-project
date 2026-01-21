import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Card, colors, spacing, typography } from '@vehic-aid/ui';
import { Ionicons } from '@expo/vector-icons';

// All 7 Service Types
const SERVICE_TYPES = [
  { id: 'TOWING', name: '🚗 Towing' },
  { id: 'FLATBED_TOWING', name: '🚚 Flatbed Towing' },
  { id: 'MECHANIC', name: '🔧 Mechanic' },
  { id: 'FUEL_DELIVERY', name: '⛽ Fuel Delivery' },
  { id: 'BATTERY_JUMP', name: '🔋 Battery Jump' },
  { id: 'LOCKOUT', name: '🔐 Lockout' },
  { id: 'FLAT_TIRE', name: '🛞 Flat Tire' },
];

// All 6 Vehicle Types
const VEHICLE_TYPES = [
  { id: 'TWO_WHEELER', name: '🏍️ Two Wheeler' },
  { id: 'THREE_WHEELER', name: '🛺 Three Wheeler' },
  { id: 'FOUR_WHEELER', name: '🚗 Four Wheeler' },
  { id: 'SUV', name: '🚙 SUV' },
  { id: 'VAN', name: '🚐 Van' },
  { id: 'TRUCK', name: '🚛 Truck' },
];

// Mock real-time job data
const MOCK_JOBS = [
  {
    id: 'JOB001',
    serviceType: 'TOWING',
    vehicleType: 'FOUR_WHEELER',
    customerName: 'Raj Kumar',
    customerRating: 4.7,
    distance: 3.5,
    basePrice: 249,
    distancePrice: 75,
    estimatedTime: '7 mins',
    location: 'Sector 42, Gurgaon',
    timestamp: Date.now() - 120000,
  },
  {
    id: 'JOB002',
    serviceType: 'MECHANIC',
    vehicleType: 'SUV',
    customerName: 'Priya Singh',
    customerRating: 4.9,
    distance: 2.1,
    basePrice: 349,
    distancePrice: 50,
    estimatedTime: '4 mins',
    location: 'DLF Cyber City',
    timestamp: Date.now() - 60000,
  },
  {
    id: 'JOB003',
    serviceType: 'FLATBED_TOWING',
    vehicleType: 'TRUCK',
    customerName: 'Amit Patel',
    customerRating: 4.8,
    distance: 8.2,
    basePrice: 699,
    distancePrice: 200,
    estimatedTime: '15 mins',
    location: 'Noida Expressway',
    timestamp: Date.now() - 30000,
  },
  {
    id: 'JOB004',
    serviceType: 'FUEL_DELIVERY',
    vehicleType: 'THREE_WHEELER',
    customerName: 'Sunita Gupta',
    customerRating: 4.6,
    distance: 1.5,
    basePrice: 49,
    distancePrice: 25,
    estimatedTime: '3 mins',
    location: 'MG Road',
    timestamp: Date.now() - 10000,
  },
  {
    id: 'JOB005',
    serviceType: 'BATTERY_JUMP',
    vehicleType: 'FOUR_WHEELER',
    customerName: 'Vikram Desai',
    customerRating: 4.7,
    distance: 5.8,
    basePrice: 199,
    distancePrice: 145,
    estimatedTime: '10 mins',
    location: 'Gurugram Road',
    timestamp: Date.now() - 5000,
  },
];

export default function JobsScreen() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    service: 'ALL',
    distance: 'ALL',
  });
  const [showFilters, setShowFilters] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setJobs([...MOCK_JOBS].sort((a, b) => b.timestamp - a.timestamp));
      setRefreshing(false);
    }, 1000);
  };

  const filteredJobs = jobs.filter((job) => {
    if (filters.service !== 'ALL' && job.serviceType !== filters.service) return false;
    if (filters.distance === '<5' && job.distance >= 5) return false;
    if (filters.distance === '5-15' && (job.distance < 5 || job.distance > 15)) return false;
    if (filters.distance === '15-30' && (job.distance < 15 || job.distance > 30)) return false;
    if (filters.distance === '30+' && job.distance < 30) return false;
    return true;
  });

  const handleAccept = (job) => {
    Alert.alert(
      'Job Accepted',
      `✅ Job #${job.id} accepted!\nEarning: ₹${job.basePrice + job.distancePrice}`,
      [{ text: 'OK', onPress: () => setShowDetails(false) }]
    );
    setJobs(jobs.filter((j) => j.id !== job.id));
  };

  const handleDecline = (jobId) => {
    setJobs(jobs.filter((j) => j.id !== jobId));
    setShowDetails(false);
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedJob(item);
        setShowDetails(true);
      }}
    >
      <Card style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceEmoji}>
              {SERVICE_TYPES.find((s) => s.id === item.serviceType)?.name.split(' ')[0]}
            </Text>
            <View style={styles.serviceDetails}>
              <Text style={typography.body}>{SERVICE_TYPES.find((s) => s.id === item.serviceType)?.name}</Text>
              <Text style={[typography.caption, { color: colors.gray[600] }]}>
                {item.customerName} • {item.customerRating}⭐
              </Text>
            </View>
          </View>
          <View style={styles.priceTag}>
            <Text style={[typography.h3, { color: colors.success }]}>
              ₹{item.basePrice + item.distancePrice}
            </Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.detail}>
            <Ionicons name="location" size={16} color={colors.secondary} />
            <Text style={styles.detailText}>{item.distance} km • {item.estimatedTime}</Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="car" size={16} color={colors.secondary} />
            <Text style={styles.detailText}>
              {VEHICLE_TYPES.find((v) => v.id === item.vehicleType)?.name}
            </Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="map-outline" size={16} color={colors.secondary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.success }]}
            onPress={() => handleAccept(item)}
          >
            <Text style={[typography.body, { color: 'white', fontWeight: '600' }]}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.error }]}
            onPress={() => handleDecline(item.id)}
          >
            <Text style={[typography.body, { color: 'white', fontWeight: '600' }]}>Decline</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={typography.h2}>Live Job Feed</Text>
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterBtn}>
                <Ionicons name="options" size={24} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            {showFilters && (
              <Card style={styles.filterCard}>
                <Text style={[typography.body, { fontWeight: '600', marginBottom: spacing.sm }]}>
                  Service Type
                </Text>
                <View style={styles.filterOptions}>
                  {['ALL', ...SERVICE_TYPES.map((s) => s.id)].map((service) => (
                    <TouchableOpacity
                      key={service}
                      style={[
                        styles.filterOption,
                        filters.service === service && { backgroundColor: colors.secondary },
                      ]}
                      onPress={() => setFilters({ ...filters, service })}
                    >
                      <Text
                        style={[
                          typography.caption,
                          filters.service === service && { color: 'white', fontWeight: '600' },
                        ]}
                      >
                        {service === 'ALL' ? 'All' : service.substring(0, 4)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[typography.body, { fontWeight: '600', marginTop: spacing.md, marginBottom: spacing.sm }]}>
                  Distance
                </Text>
                <View style={styles.filterOptions}>
                  {['ALL', '<5', '5-15', '15-30', '30+'].map((range) => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.filterOption,
                        filters.distance === range && { backgroundColor: colors.secondary },
                      ]}
                      onPress={() => setFilters({ ...filters, distance: range })}
                    >
                      <Text
                        style={[
                          typography.caption,
                          filters.distance === range && { color: 'white', fontWeight: '600' },
                        ]}
                      >
                        {range === 'ALL' ? 'All' : range + ' km'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            )}

            <View style={styles.jobCount}>
              <Text style={[typography.body, { color: colors.gray[600] }]}>
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color={colors.gray[400]} />
            <Text style={[typography.body, { color: colors.gray[600], marginTop: spacing.md }]}>
              No jobs available
            </Text>
          </View>
        }
      />

      <Modal visible={showDetails} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedJob && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowDetails(false)}>
                    <Ionicons name="close" size={28} color={colors.secondary} />
                  </TouchableOpacity>
                  <Text style={typography.h2}>Job Details</Text>
                  <View style={{ width: 28 }} />
                </View>

                <Card style={styles.jobInfoCard}>
                  <View style={styles.customerHeader}>
                    <View style={styles.customerAvatar}>
                      <Text style={styles.avatarText}>{selectedJob.customerName.charAt(0)}</Text>
                    </View>
                    <View style={styles.customerInfo}>
                      <Text style={typography.h3}>{selectedJob.customerName}</Text>
                      <Text style={[typography.caption, { color: colors.gray[600] }]}>
                        {selectedJob.customerRating}⭐
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={[typography.body, { color: colors.gray[600] }]}>Service</Text>
                    <Text style={typography.body}>
                      {SERVICE_TYPES.find((s) => s.id === selectedJob.serviceType)?.name}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={[typography.body, { color: colors.gray[600] }]}>Vehicle</Text>
                    <Text style={typography.body}>
                      {VEHICLE_TYPES.find((v) => v.id === selectedJob.vehicleType)?.name}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={[typography.body, { color: colors.gray[600] }]}>Distance</Text>
                    <Text style={typography.body}>{selectedJob.distance} km</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.pricingBreakdown}>
                    <View style={styles.priceRow}>
                      <Text style={[typography.body, { color: colors.gray[600] }]}>Base</Text>
                      <Text style={typography.body}>₹{selectedJob.basePrice}</Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={[typography.body, { color: colors.gray[600] }]}>Distance</Text>
                      <Text style={typography.body}>₹{selectedJob.distancePrice}</Text>
                    </View>
                    <View style={[styles.priceRow, { borderTopWidth: 1, borderTopColor: colors.gray[200], paddingTop: spacing.sm }]}>
                      <Text style={[typography.h3, { fontWeight: '600' }]}>Total</Text>
                      <Text style={[typography.h3, { color: colors.success, fontWeight: '600' }]}>
                        ₹{selectedJob.basePrice + selectedJob.distancePrice}
                      </Text>
                    </View>
                  </View>
                </Card>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: colors.success }]}
                    onPress={() => handleAccept(selectedJob)}
                  >
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                    <Text style={[typography.body, { color: 'white', fontWeight: '600', marginLeft: spacing.sm }]}>
                      Accept Job
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: colors.error }]}
                    onPress={() => {
                      handleDecline(selectedJob.id);
                      setShowDetails(false);
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="white" />
                    <Text style={[typography.body, { color: 'white', fontWeight: '600', marginLeft: spacing.sm }]}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  filterBtn: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
  },
  filterCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.gray[200],
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  jobCount: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  jobCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  serviceDetails: {
    flex: 1,
  },
  priceTag: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  jobDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  jobInfoCard: {
    marginVertical: spacing.md,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  customerInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  pricingBreakdown: {
    marginTop: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  modalActions: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  modalBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
});
