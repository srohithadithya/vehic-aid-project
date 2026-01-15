import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideChevronLeft, LucideCar, LucideArrowLeftRight, LucideMapPin, LucideCheck, LucideLock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { apiClient } from '@/src/api/client';
import { useTranslation } from 'react-i18next';

interface ExchangeRequest {
    id: number;
    status: string;
    pickup_location: string;
    return_location: string;
    rental_fee: string;
    created_at: string;
}

export default function VehicleExchangeScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [returnLocation, setReturnLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [exchangeRes, subRes] = await Promise.all([
                apiClient.get('/services/vehicle-exchange/'),
                apiClient.get('/services/subscriptions/active/')
            ]);
            setExchanges(exchangeRes.data.results || exchangeRes.data || []);
            // Check if user has premium subscription with exchange feature
            const sub = subRes.data;
            setHasSubscription(sub && sub.plan && (sub.plan.name === 'PREMIUM' || sub.plan.is_exchange_eligible));
        } catch (error) {
            console.log('Exchange fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestExchange = async () => {
        if (!pickupLocation || !returnLocation) {
            Alert.alert('Missing Info', 'Please enter both pickup and return locations.');
            return;
        }
        setSubmitting(true);
        try {
            await apiClient.post('/services/vehicle-exchange/', {
                pickup_location: pickupLocation,
                return_location: returnLocation
            });
            Alert.alert('Success', 'Vehicle exchange requested! We will contact you shortly.');
            setPickupLocation('');
            setReturnLocation('');
            fetchData();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Could not request exchange.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'PROVIDED': return '#3b82f6';
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
                <Text style={[styles.title, { color: theme.text }]}>Vehicle Exchange</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Feature Description */}
                <Animated.View entering={FadeInUp.duration(500)}>
                    <LinearGradient
                        colors={['#6366f1', '#8b5cf6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.infoCard}
                    >
                        <LucideArrowLeftRight size={32} color="#fff" />
                        <Text style={styles.infoTitle}>Temporary Rental Vehicle</Text>
                        <Text style={styles.infoText}>
                            Get a rental vehicle delivered to your location while your vehicle is being repaired.
                            Once repairs are complete, we'll swap them back!
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {/* Subscription Check */}
                {!hasSubscription && !loading && (
                    <View style={[styles.lockedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideLock size={24} color={theme.tabIconDefault} />
                        <Text style={[styles.lockedText, { color: theme.text }]}>
                            This feature requires a Premium subscription
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
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Request Exchange</Text>

                        <View style={styles.inputGroup}>
                            <LucideMapPin size={20} color={theme.tint} />
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                placeholder="Pickup Location"
                                placeholderTextColor={theme.tabIconDefault}
                                value={pickupLocation}
                                onChangeText={setPickupLocation}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <LucideCar size={20} color={theme.tint} />
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                placeholder="Return Location"
                                placeholderTextColor={theme.tabIconDefault}
                                value={returnLocation}
                                onChangeText={setReturnLocation}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: theme.tint }]}
                            onPress={handleRequestExchange}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Request Exchange</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Exchange History */}
                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Exchange History</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} />
                ) : exchanges.length === 0 ? (
                    <Text style={{ color: theme.tabIconDefault, textAlign: 'center' }}>No exchanges yet.</Text>
                ) : (
                    exchanges.map((ex, index) => (
                        <Animated.View
                            key={ex.id}
                            entering={FadeInUp.delay(index * 100)}
                            style={[styles.exchangeItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                        >
                            <View style={styles.exchangeHeader}>
                                <LucideArrowLeftRight size={18} color={theme.tint} />
                                <Text style={[styles.exchangeId, { color: theme.text }]}>Exchange #{ex.id}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ex.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(ex.status) }]}>{ex.status}</Text>
                                </View>
                            </View>
                            <Text style={[styles.exchangeDetail, { color: theme.tabIconDefault }]}>
                                Pickup: {ex.pickup_location}
                            </Text>
                            <Text style={[styles.exchangeDetail, { color: theme.tabIconDefault }]}>
                                Return: {ex.return_location}
                            </Text>
                            <Text style={[styles.exchangeFee, { color: theme.text }]}>
                                Rental Fee: ₹{ex.rental_fee}
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
    inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    input: { flex: 1, marginLeft: 10, height: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15 },
    submitBtn: { height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    exchangeItem: { padding: 15, borderRadius: 15, borderWidth: 1, marginBottom: 12 },
    exchangeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    exchangeId: { flex: 1, marginLeft: 10, fontWeight: '600' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: '600' },
    exchangeDetail: { fontSize: 13, marginBottom: 4 },
    exchangeFee: { fontSize: 14, fontWeight: '600', marginTop: 8 },
});
