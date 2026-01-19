import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideChevronLeft, LucidePhone, LucideHeadphones, LucideClock, LucideLock, LucideCheck, LucideShield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { apiClient } from '@/src/api/client';

// Toll-Free Helpline Numbers (Subscription-based)
const HELPLINE_NUMBERS = {
    FREE: null, // No helpline for free users
    STANDARD: '1800-123-4567', // Standard toll-free
    PREMIUM: '1800-VEHIC-AID', // Premium dedicated line
    IOT: '1800-IOT-HELP', // IoT + Subscription plan
};

interface SubscriptionInfo {
    plan: {
        name: string;
        features: string[];
    };
    is_active: boolean;
}

interface HelplineCall {
    id: number;
    call_start: string;
    notes: string;
}

export default function HelplineScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [callHistory, setCallHistory] = useState<HelplineCall[]>([]);
    const [calling, setCalling] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subRes, callsRes] = await Promise.all([
                apiClient.get('/services/subscriptions/active/'),
                apiClient.get('/services/helpline/')
            ]);
            setSubscription(subRes.data);
            setCallHistory(callsRes.data.results || callsRes.data || []);
        } catch (error) {
            console.log('Helpline fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHelplineNumber = (): string | null => {
        if (!subscription || !subscription.is_active) return null;
        const planName = subscription.plan?.name?.toUpperCase() || 'FREE';
        return HELPLINE_NUMBERS[planName as keyof typeof HELPLINE_NUMBERS] || HELPLINE_NUMBERS.STANDARD;
    };

    const handleCall = async () => {
        const number = getHelplineNumber();
        if (!number) {
            Alert.alert('Upgrade Required', 'Helpline access requires a subscription plan.');
            return;
        }

        setCalling(true);
        try {
            // Log the call attempt to backend
            await apiClient.post('/services/helpline/', {
                call_start: new Date().toISOString(),
                notes: 'Call initiated from app'
            });

            // Initiate the phone call
            const phoneUrl = `tel:${number.replace(/-/g, '')}`;
            const canOpen = await Linking.canOpenURL(phoneUrl);
            if (canOpen) {
                await Linking.openURL(phoneUrl);
            } else {
                Alert.alert('Call Failed', 'Unable to make phone calls from this device.');
            }
        } catch (error) {
            console.log('Call error:', error);
        } finally {
            setCalling(false);
            fetchData(); // Refresh call history
        }
    };

    const hasHelplineAccess = () => {
        return subscription && subscription.is_active && subscription.plan?.name !== 'FREE';
    };

    const getPlanBenefits = () => {
        const planName = subscription?.plan?.name?.toUpperCase() || 'FREE';
        switch (planName) {
            case 'PREMIUM':
                return ['24/7 Dedicated Support', 'Priority Response', 'No Wait Time', 'Vehicle Exchange Access'];
            case 'STANDARD':
                return ['24/7 Toll-Free Support', 'Average Wait: 2 mins', 'Call Records Saved'];
            default:
                return ['In-App Chat Only', 'Business Hours Support'];
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>24/7 Helpline</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Card */}
                <Animated.View entering={FadeInUp.duration(500)}>
                    <LinearGradient
                        colors={['#ef4444', '#dc2626']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroCard}
                    >
                        <LucideHeadphones size={48} color="#fff" />
                        <Text style={styles.heroTitle}>Emergency Helpline</Text>
                        <Text style={styles.heroText}>
                            Get immediate assistance anytime, anywhere. Our trained operators are ready to help 24/7.
                        </Text>

                        {hasHelplineAccess() && (
                            <View style={styles.numberContainer}>
                                <LucidePhone size={20} color="#fff" />
                                <Text style={styles.helplineNumber}>{getHelplineNumber()}</Text>
                            </View>
                        )}
                    </LinearGradient>
                </Animated.View>

                {/* Call Button or Upgrade Prompt */}
                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} style={{ marginVertical: 30 }} />
                ) : hasHelplineAccess() ? (
                    <Animated.View entering={FadeInUp.delay(200)}>
                        <TouchableOpacity
                            style={styles.callButton}
                            onPress={handleCall}
                            disabled={calling}
                        >
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                style={styles.callButtonGradient}
                            >
                                {calling ? (
                                    <ActivityIndicator color="#fff" size="large" />
                                ) : (
                                    <>
                                        <LucidePhone size={28} color="#fff" />
                                        <Text style={styles.callButtonText}>Call Now - FREE</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.featureList}>
                            <Text style={[styles.planName, { color: theme.text }]}>
                                Your Plan: {subscription?.plan?.name}
                            </Text>
                            {getPlanBenefits().map((benefit, idx) => (
                                <View key={idx} style={styles.featureItem}>
                                    <LucideCheck size={16} color="#10b981" />
                                    <Text style={[styles.featureText, { color: theme.text }]}>{benefit}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInUp.delay(200)} style={[styles.lockedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideLock size={32} color={theme.tabIconDefault} />
                        <Text style={[styles.lockedTitle, { color: theme.text }]}>Helpline Access Locked</Text>
                        <Text style={[styles.lockedText, { color: theme.tabIconDefault }]}>
                            Subscribe to get 24/7 toll-free helpline access, even when your phone has no network or recharge!
                        </Text>

                        <View style={styles.planOptions}>
                            <View style={[styles.planOption, { borderColor: theme.border }]}>
                                <Text style={[styles.planOptionName, { color: theme.text }]}>Basic</Text>
                                <Text style={[styles.planOptionPrice, { color: theme.tint }]}>₹99/mo</Text>
                                <Text style={[styles.planOptionFeature, { color: theme.tabIconDefault }]}>Toll-Free Support</Text>
                            </View>
                            <View style={[styles.planOption, { borderColor: theme.border }]}>
                                <Text style={[styles.planOptionName, { color: theme.text }]}>Premium</Text>
                                <Text style={[styles.planOptionPrice, { color: theme.tint }]}>₹199/mo</Text>
                                <Text style={[styles.planOptionFeature, { color: theme.tabIconDefault }]}>Priority Support</Text>
                            </View>
                            <View style={[styles.planOption, { borderColor: theme.tint, backgroundColor: theme.tint + '10' }]}>
                                <LucideShield size={16} color={theme.tint} />
                                <Text style={[styles.planOptionName, { color: theme.text }]}>Elite</Text>
                                <Text style={[styles.planOptionPrice, { color: theme.tint }]}>₹499/mo</Text>
                                <Text style={[styles.planOptionFeature, { color: theme.tabIconDefault }]}>Dedicated Line</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.upgradeBtn, { backgroundColor: theme.tint }]}
                            onPress={() => router.push('/subscriptions')}
                        >
                            <Text style={styles.upgradeBtnText}>View Subscription Plans</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Call History */}
                {hasHelplineAccess() && (
                    <>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Calls</Text>
                        {callHistory.length === 0 ? (
                            <Text style={{ color: theme.tabIconDefault, textAlign: 'center' }}>No call history yet.</Text>
                        ) : (
                            callHistory.slice(0, 5).map((call, index) => (
                                <Animated.View
                                    key={call.id}
                                    entering={FadeInUp.delay(index * 100)}
                                    style={[styles.callItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                                >
                                    <View style={styles.callIcon}>
                                        <LucidePhone size={18} color={theme.tint} />
                                    </View>
                                    <View style={styles.callInfo}>
                                        <Text style={[styles.callDate, { color: theme.text }]}>{formatDate(call.call_start)}</Text>
                                        <Text style={[styles.callNotes, { color: theme.tabIconDefault }]}>{call.notes || 'Helpline call'}</Text>
                                    </View>
                                </Animated.View>
                            ))
                        )}
                    </>
                )}

                {/* IoT Device Promo */}
                <Animated.View entering={FadeInUp.delay(400)} style={[styles.iotPromo, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <LucideClock size={24} color={theme.tint} />
                    <Text style={[styles.iotTitle, { color: theme.text }]}>No Phone? No Problem!</Text>
                    <Text style={[styles.iotText, { color: theme.tabIconDefault }]}>
                        With our IoT device, you can call for help even when your phone has no battery or network.
                        One button for common issues, another for all services.
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/iot')}>
                        <Text style={[styles.iotLink, { color: theme.tint }]}>Learn about IoT Device →</Text>
                    </TouchableOpacity>
                </Animated.View>
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
    heroCard: { padding: 30, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
    heroTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
    heroText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center', lineHeight: 22 },
    numberContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30 },
    helplineNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    callButton: { marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
    callButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 70, gap: 15 },
    callButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    featureList: { marginBottom: 25 },
    planName: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
    featureText: { marginLeft: 10, fontSize: 14 },
    lockedCard: { padding: 25, borderRadius: 20, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
    lockedTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
    lockedText: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
    planOptions: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    planOption: { flex: 1, padding: 15, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    planOptionName: { fontWeight: 'bold', marginTop: 5 },
    planOptionPrice: { fontSize: 18, fontWeight: 'bold', marginVertical: 5 },
    planOptionFeature: { fontSize: 11, textAlign: 'center' },
    upgradeBtn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
    upgradeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
    callItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
    callIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(99,102,241,0.1)', justifyContent: 'center', alignItems: 'center' },
    callInfo: { flex: 1, marginLeft: 15 },
    callDate: { fontWeight: '600' },
    callNotes: { fontSize: 13, marginTop: 2 },
    iotPromo: { padding: 20, borderRadius: 15, borderWidth: 1, marginTop: 20 },
    iotTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 10, marginBottom: 8 },
    iotText: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
    iotLink: { fontWeight: '600' },
});
