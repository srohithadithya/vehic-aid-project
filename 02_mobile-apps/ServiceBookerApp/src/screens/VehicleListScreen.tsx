import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { PlusCircle, Trash2, Car, Edit3 } from 'lucide-react-native';
import { apiClient } from '../services/apiClient';
import * as Theme from '../styles/Theme';
import Header from '../components/Header';

interface Vehicle {
    id: number;
    license_plate: string;
    make: string;
    model: string;
    fuel_type: string;
}

const mockVehicles: Vehicle[] = [
    { id: 1, license_plate: 'MH01AB1234', make: 'Maruti', model: 'Swift', fuel_type: 'PETROL' },
    { id: 2, license_plate: 'KA05CD5678', make: 'Tata', model: 'Nexon EV', fuel_type: 'EV' },
];

const VehicleListScreen: React.FC = ({ navigation }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            // API call to Django backend: /api/v1/users/vehicles/
            const response = await apiClient.get('users/vehicles/');
            setVehicles(response.data.vehicles || []);
        } catch (error) {
            Alert.alert("Error", "Could not load vehicles. Using mock data.");
            setVehicles(mockVehicles); // Fallback
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleDelete = async (id: number) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to remove this vehicle?",
            [
                { text: "Cancel", style: 'cancel' },
                { text: "Delete", style: 'destructive', onPress: async () => {
                    try {
                        // API call to Django backend: /api/v1/users/vehicles/{id}/
                        await apiClient.delete(`users/vehicles/${id}/`);
                        setVehicles(vehicles.filter(v => v.id !== id));
                        Alert.alert("Success", "Vehicle removed.");
                    } catch (error) {
                        Alert.alert("Error", "Failed to delete vehicle.");
                    }
                }},
            ]
        );
    };

    const renderVehicleItem = ({ item }: { item: Vehicle }) => (
        <View style={styles.vehicleCard}>
            <Car size={24} color={Theme.COLORS.primary} style={styles.icon} />
            <View style={styles.details}>
                <Text style={styles.modelText}>{item.make} {item.model}</Text>
                <Text style={styles.plateText}>Plate: {item.license_plate}</Text>
                <Text style={styles.fuelText}>Fuel: {item.fuel_type}</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Edit", `Editing ${item.model}`)}>
                <Edit3 size={20} color={Theme.COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                <Trash2 size={20} color={Theme.COLORS.danger} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Using a custom header wrapper */}
            <Header title="Manage Vehicles" canGoBack={true} /> 
            
            <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("Add Vehicle", "Navigate to Add Vehicle Form")}>
                <PlusCircle size={20} color={Theme.COLORS.white} />
                <Text style={styles.addButtonText}>Add New Vehicle</Text>
            </TouchableOpacity>

            {isLoading ? (
                <ActivityIndicator style={styles.loadingText} size="large" color={Theme.COLORS.primary} />
            ) : (
                <FlatList
                    data={vehicles}
                    renderItem={renderVehicleItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.emptyText}>No vehicles registered. Please add one.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.COLORS.background,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: Theme.COLORS.success,
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 15,
        marginVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: Theme.COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    vehicleCard: {
        flexDirection: 'row',
        backgroundColor: Theme.COLORS.white,
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    icon: {
        marginRight: 15,
    },
    details: {
        flex: 1,
    },
    modelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.COLORS.darkText,
    },
    plateText: {
        fontSize: 14,
        color: Theme.COLORS.gray,
    },
    fuelText: {
        fontSize: 12,
        color: Theme.COLORS.primary,
        marginTop: 4,
    },
    actionButton: {
        padding: 8,
        marginLeft: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: Theme.COLORS.gray,
        marginTop: 30,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 30,
    }
});

export default VehicleListScreen;