
// ServiceBookerApp/src/screens/ServiceTrackingScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Clock, RefreshCcw, Home, Car } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import { theme } from '../theme';

// Mock Data Interfaces
interface ServiceData {
    id: number;
    provider_lat: number;
    provider_lng: number;
    customer_lat: number;
    customer_lng: number;
    status: string;
    eta_minutes: number;
    is_exchange_eligible: boolean;
}

const mockServiceData: ServiceData = {
    id: 101,
    provider_lat: 28.62,
    provider_lng: 77.21,
    customer_lat: 28.65,
    customer_lng: 77.20,
    status: 'DISPATCHED',
    eta_minutes: 15,
    is_exchange_eligible: true,
};

const ServiceTrackingScreen: React.FC = ({ route }: any) => {
    // Assuming service ID is passed via navigation parameters
    const serviceId = route.params?.serviceId || mockServiceData.id;

    const [service, setService] = useState<ServiceData>(mockServiceData);

    // --- Core Logic: Fetching Real-Time Updates ---
    const fetchServiceStatus = useCallback(async () => {
        try {
            // API call to fetch live tracking data: /api/v1/services/request/{id}/status/
            const response = await apiClient.get(`services/request/${serviceId}/status/`);
            // Update the state with new provider location, status, and ETA
            setService(response.data);

            // Handle status change for quote approval
            if (response.data.status === 'QUOTE_PENDING') {
                Alert.alert("Quote Pending", "Provider has submitted a quote for approval.");
            }

        } catch (error) {
            console.error("Failed to fetch service status:", error);
        }
    }, [serviceId]);

    useEffect(() => {
        // Poll for updates every 10 seconds (Simulating real-time)
        const interval = setInterval(fetchServiceStatus, 10000);
        fetchServiceStatus();
        return () => clearInterval(interval);
    }, [fetchServiceStatus]);

    // --- Premium Action Handlers ---
    const handleVehicleExchange = () => {
        Alert.alert(
            "Vehicle Exchange",
            "This premium service will arrange a rental vehicle delivered to you.",
            [
                { text: "Cancel", style: 'cancel' },
                { text: "Request Exchange", onPress: () => Alert.alert("Success", "Exchange request initiated.") },
            ]
        );
    };

    const handleVehiclePlacement = () => {
        Alert.alert(
            "Vehicle Placement",
            "Request provider to drive your vehicle to your home/garage after service.",
            [
                { text: "Cancel", style: 'cancel' },
                { text: "Request Placement", onPress: () => Alert.alert("Success", "Placement request initiated.") },
            ]
        );
    };

    const mapRegion = {
        latitude: service.customer_lat,
        longitude: service.customer_lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            {/* Map View */}
            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={mapRegion}
                    region={{
                        ...mapRegion,
                        latitude: (service.customer_lat + service.provider_lat) / 2,
                    }}
                >
                    <Marker coordinate={{ latitude: service.customer_lat, longitude: service.customer_lng }} pinColor={theme.colors.secondary} title="You are here" />
                    <Marker coordinate={{ latitude: service.provider_lat, longitude: service.provider_lng }} pinColor={theme.colors.primary} title="Provider" />
                </MapView>
            </View>

            {/* Status Panel - Glass Effect */}
            <View style={styles.statusPanel}>
                <Text style={styles.statusLabel}>Service Status:</Text>
                <Text style={styles.statusValue}>{service.status.replace('_', ' ')}</Text>

                <View style={styles.etaBox}>
                    <Clock size={16} color="#000" />
                    <Text style={styles.etaText}>ETA: {service.eta_minutes} mins</Text>
                </View>
            </View>

            {/* Premium Options */}
            <View style={styles.optionsContainer}>
                <Text style={styles.optionsTitle}>Post-Service Options</Text>

                {service.is_exchange_eligible && (
                    <TouchableOpacity style={styles.optionButton} onPress={handleVehicleExchange}>
                        <RefreshCcw size={20} color={theme.colors.primary} />
                        <Text style={styles.optionText}>Request Vehicle Exchange</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.optionButton} onPress={handleVehiclePlacement}>
                    <Home size={20} color={theme.colors.primary} />
                    <Text style={styles.optionText}>Request Vehicle Placement</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert("Call", "Calling assigned provider...")}>
                    <Car size={20} color="#000" />
                    <Text style={styles.contactText}>Contact Provider</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    mapContainer: { height: '55%', width: '100%', borderWidth: 1, borderColor: theme.colors.border },
    map: { ...StyleSheet.absoluteFillObject },

    statusPanel: {
        backgroundColor: theme.glass.backgroundColor,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.glass.borderColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: theme.colors.primary,
    },
    statusLabel: { fontSize: 14, color: theme.colors.textSecondary },
    statusValue: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary },

    etaBox: { backgroundColor: theme.colors.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
    etaText: { color: '#000', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },

    optionsContainer: { padding: 20, backgroundColor: theme.colors.surface, flex: 1 },
    optionsTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 5 },

    optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    optionText: { fontSize: 14, color: theme.colors.textSecondary, marginLeft: 15 },

    contactButton: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: theme.borderRadius.m, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    contactText: { color: '#000', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default ServiceTrackingScreen;