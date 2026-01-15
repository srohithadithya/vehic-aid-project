import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideChevronLeft, LucideUser, LucideNavigation2 } from 'lucide-react-native';
import { apiClient } from '../src/api/client';

const { width, height } = Dimensions.get('window');

export default function ProviderNavigation() {
    const { lat, lng, customer } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const customerCoords = {
        latitude: parseFloat(lat as string) || 12.9716,
        longitude: parseFloat(lng as string) || 77.5946,
    };

    const providerCoords = {
        latitude: customerCoords.latitude + 0.01,
        longitude: customerCoords.longitude + 0.01,
    };

    // Live Location Simulation
    React.useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // In real app: let { coords } = await Location.getCurrentPositionAsync();
                // For simulator verify: we push static or slightly moving coords
                await apiClient.post('/services/provider/update-location/', {
                    latitude: providerCoords.latitude,
                    longitude: providerCoords.longitude,
                    is_available: true
                });
                console.log("Location Pulse Sent");
            } catch (e) {
                console.log("Location Pulse Failed");
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    ...customerCoords,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
            >
                <Marker coordinate={customerCoords} title="Customer">
                    <View style={[styles.marker, { backgroundColor: theme.tint }]}>
                        <LucideUser size={16} color="#fff" />
                    </View>
                </Marker>

                <Marker coordinate={providerCoords} title="You">
                    <View style={[styles.providerMarker, { backgroundColor: '#3b82f6' }]}>
                        <LucideNavigation2 size={20} color="#fff" />
                    </View>
                </Marker>

                <Polyline
                    coordinates={[providerCoords, customerCoords]}
                    strokeColor="#3b82f6"
                    strokeWidth={4}
                />
            </MapView>

            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: theme.card }]}
                onPress={() => router.back()}
            >
                <LucideChevronLeft size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.label, { color: theme.tabIconDefault }]}>NAVIGATING TO</Text>
                <Text style={[styles.name, { color: theme.text }]}>{customer || 'Customer Location'}</Text>
                <View style={styles.divider} />
                <View style={styles.statsRow}>
                    <View>
                        <Text style={[styles.statValue, { color: theme.text }]}>2.4 km</Text>
                        <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Distance</Text>
                    </View>
                    <View>
                        <Text style={[styles.statValue, { color: theme.text }]}>8 min</Text>
                        <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Travel Time</Text>
                    </View>
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
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
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
        borderRadius: 20,
        borderWidth: 1,
        elevation: 10,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 15,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
    },
});
