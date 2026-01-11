import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '../src/api/client';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideTruck, LucidePhone, LucideMessageSquare, LucideChevronLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function TrackingScreen() {
    const { requestId, providerName } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [providerCoords, setProviderCoords] = useState({
        latitude: 12.9816,
        longitude: 77.6046,
    });

    const [customerCoords] = useState({
        latitude: 12.9716,
        longitude: 77.5946,
    });

    // Poll for status updates
    useEffect(() => {
        if (!requestId) return;

        const fetchStatus = async () => {
            try {
                const response = await apiClient.get(`/services/request/${requestId}/`);
                const data = response.data;

                // In a real app with specialized endpoints, we'd get lat/lng here
                // For now, if status is DISPATCHED/ARRIVED, we might mock provider movement or read 'provider_location' if available
                if (data.provider_location) {
                    setProviderCoords({
                        latitude: data.provider_location.latitude,
                        longitude: data.provider_location.longitude
                    });
                } else if (data.status === 'DISPATCHED') {
                    // Fallback simulation if backend doesn't send live coords yet
                    setProviderCoords(prev => ({
                        latitude: prev.latitude - 0.0001,
                        longitude: prev.longitude - 0.0001,
                    }));
                }
            } catch (err) {
                console.log("Polling error", err);
            }
        };

        const interval = setInterval(fetchStatus, 5000);
        fetchStatus(); // Initial call

        return () => clearInterval(interval);
    }, [requestId]);

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 12.9750,
                    longitude: 77.6000,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                <Marker coordinate={customerCoords} title="Your Location">
                    <View style={[styles.marker, { backgroundColor: theme.tint }]}>
                        <View style={styles.markerInner} />
                    </View>
                </Marker>

                <Marker coordinate={providerCoords} title="Provider">
                    <View style={[styles.providerMarker, { backgroundColor: '#10b981' }]}>
                        <LucideTruck size={20} color="#fff" />
                    </View>
                </Marker>

                <Polyline
                    coordinates={[providerCoords, customerCoords]}
                    strokeColor={theme.tint}
                    strokeWidth={3}
                    lineDashPattern={[5, 5]}
                />
            </MapView>

            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: theme.card }]}
                onPress={() => router.back()}
            >
                <LucideChevronLeft size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.providerInfo}>
                    <View style={[styles.avatar, { backgroundColor: theme.tint + '20' }]}>
                        <Text style={[styles.avatarText, { color: theme.tint }]}>
                            {String(providerName || 'P').charAt(0)}
                        </Text>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={[styles.name, { color: theme.text }]}>{providerName || 'Rahul Sharma'}</Text>
                        <Text style={[styles.eta, { color: theme.tabIconDefault }]}>Arriving in 8 mins</Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.background }]}>
                        <LucidePhone size={24} color={theme.tint} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.background }]}>
                        <LucideMessageSquare size={24} color={theme.tint} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.cancelButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
                        onPress={() => Alert.alert('Cancel Request', 'Are you sure?')}
                    >
                        <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: width,
        height: height,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    marker: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    providerMarker: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    detailsCard: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        elevation: 10,
    },
    providerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    nameContainer: {
        marginLeft: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eta: {
        fontSize: 14,
        marginTop: 2,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionButton: {
        width: 55,
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        flex: 1,
        marginLeft: 15,
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
