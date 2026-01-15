import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideChevronLeft, LucideTruck, LucideMapPin, LucideNavigation, LucideLock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { apiClient } from '@/src/api/client';

interface PlacementRequest {
    id: number;
    status: string;
    destination_address: string;
    price: string;
    created_at: string;
}

export default function VehiclePlacementScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [placements, setPlacements] = useState<PlacementRequest[]>([]);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [destination, setDestination] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [placementRes, subRes] = await Promise.all([
                apiClient.get('/services/vehicle-placement/'),
                apiClient.get('/services/subscriptions/active/')
            ]);
            setPlacements(placementRes.data.results || placementRes.data || []);
            const sub = subRes.data;
            setHasSubscription(sub && sub.plan && sub.plan.name !== 'FREE');
        } catch (error) {
            console.log('Placement fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPlacement = async () => {
        if (!destination) {
            Alert.alert('Missing Info', 'Please enter a destination address.');
            return;
        }
        setSubmitting(true);
        try {
            await apiClient.post('/services/vehicle-placement/', {
                destination_address: destination
            });
            Alert.alert('Success', 'Vehicle placement requested! A provider will contact you with pricing.');
            setDestination('');
            fetchData();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Could not request placement.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'IN_PROGRESS': return '#3b82f6';
            case 'REQUESTED': return '#f59e0b';
            default: return theme.tabIconDefault;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Vehicle Placement</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Feature Description */}
                <Animated.View entering={FadeInUp.duration(500)}>
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.infoCard}
                    >
                        <LucideTruck size={32} color="#fff" />
                        <Text style={styles.infoTitle}>Move Your Vehicle</Text>
                        <Text style={styles.infoText}>
                            After service is complete, we can move your vehicle to any location -
                            your home, office, or a preferred garage. Pricing is dynamic based on distance.
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {/* Subscription Check */}
                {!hasSubscription && !loading && (
                    <View style={[styles.lockedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideLock size={24} color={theme.tabIconDefault} />
                        <Text style={[styles.lockedText, { color: theme.text }]}>
                            This feature requires a Standard or Premium subscription
                        </Text>
                        <TouchableOpacity
                            style={[styles.upgradeBtn, { backgroundColor: theme.tint }]}
                            onPress={() => router.push('/subscriptions')}
                        >
                            <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Request Form */}
                {hasSubscription && (
                    <Animated.View entering={FadeInUp.delay(200)} style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Request Placement</Text>

                        <View style={styles.inputGroup}>
                            <LucideNavigation size={20} color={theme.tint} />
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                placeholder="Destination Address (e.g., Home, Office)"
                                placeholderTextColor={theme.tabIconDefault}
                                value={destination}
                                onChangeText={setDestination}
                                multiline
                            />
                        </View>

                        <Text style={[styles.pricingNote, { color: theme.tabIconDefault }]}>
                            💡 Pricing will be determined by the provider based on distance
                        </Text>

                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: theme.tint }]}
                            onPress={handleRequestPlacement}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Request Placement</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Placement History */}
                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Placement History</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} />
                ) : placements.length === 0 ? (
                    <Text style={{ color: theme.tabIconDefault, textAlign: 'center' }}>No placements yet.</Text>
                ) : (
                    placements.map((pl, index) => (
                        <Animated.View
                            key={pl.id}
                            entering={FadeInUp.delay(index * 100)}
                            style={[styles.placementItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                        >
                            <View style={styles.placementHeader}>
                                <LucideMapPin size={18} color={theme.tint} />
                                <Text style={[styles.placementId, { color: theme.text }]}>Placement #{pl.id}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pl.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(pl.status) }]}>{pl.status}</Text>
                                </View>
                            </View>
                            <Text style={[styles.placementDetail, { color: theme.tabIconDefault }]}>
                                Destination: {pl.destination_address}
                            </Text>
                            <Text style={[styles.placementFee, { color: theme.text }]}>
                                Price: ₹{pl.price}
                            </Text>
                        </Animated.View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backButton: { marginRight: 15 },
    title: { fontSize: 24, fontWeight: 'bold' },
    scrollContent: { padding: 20 },
    infoCard: { padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
    infoTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
    infoText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center', lineHeight: 22 },
    lockedCard: { padding: 25, borderRadius: 15, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
    lockedText: { fontSize: 14, textAlign: 'center', marginVertical: 15 },
    upgradeBtn: { paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
    upgradeBtnText: { color: '#fff', fontWeight: 'bold' },
    formCard: { padding: 20, borderRadius: 15, borderWidth: 1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    inputGroup: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
    input: { flex: 1, marginLeft: 10, minHeight: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12 },
    pricingNote: { fontSize: 13, marginBottom: 15, fontStyle: 'italic' },
    submitBtn: { height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    placementItem: { padding: 15, borderRadius: 15, borderWidth: 1, marginBottom: 12 },
    placementHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    placementId: { flex: 1, marginLeft: 10, fontWeight: '600' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: '600' },
    placementDetail: { fontSize: 13, marginBottom: 4 },
    placementFee: { fontSize: 14, fontWeight: '600', marginTop: 8 },
});
