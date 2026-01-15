import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiClient } from '../src/api/client';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideCar, LucidePlus, LucideTrash2, LucideChevronLeft, LucideCheckCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, Layout } from 'react-native-reanimated';

interface Vehicle {
    id: number;
    make: string;
    model: string;
    license_plate: string;
    fuel_type: string;
}

export default function VehiclesScreen() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ make: '', model: '', license_plate: '', fuel_type: 'PETROL' });

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const fetchVehicles = async () => {
        try {
            const res = await apiClient.get('/services/vehicles/');
            const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setVehicles(data);
        } catch (err) {
            Alert.alert('Error', 'Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleAddVehicle = async () => {
        if (!newVehicle.make || !newVehicle.model || !newVehicle.license_plate) {
            Alert.alert('Missing Info', 'Please fill all fields');
            return;
        }
        try {
            await apiClient.post('/services/vehicles/', newVehicle);
            setShowAddForm(false);
            setNewVehicle({ make: '', model: '', license_plate: '', fuel_type: 'PETROL' });
            fetchVehicles();
            Alert.alert('Success', 'Vehicle added successfully');
        } catch (err) {
            Alert.alert('Error', 'Failed to add vehicle');
        }
    };

    const handleDeleteVehicle = async (id: number) => {
        Alert.alert('Delete Vehicle', 'Are you sure?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await apiClient.delete(`/services/vehicles/${id}/`);
                        fetchVehicles();
                    } catch (err) {
                        Alert.alert('Error', 'Failed to delete vehicle');
                    }
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>My Vehicles</Text>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 50 }} />
                ) : (
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        {vehicles.length === 0 && !showAddForm ? (
                            <View style={styles.emptyContainer}>
                                <LucideCar size={60} color={theme.tabIconDefault} />
                                <Text style={[styles.emptyText, { color: theme.tabIconDefault }]}>No vehicles registered</Text>
                            </View>
                        ) : (
                            vehicles.map((v, index) => (
                                <Animated.View
                                    key={v.id}
                                    entering={FadeInRight.delay(index * 100)}
                                    layout={Layout.springify()}
                                    style={[styles.vehicleCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                                >
                                    <View style={styles.vehicleInfo}>
                                        <LucideCar size={32} color={theme.tint} />
                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={[styles.vehicleName, { color: theme.text }]}>{v.make} {v.model}</Text>
                                            <Text style={[styles.licensePlate, { color: theme.tabIconDefault }]}>{v.license_plate}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => handleDeleteVehicle(v.id)}>
                                        <LucideTrash2 size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </Animated.View>
                            ))
                        )}

                        {showAddForm && (
                            <Animated.View entering={FadeIn} style={[styles.form, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <Text style={[styles.formTitle, { color: theme.text }]}>Add New Vehicle</Text>
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                    placeholder="Make (e.g. Maruti)"
                                    placeholderTextColor={theme.tabIconDefault}
                                    value={newVehicle.make}
                                    onChangeText={(t) => setNewVehicle({ ...newVehicle, make: t })}
                                />
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                    placeholder="Model (e.g. Swift)"
                                    placeholderTextColor={theme.tabIconDefault}
                                    value={newVehicle.model}
                                    onChangeText={(t) => setNewVehicle({ ...newVehicle, model: t })}
                                />
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                    placeholder="License Plate (e.g. KA01AB1234)"
                                    placeholderTextColor={theme.tabIconDefault}
                                    value={newVehicle.license_plate}
                                    onChangeText={(t) => setNewVehicle({ ...newVehicle, license_plate: t.toUpperCase() })}
                                    autoCapitalize="characters"
                                />
                                <View style={styles.formButtons}>
                                    <TouchableOpacity style={[styles.cancelBtn]} onPress={() => setShowAddForm(false)}>
                                        <Text style={{ color: theme.tabIconDefault }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.tint }]} onPress={handleAddVehicle}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Vehicle</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        )}
                    </ScrollView>
                )}
            </View>

            {!showAddForm && (
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.tint }]}
                    onPress={() => setShowAddForm(true)}
                >
                    <LucidePlus size={24} color="#fff" />
                    <Text style={styles.fabText}>Add Vehicle</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
    },
    vehicleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 15,
    },
    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    licensePlate: {
        fontSize: 14,
        marginTop: 2,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        left: 20,
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    fabText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    form: {
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        marginTop: 0,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 15,
        marginTop: 10,
    },
    cancelBtn: {
        padding: 15,
    },
    saveBtn: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 12,
    }
});
