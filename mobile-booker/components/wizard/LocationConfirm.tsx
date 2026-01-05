import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useBooking } from '../../src/context/BookingContext';
import { apiClient } from '../../src/api/client';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { LucideMapPin, LucideArrowLeft, LucideCheckCircle, LucideLocateFixed } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LocationConfirm() {
    const { state, dispatch } = useBooking();
    const [submitting, setSubmitting] = useState(false);
    const [region, setRegion] = useState({
        latitude: 12.9716,
        longitude: 77.5946,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [address, setAddress] = useState(state.location.pickup || 'Locating...');
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please enable location permissions to use the map.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const newRegion = {
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setRegion(newRegion);
            reverseGeocode(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            let result = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (result.length > 0) {
                const item = result[0];
                const addr = `${item.name || ''} ${item.street || ''}, ${item.city || ''}`;
                setAddress(addr);
                dispatch({ type: 'SET_LOCATION', payload: { pickup: addr, coordinates: { lat, lng } } });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onRegionChangeComplete = (newRegion: any) => {
        setRegion(newRegion);
        reverseGeocode(newRegion.latitude, newRegion.longitude);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                service_type: state.serviceType,
                pickup_location: address,
                vehicle_details: state.vehicle,
                latitude: region.latitude,
                longitude: region.longitude,
            };

            await apiClient.post('/services/request/', payload);

            Alert.alert(
                'Success!',
                'Your request has been dispatched. A service provider will be with you shortly.',
                [{
                    text: 'View Status', onPress: () => {
                        dispatch({ type: 'RESET' });
                        router.replace('/(tabs)/two');
                    }
                }]
            );
        } catch (error) {
            console.error("Submission failed", error);
            Alert.alert('Error', 'Failed to submit request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={[styles.header, { color: theme.text }]}>Confirm Location</Text>
                <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Drag the map to pinpoint your location</Text>
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={onRegionChangeComplete}
                    showsUserLocation={true}
                />
                <View style={styles.markerFixed}>
                    <LucideMapPin size={40} color={theme.tint} />
                </View>
                <TouchableOpacity
                    style={[styles.locateButton, { backgroundColor: theme.card }]}
                    onPress={async () => {
                        let location = await Location.getCurrentPositionAsync({});
                        setRegion({ ...region, latitude: location.coords.latitude, longitude: location.coords.longitude });
                    }}
                >
                    <LucideLocateFixed size={24} color={theme.tint} />
                </TouchableOpacity>
            </View>

            <View style={[styles.detailsSection, { backgroundColor: theme.background }]}>
                <View style={[styles.addressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <LucideMapPin size={20} color={theme.tint} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Pickup Address"
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.backButton, { borderColor: theme.border }]}
                        onPress={() => dispatch({ type: 'PREV_STEP' })}
                        disabled={submitting}
                    >
                        <LucideArrowLeft size={20} color={theme.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.confirmButton, { backgroundColor: theme.tint }]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.confirmText}>Confirm Booking</Text>
                                <LucideCheckCircle size={20} color="#fff" />
                            </>
                        )}
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
    headerSection: {
        padding: 20,
        paddingTop: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerFixed: {
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
        position: 'absolute',
        top: '50%',
    },
    locateButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    detailsSection: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        marginBottom: 20,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    backButton: {
        width: 55,
        height: 55,
        borderRadius: 15,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        height: 55,
        borderRadius: 15,
    },
    confirmText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
});
