import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Vehicle {
  id: string;
  name: string;
  registration: string;
  year: number;
  color: string;
  mileage: number;
  insurance_expiry?: string;
  service_count: number;
}

type ScreenMode = 'list' | 'add' | 'edit' | 'detail';

export default function VehiclesScreen() {
  const [loading, setLoading] = useState(true);
  const [screenMode, setScreenMode] = useState<ScreenMode>('list');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    registration: '',
    year: new Date().getFullYear(),
    color: '',
    mileage: 0,
  });

  useEffect(() => {
    // Simulate loading vehicles
    setTimeout(() => {
      setVehicles([
        {
          id: '1',
          name: 'Honda Civic 2023',
          registration: 'MH 02 AB 1234',
          year: 2023,
          color: 'Silver',
          mileage: 15000,
          insurance_expiry: '2026-12-31',
          service_count: 3,
        },
        {
          id: '2',
          name: 'Maruti Swift 2021',
          registration: 'MH 02 CD 5678',
          year: 2021,
          color: 'White',
          mileage: 45000,
          insurance_expiry: '2025-09-30',
          service_count: 8,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddVehicle = () => {
    setFormData({
      name: '',
      registration: '',
      year: new Date().getFullYear(),
      color: '',
      mileage: 0,
    });
    setScreenMode('add');
  };

  const handleSaveVehicle = async () => {
    try {
      if (!formData.name || !formData.registration) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (screenMode === 'add') {
        const newVehicle: Vehicle = {
          id: String(vehicles.length + 1),
          ...formData,
          service_count: 0,
        };
        setVehicles([...vehicles, newVehicle]);
        Alert.alert('Success', 'Vehicle added successfully!');
      }
      setScreenMode('list');
    } catch (error) {
      Alert.alert('Error', 'Failed to save vehicle');
    }
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => {
            setVehicles(vehicles.filter(v => v.id !== vehicleId));
            setScreenMode('list');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => {
        setSelectedVehicle(item);
        setScreenMode('detail');
      }}
    >
      <View style={styles.vehicleContent}>
        <View style={styles.vehicleIcon}>
          <Ionicons name="car" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={[typography.body, { fontWeight: '600' }]}>
            {item.name}
          </Text>
          <Text style={[typography.caption, { color: colors.gray[500], marginTop: spacing.xs }]}>
            {item.registration}
          </Text>
          <View style={styles.vehicleStats}>
            <View style={styles.statBadge}>
              <Ionicons name="speedometer" size={12} color={colors.warning} />
              <Text style={[typography.caption, { marginLeft: spacing.xs }]}>
                {item.mileage}km
              </Text>
            </View>
            <View style={styles.statBadge}>
              <Ionicons name="checkmark-circle" size={12} color={colors.success} />
              <Text style={[typography.caption, { marginLeft: spacing.xs }]}>
                {item.service_count} services
              </Text>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (screenMode === 'add') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreenMode('list')}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[typography.h2, { flex: 1, marginLeft: spacing.md }]}>
            Add Vehicle
          </Text>
        </View>

        <Card style={{ marginTop: spacing.lg }}>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Vehicle Name
            </Text>
            <TextInput
              placeholder="e.g., Honda Civic 2023"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.textInput}
            />
          </View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Registration Number
            </Text>
            <TextInput
              placeholder="e.g., MH 02 AB 1234"
              value={formData.registration}
              onChangeText={(text) => setFormData({ ...formData, registration: text })}
              style={styles.textInput}
            />
          </View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Year
            </Text>
            <TextInput
              placeholder="2023"
              keyboardType="number-pad"
              value={String(formData.year)}
              onChangeText={(text) => setFormData({ ...formData, year: parseInt(text) || 0 })}
              style={styles.textInput}
            />
          </View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Color
            </Text>
            <TextInput
              placeholder="e.g., Silver"
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
              style={styles.textInput}
            />
          </View>
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Mileage (km)
            </Text>
            <TextInput
              placeholder="0"
              keyboardType="number-pad"
              value={String(formData.mileage)}
              onChangeText={(text) => setFormData({ ...formData, mileage: parseInt(text) || 0 })}
              style={styles.textInput}
            />
          </View>

          <Button
            title="Save Vehicle"
            onPress={handleSaveVehicle}
            variant="primary"
            style={{ marginBottom: spacing.md }}
          />
          <Button
            title="Cancel"
            onPress={() => setScreenMode('list')}
            variant="outline"
          />
        </Card>
      </ScrollView>
    );
  }

  if (screenMode === 'detail' && selectedVehicle) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreenMode('list')}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[typography.h2, { flex: 1, marginLeft: spacing.md }]}>
            Vehicle Details
          </Text>
        </View>

        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.detailHeader}>
            <View style={styles.detailIcon}>
              <Ionicons name="car" size={32} color={colors.primary} />
            </View>
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={[typography.h3, { marginBottom: spacing.xs }]}>
                {selectedVehicle.name}
              </Text>
              <Text style={[typography.body, { color: colors.gray[500] }]}>
                {selectedVehicle.registration}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>Year</Text>
            <Text style={typography.body}>{selectedVehicle.year}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>Color</Text>
            <Text style={typography.body}>{selectedVehicle.color}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>Mileage</Text>
            <Text style={typography.body}>{selectedVehicle.mileage} km</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>Services Done</Text>
            <Text style={[typography.body, { color: colors.success }]}>
              {selectedVehicle.service_count}
            </Text>
          </View>
          {selectedVehicle.insurance_expiry && (
            <View style={styles.detailRow}>
              <Text style={[typography.caption, { color: colors.gray[500] }]}>Insurance Expiry</Text>
              <Text style={[typography.body, { color: colors.warning }]}>
                {selectedVehicle.insurance_expiry}
              </Text>
            </View>
          )}
        </Card>

        <View style={styles.buttonGroup}>
          <Button
            title="Book Service"
            onPress={() => setScreenMode('list')}
            variant="primary"
            style={{ flex: 1 }}
          />
          <Button
            title="Delete"
            onPress={() => handleDeleteVehicle(selectedVehicle.id)}
            variant="secondary"
            style={{ flex: 1, marginLeft: spacing.md }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2}>My Vehicles</Text>
        <Button
          title="+ Add Vehicle"
          onPress={handleAddVehicle}
          variant="primary"
        />
      </View>

      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="car-outline" size={48} color={colors.gray[300]} />
          <Text style={[typography.subtitle, { color: colors.gray[500], marginTop: spacing.md }]}>
            No vehicles added yet
          </Text>
          <Text style={[typography.caption, { color: colors.gray[400], marginTop: spacing.sm }]}>
            Add your first vehicle to get started
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  vehicleCard: {
    marginBottom: spacing.sm,
  },
  vehicleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 14,
    fontFamily: 'System',
    minHeight: 44,
  },
});
