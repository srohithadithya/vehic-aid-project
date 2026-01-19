import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

const VEHICLE_TYPES = [
    { value: 'TWO_WHEELER', label: 'Two Wheeler', icon: '🏍️', desc: 'Bike/Scooter' },
    { value: 'THREE_WHEELER', label: 'Three Wheeler', icon: '🛺', desc: 'Auto Rickshaw' },
    { value: 'FOUR_WHEELER', label: 'Four Wheeler', icon: '🚗', desc: 'Car/Sedan' },
    { value: 'SUV', label: 'SUV', icon: '🚙', desc: 'Sport Utility' },
    { value: 'VAN', label: 'Van', icon: '🚐', desc: 'Minivan/Cargo' },
    { value: 'TRUCK', label: 'Truck', icon: '🚛', desc: 'Commercial' },
    { value: 'HEAVY_VEHICLE', label: 'Heavy Vehicle', icon: '🚌', desc: 'Bus/Heavy Truck' },
];

export default function VehicleTypeSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Vehicle Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {VEHICLE_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type.value}
                        style={[
                            styles.typeCard,
                            value === type.value && styles.typeCardSelected,
                        ]}
                        onPress={() => onChange(type.value)}
                    >
                        <Text style={styles.icon}>{type.icon}</Text>
                        <Text style={[
                            styles.typeLabel,
                            value === type.value && styles.typeLabelSelected
                        ]}>
                            {type.label}
                        </Text>
                        <Text style={styles.typeDesc}>{type.desc}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#111827',
    },
    scrollView: {
        flexDirection: 'row',
    },
    typeCard: {
        width: 120,
        padding: 16,
        marginRight: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    typeCardSelected: {
        borderColor: '#2563eb',
        backgroundColor: '#eff6ff',
    },
    icon: {
        fontSize: 40,
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
        color: '#2563eb',
    },
    typeDesc: {
        fontSize: 11,
        color: '#6b7280',
        textAlign: 'center',
    },
});
