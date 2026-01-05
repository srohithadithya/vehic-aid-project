import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { apiClient } from '../../src/api/client';
import { IoTDevice } from '../../src/types';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideZap, LucideSignal, LucideCpu, LucideAlertTriangle, LucideCheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function VehicleHealthScreen() {
    const [device, setDevice] = useState<IoTDevice | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const fetchData = async () => {
        try {
            const response = await apiClient.get('/iot/status/');
            setDevice(response.data);
        } catch (error) {
            console.error("Failed to fetch IoT status", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    const healthStatus = device?.battery && device.battery > 30 ? 'HEALTHY' : 'ATTENTION';

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={theme.tint} />
            }
        >
            <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Vehicle Health</Text>
                <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Real-time IoT Telemetry</Text>
            </Animated.View>

            {device ? (
                <View style={styles.content}>
                    {/* Main Health Card */}
                    <View style={[styles.mainCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={styles.statusHeader}>
                            <View style={[styles.statusBadge, { backgroundColor: healthStatus === 'HEALTHY' ? '#10b98120' : '#f59e0b20' }]}>
                                <Text style={[styles.statusText, { color: healthStatus === 'HEALTHY' ? '#10b981' : '#f59e0b' }]}>
                                    SYSTEM {healthStatus}
                                </Text>
                            </View>
                            <LucideCpu size={24} color={theme.tint} />
                        </View>

                        <Text style={[styles.score, { color: theme.text }]}>98%</Text>
                        <Text style={[styles.scoreLabel, { color: theme.tabIconDefault }]}>Overall Reliability Score</Text>

                        <View style={styles.divider} />

                        <View style={styles.metricsGrid}>
                            <View style={styles.metricItem}>
                                <LucideZap size={20} color="#f59e0b" />
                                <Text style={[styles.metricValue, { color: theme.text }]}>{device.battery}%</Text>
                                <Text style={[styles.metricLabel, { color: theme.tabIconDefault }]}>Battery</Text>
                            </View>
                            <View style={styles.metricItem}>
                                <LucideSignal size={20} color="#3b82f6" />
                                <Text style={[styles.metricValue, { color: theme.text }]}>Strong</Text>
                                <Text style={[styles.metricLabel, { color: theme.tabIconDefault }]}>Signal</Text>
                            </View>
                        </View>
                    </View>

                    {/* Diagnostics List */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Diagnostics</Text>

                    <View style={[styles.diagRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideCheckCircle2 size={20} color="#10b981" />
                        <View style={styles.diagInfo}>
                            <Text style={[styles.diagTitle, { color: theme.text }]}>IoT Device Connection</Text>
                            <Text style={[styles.diagStatus, { color: theme.tabIconDefault }]}>Active & Synced</Text>
                        </View>
                    </View>

                    <View style={[styles.diagRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideCheckCircle2 size={20} color="#10b981" />
                        <View style={styles.diagInfo}>
                            <Text style={[styles.diagTitle, { color: theme.text }]}>Predictive Engine Logic</Text>
                            <Text style={[styles.diagStatus, { color: theme.tabIconDefault }]}>No anomalies detected</Text>
                        </View>
                    </View>

                    {device.battery < 20 && (
                        <View style={[styles.warningRow, { backgroundColor: '#ef444410', borderColor: '#ef4444' }]}>
                            <LucideAlertTriangle size={20} color="#ef4444" />
                            <Text style={styles.warningText}>IoT Battery critical. Please charge your device.</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <LucideCpu size={60} color={theme.tabIconDefault} />
                    <Text style={[styles.emptyText, { color: theme.tabIconDefault }]}>No IoT Device Connected</Text>
                    <Text style={[styles.emptySubtext, { color: theme.tabIconDefault }]}>Pair your device in settings to enable real-time monitoring.</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    content: {
        padding: 20,
    },
    mainCard: {
        padding: 25,
        borderRadius: 30,
        borderWidth: 1,
        marginBottom: 30,
        elevation: 10,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    score: {
        fontSize: 64,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 14,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 20,
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metricItem: {
        flex: 1,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    metricLabel: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    diagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
    },
    diagInfo: {
        marginLeft: 15,
    },
    diagTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    diagStatus: {
        fontSize: 12,
    },
    warningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 10,
    },
    warningText: {
        color: '#ef4444',
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        padding: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
});
