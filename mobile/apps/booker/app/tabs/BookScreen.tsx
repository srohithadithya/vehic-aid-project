import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';
import { Ionicons } from '@expo/vector-icons';

// VehicAid Service & Vehicle Types - Complete Definitions
const VEHICLE_TYPES = [
  { id: 'TWO_WHEELER', name: '🏍️ Two Wheeler', desc: 'Bike/Scooter', emoji: '🏍️' },
  { id: 'THREE_WHEELER', name: '🛺 Three Wheeler', desc: 'Auto Rickshaw', emoji: '🛺' },
  { id: 'FOUR_WHEELER', name: '🚗 Four Wheeler', desc: 'Car/Sedan', emoji: '🚗' },
  { id: 'SUV', name: '🚙 SUV', desc: 'Sport Utility Vehicle', emoji: '🚙' },
  { id: 'VAN', name: '🚐 Van', desc: 'Minivan/Cargo', emoji: '🚐' },
  { id: 'TRUCK', name: '🚛 Truck', desc: 'Light/Medium Commercial', emoji: '🚛' },
];

// All 7 Service Types with dynamic pricing
const SERVICE_TYPES = [
  { id: 'TOWING', name: '🚗 Towing', desc: 'Basic towing service' },
  { id: 'FLATBED_TOWING', name: '🚚 Flatbed Towing', desc: 'For damaged vehicles' },
  { id: 'MECHANIC', name: '🔧 Mechanic', desc: 'On-site mechanical repair' },
  { id: 'FUEL_DELIVERY', name: '⛽ Fuel Delivery', desc: 'Emergency fuel delivery' },
  { id: 'BATTERY_JUMP', name: '🔋 Battery Jump', desc: 'Jumpstart service' },
  { id: 'LOCKOUT', name: '🔐 Lockout', desc: 'Vehicle lockout assistance' },
  { id: 'FLAT_TIRE', name: '🛞 Flat Tire', desc: 'Tire repair/replacement' },
  { id: 'REPLACEMENT_VEHICLE', name: '🚗 Replacement Vehicle', desc: 'Temporary rental during service' },
];

// Dynamic Pricing Matrix: Vehicle Type × Service Type
const PRICING_CONFIG: Record<string, Record<string, { base: number; perKm: number; includedKm: number }>> = {
  TWO_WHEELER: {
    TOWING: { base: 199, perKm: 20, includedKm: 5 },
    FLATBED_TOWING: { base: 349, perKm: 25, includedKm: 5 },
    MECHANIC: { base: 99, perKm: 15, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 15, includedKm: 5 },
    BATTERY_JUMP: { base: 149, perKm: 15, includedKm: 5 },
    LOCKOUT: { base: 149, perKm: 15, includedKm: 5 },
    FLAT_TIRE: { base: 99, perKm: 15, includedKm: 5 },
    REPLACEMENT_VEHICLE: { base: 1500, perKm: 0, includedKm: 0 },
  },
  THREE_WHEELER: {
    TOWING: { base: 249, perKm: 25, includedKm: 5 },
    FLATBED_TOWING: { base: 449, perKm: 30, includedKm: 5 },
    MECHANIC: { base: 149, perKm: 20, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 199, perKm: 20, includedKm: 5 },
    LOCKOUT: { base: 199, perKm: 20, includedKm: 5 },
    FLAT_TIRE: { base: 199, perKm: 20, includedKm: 5 },
    REPLACEMENT_VEHICLE: { base: 1500, perKm: 0, includedKm: 0 },
  },
  FOUR_WHEELER: {
    TOWING: { base: 249, perKm: 25, includedKm: 5 },
    FLATBED_TOWING: { base: 449, perKm: 35, includedKm: 5 },
    MECHANIC: { base: 349, perKm: 25, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 249, perKm: 25, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 25, includedKm: 5 },
    FLAT_TIRE: { base: 249, perKm: 25, includedKm: 5 },
    REPLACEMENT_VEHICLE: { base: 1500, perKm: 0, includedKm: 0 },
  },
  SUV: {
    TOWING: { base: 299, perKm: 25, includedKm: 5 },
    FLATBED_TOWING: { base: 499, perKm: 40, includedKm: 5 },
    MECHANIC: { base: 349, perKm: 30, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 249, perKm: 30, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 30, includedKm: 5 },
    FLAT_TIRE: { base: 249, perKm: 30, includedKm: 5 },
    REPLACEMENT_VEHICLE: { base: 1500, perKm: 0, includedKm: 0 },
  },
  VAN: {
    TOWING: { base: 349, perKm: 30, includedKm: 5 },
    FLATBED_TOWING: { base: 499, perKm: 45, includedKm: 5 },
    MECHANIC: { base: 399, perKm: 40, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 299, perKm: 35, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 35, includedKm: 5 },
    FLAT_TIRE: { base: 249, perKm: 35, includedKm: 5 },
    REPLACEMENT_VEHICLE: { base: 1500, perKm: 0, includedKm: 0 },
  },
  TRUCK: {
    TOWING: { base: 499, perKm: 40, includedKm: 5 },
    FLATBED_TOWING: { base: 699, perKm: 50, includedKm: 5 },
    MECHANIC: { base: 399, perKm: 40, includedKm: 5 },
    FUEL_DELIVERY: { base: 69, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 349, perKm: 40, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 40, includedKm: 5 },
    FLAT_TIRE: { base: 299, perKm: 40, includedKm: 5 },
    REPLACEMENT_VEHICLE: { base: 1500, perKm: 0, includedKm: 0 },
  },
};

