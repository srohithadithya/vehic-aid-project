import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, FlatList, Dimensions } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../useColorScheme';
import {
    LucideTruck,
    LucideWrench,
    LucideFuel,
    LucideBatteryCharging,
    LucideKey,
    LucideDisc
} from 'lucide-react-native';
import { ServiceType } from '../../src/types';

const SERVICES: { id: ServiceType; label: string; icon: any }[] = [
    { id: 'basic_tow', label: 'Basic Tow', icon: LucideTruck },
    { id: 'flatbed_tow', label: 'Flatbed Tow', icon: LucideTruck }, // Same icon for now
    { id: 'mechanic', label: 'Mechanic', icon: LucideWrench },
    { id: 'fuel_delivery', label: 'Fuel Delivery', icon: LucideFuel },
    { id: 'battery_jump', label: 'Battery Jump', icon: LucideBatteryCharging },
    { id: 'lockout', label: 'Lockout', icon: LucideKey },
    { id: 'tire_change', label: 'Tire Change', icon: LucideDisc },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2;

export default function ServiceSelection() {
    const { state, dispatch } = useBooking();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const selectService = (id: ServiceType) => {
        dispatch({ type: 'SET_SERVICE', payload: id });
        dispatch({ type: 'NEXT_STEP' });
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.header, { color: theme.text }]}>What happened?</Text>
            <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Select the service you need</Text>

            <FlatList
                data={SERVICES}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: state.serviceType === item.id ? theme.tint : theme.border
                                }
                            ]}
                            onPress={() => selectService(item.id)}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: theme.tint + '20' }]}>
                                <Icon size={32} color={theme.tint} />
                            </View>
                            <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: 20,
        padding: 15,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
