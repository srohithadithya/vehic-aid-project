
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Truck, Droplet, BatteryCharging, Wrench, RefreshCcw, Phone } from 'lucide-react-native';
import { theme } from '../theme';
import { apiClient } from '../config/api';

const { width } = Dimensions.get('window');

// Define available services
const SERVICE_OPTIONS = [
  { id: 'TOWING', label: 'Towing', icon: Truck, color: theme.colors.danger },
  { id: 'FLAT_TIRE', label: 'Flat Tire', icon: RefreshCcw, color: theme.colors.primary },
  { id: 'BATTERY', label: 'Battery', icon: BatteryCharging, color: theme.colors.success },
  { id: 'FUEL', label: 'Fuel', icon: Droplet, color: theme.colors.secondary },
  { id: 'REPAIR', label: 'Repair', icon: Wrench, color: '#F59E0B' }, // Amber
];

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const HomeScreen = ({ navigation }: any) => {
  const [region, setRegion] = useState<Region | null>(null); // Initialize as null to wait for location
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('IDLE'); // IDLE, SENDING, DISPATCHED

  // Mock initial location (San Francisco) if permission fails or emulator issues
  // In production, use Geolocation.getCurrentPosition
  useEffect(() => {
    // Simulator/Emulator often needs a hardcoded fallback or specific setup
    // For this demo, we'll set a default if permission logic is complex
    setTimeout(() => {
      setRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleServiceRequest = async (serviceId: string) => {
    if (!region) {
      Alert.alert('Location Missing', 'Waiting for GPS...');
      return;
    }

    setRequestStatus('SENDING');
    try {
      // Agentic Booking Endpoint
      const response = await apiClient.post('/services/agentic-booking/', {
        service_type: serviceId,
        latitude: region.latitude,
        longitude: region.longitude,
        description: `Mobile App Request for ${serviceId}`
      });

      if (response.data.status === 'SUCCESS' || response.data.status === 'DISPATCHED') {
        setRequestStatus('DISPATCHED');
        Alert.alert(
          'Help is on the way!',
          `Provider assigned. Request ID: ${response.data.request_id}`
        );
      } else {
        // Fallback / Manual
        Alert.alert('Request Received', 'Searching for nearby providers...');
        setRequestStatus('IDLE');
      }

    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to send request. Check connection.');
      setRequestStatus('IDLE');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Locating Vehicle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dark Map Style could be applied here with customMapStyle prop */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
        >
          <Marker coordinate={region} title="My Location" pinColor={theme.colors.primary} />
        </MapView>

        {/* Status Overlay */}
        {requestStatus === 'DISPATCHED' && (
          <View style={styles.statusOverlay}>
            <Text style={styles.statusText}>Provider En Route</Text>
          </View>
        )}
      </View>

      <View style={styles.glassPanel}>
        <Text style={styles.panelTitle}>Select Assistance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesList}>
          {SERVICE_OPTIONS.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceButton}
              onPress={() => handleServiceRequest(service.id)}
              disabled={requestStatus === 'SENDING'}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${service.color}20`, borderColor: service.color }]}>
                <service.icon size={28} color={service.color} />
              </View>
              <Text style={styles.serviceLabel}>{service.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.emergencyButton} onPress={() => Alert.alert('Emergency', 'Calling 911...')}>
          <Phone size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.emergencyText}>Emergency Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.textSecondary,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#000', // Map fallback
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  glassPanel: {
    height: 280,
    backgroundColor: theme.colors.background, // Fallback
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: theme.spacing.l,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  panelTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },
  servicesList: {
    paddingRight: 20,
  },
  serviceButton: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  serviceLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.l,
    padding: 16,
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusOverlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: theme.colors.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusText: {
    color: '#000',
    fontWeight: 'bold',
  }
});

export default HomeScreen;