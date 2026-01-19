import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function EarningsAnalyticsScreen() {
    const [analytics, setAnalytics] = useState({
        totalEarnings: 0,
        todayEarnings: 0,
        weeklyEarnings: 0,
        monthlyEarnings: 0,
        completedJobs: 0,
        avgRating: 0,
        weeklyData: [],
        topServices: [],
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/providers/analytics/`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    };

    const StatCard = ({ icon, label, value, color, trend }: any) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.statContent}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
                {trend && (
                    <Text style={[styles.trend, { color: trend > 0 ? '#10b981' : '#ef4444' }]}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Earnings Analytics</Text>
                <Text style={styles.subtitle}>Track your performance</Text>
            </View>

            {/* Main Earnings Card */}
            <View style={styles.mainCard}>
                <Text style={styles.mainCardLabel}>Total Earnings</Text>
                <Text style={styles.mainCardValue}>₹{analytics.totalEarnings.toLocaleString()}</Text>
                <View style={styles.mainCardStats}>
                    <View style={styles.mainCardStat}>
                        <Text style={styles.mainCardStatLabel}>Today</Text>
                        <Text style={styles.mainCardStatValue}>₹{analytics.todayEarnings}</Text>
                    </View>
                    <View style={styles.mainCardStat}>
                        <Text style={styles.mainCardStatLabel}>This Week</Text>
                        <Text style={styles.mainCardStatValue}>₹{analytics.weeklyEarnings}</Text>
                    </View>
                    <View style={styles.mainCardStat}>
                        <Text style={styles.mainCardStatLabel}>This Month</Text>
                        <Text style={styles.mainCardStatValue}>₹{analytics.monthlyEarnings}</Text>
                    </View>
                </View>
            </View>

            {/* KPI Cards */}
            <View style={styles.kpiGrid}>
                <StatCard
                    icon="briefcase"
                    label="Completed Jobs"
                    value={analytics.completedJobs}
                    color="#3b82f6"
                    trend={8}
                />
                <StatCard
                    icon="star"
                    label="Average Rating"
                    value={analytics.avgRating.toFixed(1)}
                    color="#f59e0b"
                    trend={5}
                />
                <StatCard
                    icon="trending-up"
                    label="Acceptance Rate"
                    value="98%"
                    color="#10b981"
                    trend={2}
                />
                <StatCard
                    icon="time"
                    label="Avg Response"
                    value="12 min"
                    color="#8b5cf6"
                    trend={-5}
                />
            </View>

            {/* Weekly Chart */}
            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Weekly Earnings</Text>
                <View style={styles.chart}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <View key={day} style={styles.chartBar}>
                            <View
                                style={[
                                    styles.bar,
                                    { height: `${Math.random() * 80 + 20}%` }
                                ]}
                            />
                            <Text style={styles.chartLabel}>{day}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Top Services */}
            <View style={styles.servicesCard}>
                <Text style={styles.servicesTitle}>Top Services</Text>
                {[
                    { name: 'Towing', count: 45, percentage: 35, color: '#3b82f6' },
                    { name: 'Flat Tire', count: 38, percentage: 30, color: '#10b981' },
                    { name: 'Battery Jump', count: 25, percentage: 20, color: '#f59e0b' },
                    { name: 'Fuel Delivery', count: 19, percentage: 15, color: '#8b5cf6' },
                ].map((service) => (
                    <View key={service.name} style={styles.serviceItem}>
                        <View style={styles.serviceInfo}>
                            <Text style={styles.serviceName}>{service.name}</Text>
                            <Text style={styles.serviceCount}>{service.count} jobs</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progress,
                                    { width: `${service.percentage}%`, backgroundColor: service.color }
                                ]}
                            />
                        </View>
                    </View>
                ))}
            </View>

            {/* Performance Metrics */}
            <View style={styles.metricsCard}>
                <Text style={styles.metricsTitle}>Performance Metrics</Text>
                <View style={styles.metricsGrid}>
                    <View style={styles.metric}>
                        <Text style={styles.metricValue}>98%</Text>
                        <Text style={styles.metricLabel}>Acceptance Rate</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricValue}>95%</Text>
                        <Text style={styles.metricLabel}>Completion Rate</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricValue}>4.8</Text>
                        <Text style={styles.metricLabel}>Customer Satisfaction</Text>
                    </View>
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
    mainCard: {
        backgroundColor: '#2563eb',
        margin: 16,
        padding: 24,
        borderRadius: 16,
    },
    mainCardLabel: {
        color: '#dbeafe',
        fontSize: 14,
        marginBottom: 8,
    },
    mainCardValue: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    mainCardStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mainCardStat: {
        flex: 1,
    },
    mainCardStatLabel: {
        color: '#dbeafe',
        fontSize: 12,
    },
    mainCardStatValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 4,
    },
    kpiGrid: {
        paddingHorizontal: 16,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statContent: {
        marginLeft: 16,
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 4,
    },
    trend: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    chartCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 150,
        alignItems: 'flex-end',
    },
    chartBar: {
        flex: 1,
        alignItems: 'center',
    },
    bar: {
        width: '70%',
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
    chartLabel: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 8,
    },
    servicesCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
    },
    servicesTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    serviceItem: {
        marginBottom: 16,
    },
    serviceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 14,
        fontWeight: '500',
    },
    serviceCount: {
        fontSize: 14,
        color: '#6b7280',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 4,
    },
    progress: {
        height: '100%',
        borderRadius: 4,
    },
    metricsCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
    },
    metricsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metric: {
        flex: 1,
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    metricLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
        textAlign: 'center',
    },
});