interface BookingData {
  step: number;
  vehicle_type?: string;
  service_type?: string;
  description?: string;
  location?: string;
  distance_km: number;
  estimated_price: number;
}

const STEPS = [
  { number: 1, title: 'Select Vehicle', icon: 'car' },
  { number: 2, title: 'Choose Service', icon: 'tools' },
  { number: 3, title: 'Details', icon: 'document' },
  { number: 4, title: 'Location', icon: 'location' },
  { number: 5, title: 'Review', icon: 'checkmark-circle' },
  { number: 6, title: 'Payment', icon: 'card' },
];

// Calculate price based on vehicle type, service type, and distance
function calculatePrice(vehicleType: string, serviceType: string, distanceKm: number = 5): number {
  const config = PRICING_CONFIG[vehicleType]?.[serviceType];
  if (!config) return 0;

  const basePrice = config.base;
  const chargeableDistance = Math.max(0, distanceKm - config.includedKm);
  const distanceCharge = chargeableDistance * config.perKm;
  const subtotal = basePrice + distanceCharge;

  // Apply 18% tax
  const tax = (subtotal * 18) / 100;
  return Math.round(subtotal + tax);
}

export default function BookScreen() {
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    step: 1,
    distance_km: 5,
    estimated_price: 0,
  });

  const handleNextStep = () => {
    if (bookingData.step < 6) {
      setBookingData({ ...bookingData, step: bookingData.step + 1 });
    }
  };

  const handlePrevStep = () => {
    if (bookingData.step > 1) {
      setBookingData({ ...bookingData, step: bookingData.step - 1 });
    }
  };

  const handleSubmitBooking = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        'Success! 🎉',
        `Service booking for ${SERVICE_TYPES.find(s => s.id === bookingData.service_type)?.name} confirmed! A provider will be assigned shortly.`,
        [{ text: 'OK', onPress: () => setBookingData({ step: 1, distance_km: 5, estimated_price: 0 }) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = bookingData.step;

    switch (step) {
      case 1:
        return (
          <View>
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>
              Select Your Vehicle
            </Text>
            {VEHICLE_TYPES.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleCard,
                  bookingData.vehicle_type === vehicle.id && styles.vehicleCardSelected,
                ]}
                onPress={() => setBookingData({ ...bookingData, vehicle_type: vehicle.id })}
              >
                <View style={styles.vehicleInfo}>
                  <Text style={[typography.body, { fontSize: 28, marginRight: spacing.md }]}>
                    {vehicle.emoji}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.body, { fontWeight: '600' }]}>
                      {vehicle.name}
                    </Text>
                    <Text style={[typography.caption, { color: colors.gray[500] }]}>
                      {vehicle.desc}
                    </Text>
                  </View>
                </View>
                {bookingData.vehicle_type === vehicle.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>
              Choose Service (All 7 Services Available)
            </Text>
            <Text style={[typography.caption, { color: colors.gray[500], marginBottom: spacing.md }]}>
              For: {VEHICLE_TYPES.find(v => v.id === bookingData.vehicle_type)?.name}
            </Text>
            {SERVICE_TYPES.map((service) => {
              const price = bookingData.vehicle_type
                ? calculatePrice(bookingData.vehicle_type, service.id, bookingData.distance_km)
                : 0;

              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    bookingData.service_type === service.id && styles.serviceCardSelected,
                  ]}
                  onPress={() => {
                    setBookingData({
                      ...bookingData,
                      service_type: service.id,
                      estimated_price: price,
                    });
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.body, { fontWeight: '600' }]}>
                      {service.name}
                    </Text>
                    <Text style={[typography.caption, { color: colors.gray[500], marginTop: spacing.xs }]}>
                      {service.desc}
                    </Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
                      ₹{price}
                    </Text>
                  </View>
                  {bookingData.service_type === service.id && (
                    <Ionicons name="checkmark" size={20} color={colors.success} style={{ marginLeft: spacing.md }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>
              Describe the Issue
            </Text>
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
                Problem Description
              </Text>
              <TextInput
                placeholder="Describe what's wrong with your vehicle..."
                value={bookingData.description || ''}
                onChangeText={(text) => setBookingData({ ...bookingData, description: text })}
                multiline
                numberOfLines={4}
                style={styles.textInput}
              />
            </View>
            <Text style={[typography.caption, { color: colors.gray[500], marginTop: spacing.md }]}>
              Service Type: {SERVICE_TYPES.find(s => s.id === bookingData.service_type)?.name}
            </Text>
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>
              Service Location & Distance
            </Text>
            <Card style={styles.locationCard}>
              <View style={styles.locationContent}>
                <Ionicons name="location" size={24} color={colors.primary} />
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text style={typography.body}>📍 Current Location</Text>
                  <Text style={[typography.caption, { color: colors.gray[500], marginTop: spacing.xs }]}>
                    Mumbai, Maharashtra
                  </Text>
                </View>
              </View>
            </Card>
            <View style={{ marginTop: spacing.lg }}>
              <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
                Distance from provider (km)
              </Text>
              <TextInput
                placeholder="5"
                keyboardType="decimal-pad"
                value={String(bookingData.distance_km)}
                onChangeText={(text) => {
                  const distance = parseFloat(text) || 5;
                  setBookingData({ ...bookingData, distance_km: distance });
                  // Update price based on distance
                  if (bookingData.vehicle_type && bookingData.service_type) {
                    const newPrice = calculatePrice(bookingData.vehicle_type, bookingData.service_type, distance);
                    setBookingData(prev => ({ ...prev, estimated_price: newPrice }));
                  }
                }}
                style={styles.textInput}
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View>
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>
              Review Your Booking
            </Text>
            <Card style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>Vehicle</Text>
                <Text style={[typography.body, { fontWeight: '600' }]}>
                  {VEHICLE_TYPES.find(v => v.id === bookingData.vehicle_type)?.name}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.reviewRow}>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>Service</Text>
                <Text style={[typography.body, { fontWeight: '600' }]}>
                  {SERVICE_TYPES.find(s => s.id === bookingData.service_type)?.name}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.reviewRow}>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>Distance</Text>
                <Text style={[typography.body, { fontWeight: '600' }]}>
                  {bookingData.distance_km} km
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.reviewRow}>
                <Text style={[typography.subtitle, { fontWeight: '700' }]}>Total (incl. 18% tax)</Text>
                <Text style={[typography.h2, { color: colors.primary }]}>
                  ₹{bookingData.estimated_price}
                </Text>
              </View>
            </Card>
          </View>
        );

      case 6:
        return (
          <View>
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>
              Select Payment Method
            </Text>
            <TouchableOpacity style={styles.paymentCard}>
              <Ionicons name="wallet" size={24} color={colors.warning} />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={typography.body}>Wallet Balance</Text>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>₹500 available</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.paymentCard, { marginTop: spacing.md }]}>
              <Ionicons name="card" size={24} color={colors.primary} />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={typography.body}>Credit/Debit Card</Text>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>Visa •••• 1234</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.paymentCard, { marginTop: spacing.md }]}>
              <Ionicons name="logo-usd" size={24} color={colors.secondary} />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={typography.body}>UPI / Google Pay</Text>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>Fast & Secure</Text>
              </View>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress Steps */}
      <View style={styles.stepsContainer}>
        {STEPS.map((s, idx) => (
          <View key={s.number} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                s.number <= bookingData.step && styles.stepCircleActive,
              ]}
            >
              <Ionicons
                name={s.icon as any}
                size={16}
                color={s.number <= bookingData.step ? colors.white : colors.gray[400]}
              />
            </View>
            {idx < STEPS.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  s.number < bookingData.step && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <Text style={[typography.caption, { color: colors.gray[500], marginBottom: spacing.lg, textAlign: 'center' }]}>
        Step {bookingData.step} of {STEPS.length}: {STEPS.find(s => s.number === bookingData.step)?.title}
      </Text>

      {/* Step Content */}
      <Card style={{ marginBottom: spacing.lg }}>
        {renderStepContent()}
      </Card>

      {/* Navigation Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          title="← Back"
          onPress={handlePrevStep}
          variant="outline"
          style={{ flex: 1, marginRight: spacing.md }}
          disabled={bookingData.step === 1}
        />
        {bookingData.step === 6 ? (
          <Button
            title={loading ? 'Processing...' : 'Confirm Booking'}
            onPress={handleSubmitBooking}
            variant="primary"
            style={{ flex: 1 }}
            disabled={loading}
          />
        ) : (
          <Button
            title="Next →"
            onPress={handleNextStep}
            variant="primary"
            style={{ flex: 1 }}
          />
        )}
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
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepLine: {
    position: 'absolute',
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: colors.gray[200],
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  vehicleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  serviceCardSelected: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  priceTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
    marginRight: spacing.md,
  },
  locationCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCard: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  buttonGroup: {
    flexDirection: 'row',
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
