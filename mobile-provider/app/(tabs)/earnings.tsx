import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideIndianRupee, LucideTrendingUp, LucideCalendar } from 'lucide-react-native';
import { apiClient } from '../../src/api/client';

const { width } = Dimensions.get('window');

// Mock Data for Chart
const WEEKLY_DATA = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 950 },
    { day: 'Wed', amount: 2100 },
    { day: 'Thu', amount: 800 },
    { day: 'Fri', amount: 1500 },
    { day: 'Sat', amount: 2800 },
    { day: 'Sun', amount: 1900 },
];

export default function EarningsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [stats, setStats] = useState<{ total_earnings: number; weekly_breakdown: any[]; payouts: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                // Fetch real stats from backend
                const response = await apiClient.get('/services/provider/jobs/');
                // Calculate local stats from job history since we don't have a dedicated stats endpoint yet
                const jobs = response.data.filter((j: any) => j.status === 'COMPLETED');

                const total = jobs.reduce((sum: number, j: any) => sum + (parseFloat(j.amount) || 0), 0);

                // Group by day for the last 7 days
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0];
                });

                const breakdown = last7Days.map(dateStr => {
                    const dayJobs = jobs.filter((j: any) => j.created_at.startsWith(dateStr));
                    const dayTotal = dayJobs.reduce((sum: number, j: any) => sum + (parseFloat(j.amount) || 0), 0);
                    const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
                    return { day: dayName, amount: dayTotal };
                });

                setStats({
                    total_earnings: total,
                    weekly_breakdown: breakdown,
                    payouts: jobs.slice(0, 5) // Last 5 completed jobs as "payouts"
                });
            } catch (e) {
                console.error("Failed to fetch earnings", e);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    if (loading) return <View style={[styles.container, { justifyContent: 'center', backgroundColor: theme.background }]}><ActivityIndicator color={theme.tint} /></View>;

    const maxAmount = stats ? Math.max(...stats.weekly_breakdown.map(d => d.amount)) || 1 : 1;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Earnings</Text>
                <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Real-time Revenue</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: theme.tint }]}>
                <View style={styles.summaryContent}>
                    <Text style={styles.summaryLabel}>Total Revenue</Text>
                    <Text style={styles.summaryValue}>₹{stats?.total_earnings.toLocaleString()}</Text>
                </View>
                <View style={styles.iconCircle}>
                    <LucideIndianRupee size={24} color={theme.tint} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Breakdown</Text>
                <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
                    <View style={styles.chartContainer}>
                        {stats?.weekly_breakdown.map((item, index) => {
                            const height = (item.amount / maxAmount) * 150;
                            return (
                                <View key={index} style={styles.barContainer}>
                                    <View style={[styles.bar, { height: Math.max(height, 5), backgroundColor: theme.tint }]} />
                                    <Text style={[styles.dayLabel, { color: theme.tabIconDefault }]}>{item.day}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Jobs (Payouts)</Text>
                {stats?.payouts.map((job, i) => (
                    <View key={i} style={[styles.payoutCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={styles.payoutLeft}>
                            <View style={[styles.payoutIcon, { backgroundColor: theme.background }]}>
                                <LucideCalendar size={20} color={theme.text} />
                            </View>
                            <View>
                                <Text style={[styles.payoutDate, { color: theme.text }]}>{new Date(job.created_at).toLocaleDateString()}</Text>
                                <Text style={[styles.payoutStatus, { color: '#10b981' }]}>Paid</Text>
                            </View>
                        </View>
                        <Text style={[styles.payoutAmount, { color: theme.text }]}>₹{job.amount || 0}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
    },
    summaryCard: {
        borderRadius: 20,
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    summaryContent: {
        flex: 1,
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    summaryValue: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    chartCard: {
        padding: 20,
        borderRadius: 20,
        elevation: 2,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
    },
    barContainer: {
        alignItems: 'center',
        width: 30,
    },
    bar: {
        width: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    payoutCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        marginBottom: 10,
    },
    payoutLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    payoutIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    payoutDate: {
        fontSize: 16,
        fontWeight: '600',
    },
    payoutStatus: {
        fontSize: 12,
        marginTop: 2,
    },
    payoutAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
