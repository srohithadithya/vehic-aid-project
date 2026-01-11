import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideActivity, LucideBattery, LucideGauge, LucideThermometer, LucideZap, LucideAlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HealthScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [refreshing, setRefreshing] = useState(false);

    // Mock IoT Data - In real app, fetch from /vehicles/iot/
    const vehicleHealth = {
        status: 'Good',
        battery: 88,
        tirePressure: { fl: 32, fr: 32, rl: 30, rr: 30 },
        engineTemp: 'Normal',
        nextService: '4,500 km',
        lastScan: 'Just now'
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate fetch
        setTimeout(() => setRefreshing(false), 1500);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
        >
            <View style={styles.header}>
                <LinearGradient
                    colors={['#4ade8020', 'transparent']}
                    style={styles.gradientBg}
                />
                <View style={styles.statusCircle}>
                    <LucideActivity size={50} color="#22c55e" />
                </View>
                <Text style={[styles.statusTitle, { color: theme.text }]}>System Nominal</Text>
                <Text style={{ color: theme.tabIconDefault }}>Last scan: {vehicleHealth.lastScan}</Text>
            </View>

            <View style={styles.grid}>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.cardHeader}>
                        <LucideBattery size={24} color={theme.tint} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Battery</Text>
                    </View>
                    <Text style={[styles.cardValue, { color: theme.text }]}>{vehicleHealth.battery}%</Text>
                    <Text style={[styles.cardSubtext, { color: theme.tabIconDefault }]}>Healthy Voltage</Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.cardHeader}>
                        <LucideThermometer size={24} color="#ef4444" />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Engine</Text>
                    </View>
                    <Text style={[styles.cardValue, { color: theme.text }]}>{vehicleHealth.engineTemp}</Text>
                    <Text style={[styles.cardSubtext, { color: theme.tabIconDefault }]}>Optimal Temp</Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: '100%' }]}>
                    <View style={styles.cardHeader}>
                        <LucideGauge size={24} color="#eab308" />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Tire Pressure (PSI)</Text>
                    </View>
                    <View style={styles.tireGrid}>
                        <View style={styles.tireItem}>
                            <Text style={{ color: theme.tabIconDefault }}>FL</Text>
                            <Text style={[styles.tireValue, { color: theme.text }]}>{vehicleHealth.tirePressure.fl}</Text>
                        </View>
                        <View style={styles.tireItem}>
                            <Text style={{ color: theme.tabIconDefault }}>FR</Text>
                            <Text style={[styles.tireValue, { color: theme.text }]}>{vehicleHealth.tirePressure.fr}</Text>
                        </View>
                        <View style={styles.tireItem}>
                            <Text style={{ color: theme.tabIconDefault }}>RL</Text>
                            <Text style={[styles.tireValue, { color: '#eab308' }]}>{vehicleHealth.tirePressure.rl}</Text>
                        </View>
                        <View style={styles.tireItem}>
                            <Text style={{ color: theme.tabIconDefault }}>RR</Text>
                            <Text style={[styles.tireValue, { color: '#eab308' }]}>{vehicleHealth.tirePressure.rr}</Text>
                        </View>
                    </View>
                    <View style={styles.alertBox}>
                        <LucideAlertTriangle size={16} color="#eab308" style={{ marginRight: 5 }} />
                        <Text style={{ color: '#eab308', fontSize: 12 }}>Rear tires slightly low.</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={[styles.scanButton, { backgroundColor: theme.tint }]}>
                <LucideZap size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.scanButtonText}>Run Full Diagnostics</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: { // Added header style definition
        alignItems: 'center',
        paddingVertical: 40,
        position: 'relative',
    },
    gradientBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    statusCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4ade8020',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#22c55e',
    },
    statusTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
    },
    card: {
        width: '48%',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },
    cardSubtext: {
        fontSize: 12,
        marginTop: 5,
    },
    tireGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    tireItem: {
        alignItems: 'center',
    },
    tireValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    alertBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eab30820',
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
    },
    scanButton: {
        margin: 20,
        height: 60,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
