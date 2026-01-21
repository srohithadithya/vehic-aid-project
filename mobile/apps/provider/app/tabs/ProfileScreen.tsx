import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput as RNTextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, colors, spacing } from '@vehic-aid/ui';
import { useAuth } from '@vehic-aid/auth';
import { SERVICE_TYPES, SERVICE_TYPE_LABELS } from '../constants';

const SERVICES_LIST = [
  SERVICE_TYPES.TOWING,
  SERVICE_TYPES.MECHANIC,
  SERVICE_TYPES.FLATBED_TOWING,
  SERVICE_TYPES.FUEL_DELIVERY,
  SERVICE_TYPES.BATTERY_JUMP,
  SERVICE_TYPES.LOCKOUT,
  SERVICE_TYPES.FLAT_TIRE,
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: 'John Doe',
    phone: '+91-9876543210',
    email: user?.email || 'provider@vehicaid.com',
  });
  const [servicesOffered, setServicesOffered] = useState<Record<string, boolean>>({
    [SERVICE_TYPES.TOWING]: true,
    [SERVICE_TYPES.MECHANIC]: true,
    [SERVICE_TYPES.FLATBED_TOWING]: false,
    [SERVICE_TYPES.FUEL_DELIVERY]: true,
    [SERVICE_TYPES.BATTERY_JUMP]: true,
    [SERVICE_TYPES.LOCKOUT]: false,
    [SERVICE_TYPES.FLAT_TIRE]: false,
  });
  const [availability, setAvailability] = useState({
    status: 'online' as 'online' | 'offline' | 'break',
    weekdayStart: '06:00',
    weekdayEnd: '22:00',
    weekendStart: '08:00',
    weekendEnd: '20:00',
  });

  const handleEditProfile = () => {
    if (isEditing) {
      Alert.alert('Profile Updated', 'Your profile has been updated successfully');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
  };

  const handleToggleService = (service: string) => {
    setServicesOffered((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  const offeredServicesCount = Object.values(servicesOffered).filter(Boolean).length;
  const rating = 4.85;
  const totalJobs = 247;
  const acceptanceRate = 96;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person-circle" size={60} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{editData.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.ratingText}>{rating} ({totalJobs} jobs)</Text>
              </View>
              <Text style={styles.acceptanceText}>Acceptance Rate: {acceptanceRate}%</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Ionicons name={isEditing ? 'checkmark-done' : 'create'} size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card style={styles.editCard}>
            <Text style={styles.cardTitle}>Edit Profile</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <RNTextInput
                  style={styles.input}
                  value={editData.name}
                  onChangeText={(text) => setEditData({ ...editData, name: text })}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <RNTextInput
                  style={styles.input}
                  value={editData.phone}
                  onChangeText={(text) => setEditData({ ...editData, phone: text })}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <RNTextInput
                  style={styles.input}
                  value={editData.email}
                  onChangeText={(text) => setEditData({ ...editData, email: text })}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.gray[400]}
                  editable={false}
                />
              </View>
            </View>
          </Card>
        )}

        {/* Bank Account Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Bank Account</Text>
          </View>
          <View style={styles.bankInfo}>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Holder</Text>
              <Text style={styles.bankValue}>{editData.name}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Number</Text>
              <Text style={styles.bankValue}>****8976</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Bank Name</Text>
              <Text style={styles.bankValue}>HDFC Bank</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>IFSC Code</Text>
              <Text style={styles.bankValue}>HDFC0000001</Text>
            </View>
          </View>
          <Button
            title="Update Bank Details"
            variant="secondary"
            onPress={() => Alert.alert('Bank Details', 'Contact support to update bank details')}
          />
        </Card>

        {/* Services Offered */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              Services Offered ({offeredServicesCount}/7)
            </Text>
          </View>
          {SERVICES_LIST.map((service) => (
            <View key={service} style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>{SERVICE_TYPE_LABELS[service]}</Text>
              <Switch
                value={servicesOffered[service] || false}
                onValueChange={() => handleToggleService(service)}
                trackColor={{ false: colors.gray[300], true: colors.success + '50' }}
                thumbColor={servicesOffered[service] ? colors.success : colors.gray[400]}
              />
            </View>
          ))}
        </Card>

        {/* Availability Settings */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Availability Settings</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current Status</Text>
            <View style={styles.statusButtons}>
              {(['online', 'offline', 'break'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    availability.status === status && styles.statusButtonActive,
                  ]}
                  onPress={() => setAvailability({ ...availability, status })}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      availability.status === status && styles.statusButtonTextActive,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.hoursSection}>
            <Text style={styles.hoursLabel}>Weekday Hours</Text>
            <View style={styles.hoursRow}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>From</Text>
                <Text style={styles.timeValue}>{availability.weekdayStart}</Text>
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>To</Text>
                <Text style={styles.timeValue}>{availability.weekdayEnd}</Text>
              </View>
            </View>
          </View>

          <View style={styles.hoursSection}>
            <Text style={styles.hoursLabel}>Weekend Hours</Text>
            <View style={styles.hoursRow}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>From</Text>
                <Text style={styles.timeValue}>{availability.weekendStart}</Text>
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>To</Text>
                <Text style={styles.timeValue}>{availability.weekendEnd}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        />

        <View style={styles.footer} />
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
  profileCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  ratingText: {
    fontSize: 13,
    color: colors.gray[700],
  },
  acceptanceText: {
    fontSize: 12,
    color: colors.success,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: 'white',
  },
  input: {
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.gray[900],
  },
  sectionCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  bankInfo: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  bankLabel: {
    fontSize: 13,
    color: colors.gray[600],
  },
  bankValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[900],
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  serviceLabel: {
    fontSize: 14,
    color: colors.gray[900],
    fontWeight: '500',
  },
  statusRow: {
    marginBottom: spacing.lg,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: 'white',
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[700],
  },
  statusButtonTextActive: {
    color: 'white',
  },
  hoursSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  hoursLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  hoursRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 11,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
  },
  logoutButton: {
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  footer: {
    height: spacing.xl,
  },
});
