import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VEHICLE_TYPES = [
    { value: 'TWO_WHEELER', label: 'Two Wheeler', icon: '🏍️', desc: 'Bike/Scooter' },
    { value: 'THREE_WHEELER', label: 'Three Wheeler', icon: '🛺', desc: 'Auto Rickshaw' },
    { value: 'FOUR_WHEELER', label: 'Four Wheeler', icon: '🚗', desc: 'Car/Sedan' },
    { value: 'SUV', label: 'SUV', icon: '🚙', desc: 'Sport Utility' },
    { value: 'VAN', label: 'Van', icon: '🚐', desc: 'Minivan/Cargo' },
    { value: 'TRUCK', label: 'Truck', icon: '🚛', desc: 'Commercial' },
    { value: 'HEAVY_VEHICLE', label: 'Heavy Vehicle', icon: '🚌', desc: 'Bus/Heavy Truck' },
];

export default function VehicleCapabilitiesScreen() {
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['FOUR_WHEELER']);

    const toggleVehicleType = (type: string) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Vehicle Capabilities</Text>
                <Text style={styles.subtitle}>
                    Select the types of vehicles you can service
                </Text>
            </View>

            <View style={styles.grid}>
                {VEHICLE_TYPES.map((type) => {
                    const isSelected = selectedTypes.includes(type.value);
                    return (
                        <TouchableOpacity
                            key={type.value}
                            style={[
                                styles.typeCard,
                                isSelected && styles.typeCardSelected,
                            ]}
                            onPress={() => toggleVehicleType(type.value)}
                        >
                            {isSelected && (
                                <View style={styles.checkmark}>
                                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                                </View>
                            )}
                            <Text style={styles.icon}>{type.icon}</Text>
                            <Text style={[
                                styles.typeLabel,
                                isSelected && styles.typeLabelSelected
                            ]}>
                                {type.label}
                            </Text>
                            <Text style={styles.typeDesc}>{type.desc}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color="#2563eb" />
                <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Selected: {selectedTypes.length} types</Text>
                    <Text style={styles.infoDesc}>
                        You'll receive requests only for selected vehicle types
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
    },
    typeCard: {
        width: '48%',
        padding: 16,
        marginBottom: 12,
        marginRight: '2%',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
        alignItems: 'center',
        position: 'relative',
    },
    typeCardSelected: {
        borderColor: '#10b981',
        backgroundColor: '#f0fdf4',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    icon: {
        fontSize: 48,
        marginBottom: 8,
    },
    typeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        marginBottom: 4,
    },
    typeLabelSelected: {
        color: '#059669',
    },
    typeDesc: {
        fontSize: 11,
        color: '#6b7280',
        textAlign: 'center',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#eff6ff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    infoText: {
        marginLeft: 12,
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 4,
    },
    infoDesc: {
        fontSize: 14,
        color: '#3b82f6',
    },
});
