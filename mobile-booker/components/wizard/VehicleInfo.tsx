import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { LucideCar, LucideHash, LucideArrowLeft, LucideArrowRight } from 'lucide-react-native';

export default function VehicleInfo() {
    const { state, dispatch } = useBooking();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [make, setMake] = useState(state.vehicle?.make || '');
    const [model, setModel] = useState(state.vehicle?.model || '');
    const [plate, setPlate] = useState(state.vehicle?.licensePlate || '');

    const handleNext = () => {
        dispatch({
            type: 'SET_VEHICLE',
            payload: { make, model, licensePlate: plate }
        });
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.header, { color: theme.text }]}>Vehicle Details</Text>
            <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Tell us about your vehicle</Text>

            <View style={styles.form}>
                <View style={[styles.inputGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <LucideCar size={20} color={theme.tint} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Make (e.g. Toyota)"
                        placeholderTextColor={theme.tabIconDefault}
                        value={make}
                        onChangeText={setMake}
                    />
                </View>

                <View style={[styles.inputGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <LucideCar size={20} color={theme.tint} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Model (e.g. Camry)"
                        placeholderTextColor={theme.tabIconDefault}
                        value={model}
                        onChangeText={setModel}
                    />
                </View>

                <View style={[styles.inputGroup, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <LucideHash size={20} color={theme.tint} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="License Plate"
                        placeholderTextColor={theme.tabIconDefault}
                        value={plate}
                        onChangeText={setPlate}
                        autoCapitalize="characters"
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.backButton, { borderColor: theme.border }]}
                    onPress={handleBack}
                >
                    <LucideArrowLeft size={20} color={theme.text} />
                    <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: theme.tint }]}
                    onPress={handleNext}
                    disabled={!make || !model || !plate}
                >
                    <Text style={styles.nextText}>Next</Text>
                    <LucideArrowRight size={20} color="#fff" />
                </TouchableOpacity>
            </View>
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
    form: {
        flex: 1,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        marginBottom: 20,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 55,
        borderRadius: 15,
        borderWidth: 1,
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        height: 55,
        borderRadius: 15,
    },
    nextText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
