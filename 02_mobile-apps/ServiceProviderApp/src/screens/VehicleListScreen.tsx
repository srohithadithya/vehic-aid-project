import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { PlusCircle, Truck, Edit3 } from 'lucide-react-native';
import apiClient from '../api';
import * as Theme from '../styles/Theme';

interface ServiceVehicle {
    id: number;
    license_plate: string;
    make: string;
    model: string;
    service_type: string; // e.g., Towing, Repair, Fuel Delivery
    is_active: boolean;
}

const mockServiceVehicles: ServiceVehicle[] = [
    { id: 1, license_plate: 'MH04SP001', make: 'Ashok Leyland', model: 'Dyna', service_type: 'TOWING', is_active: true },
    { id: 2, license_plate: 'UP16SP002', make: 'Maruti', model: 'Omni Van', service_type: 'REPAIR', is_active: false },
];

const VehicleListScreen: React.FC = ({ navigation }) => {
    const [vehicles, setVehicles] = useState<ServiceVehicle[]>(mockServiceVehicles);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('users/provider/vehicles/');
            setVehicles(response.data.vehicles || mockServiceVehicles);
        } catch (error) {
            Alert.alert("Error", "Could not load vehicles.");
            setVehicles(mockServiceVehicles); // Fallback
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        Alert.alert(
            "Confirm Change",
            `Set this vehicle to ${currentStatus ? 'Inactive' : 'Active'}?`,
            [
                { text: "Cancel", style: 'cancel' },
                { text: "Confirm", onPress: async () => {
                    try {
                        await apiClient.post(`users/provider/vehicles/${id}/status/`, { is_active: !currentStatus });
                        setVehicles(vehicles.map(v => v.id === id ? { ...v, is_active: !currentStatus } : v));
                    } catch (error) {
                        Alert.alert("Error", "Failed to update status.");
                    }
                }},
            ]
        );
    };

    const renderVehicleItem = ({ item }: { item: ServiceVehicle }) => (
        <View style={styles.vehicleCard}>
            <Truck size={24} color={Theme.COLORS.primary} style={styles.icon} />
            <View style={styles.details}>
                <Text style={styles.modelText}>{item.make} ({item.license_plate})</Text>
                <Text style={styles.plateText}>Service: {item.service_type}</Text>
            </View>
            <Text style={[styles.statusText, item.is_active ? styles.statusActive : styles.statusInactive]}>
                {item.is_active ? 'ACTIVE' : 'INACTIVE'}
            </Text>
            <TouchableOpacity 
                style={[styles.actionButton, item.is_active ? styles.toggleInactiveButton : styles.toggleActiveButton]} 
                onPress={() => handleToggleActive(item.id, item.is_active)}
            >
                <Text style={styles.toggleText}>{item.is_active ? 'Go INACTIVE' : 'Go ACTIVE'}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("Add Vehicle", "Navigate to Vehicle Registration Form")}>
                <PlusCircle size={20} color={Theme.COLORS.white} />
                <Text style={styles.addButtonText}>Register New Service Vehicle</Text>
            </TouchableOpacity>

            {isLoading ? (
                <ActivityIndicator style={styles.loadingText} size="large" color={Theme.COLORS.primary} />
            ) : (
                <FlatList
                    data={vehicles}
                    renderItem={renderVehicleItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.emptyText}>No service vehicles registered.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.COLORS.background, paddingTop: 10 },
    addButton: { flexDirection: 'row', backgroundColor: Theme.COLORS.primaryDark, padding: 15, borderRadius: 8, marginHorizontal: 15, marginVertical: 15, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: Theme.COLORS.white, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    
    vehicleCard: { flexDirection: 'row', backgroundColor: Theme.COLORS.white, padding: 15, marginHorizontal: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center', shadowOpacity: 0.05, elevation: 2 },
    icon: { marginRight: 15, },
    details: { flex: 1, },
    modelText: { fontSize: 16, fontWeight: 'bold', color: Theme.COLORS.darkText, },
    plateText: { fontSize: 14, color: Theme.COLORS.gray, },
    statusText: { fontSize: 12, fontWeight: 'bold', marginRight: 10, padding: 4, borderRadius: 4 },
    statusActive: { color: Theme.COLORS.success, backgroundColor: '#E6F4EA' },
    statusInactive: { color: Theme.COLORS.danger, backgroundColor: '#F8E8E9' },
    
    toggleActiveButton: { backgroundColor: Theme.COLORS.success, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
    toggleInactiveButton: { backgroundColor: Theme.COLORS.danger, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
    toggleText: { color: Theme.COLORS.white, fontSize: 12, fontWeight: 'bold' },
    
    emptyText: { textAlign: 'center', color: Theme.COLORS.gray, marginTop: 30 },
    loadingText: { textAlign: 'center', marginTop: 30 },
});

export default VehicleListScreen;