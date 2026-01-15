import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideCheck, LucideShieldCheck, LucideZap, LucideChevronLeft, LucideStar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PLANS = [
    {
        id: 'free',
        name: 'Free Access',
        price: '0',
        duration: 'mo',
        description: 'Pay only when you need help.',
        features: ['Pay-per-use Access', 'App Features', 'Community Support'],
        color: '#64748b',
        popular: false
    },
    {
        id: 'basic',
        name: 'Basic',
        price: '99',
        duration: 'mo',
        description: 'Essential coverage for peace of mind.',
        features: ['3 Towing Requests / yr (5 miles)', 'Battery Jump Start', 'Flat Tire Change', 'Lockout Service'],
        color: '#3b82f6',
        popular: false
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '199',
        duration: 'mo',
        description: 'Comprehensive protection for daily drivers.',
        features: ['Unlimited Towing (25 miles)', 'Priority Response', 'Fuel Delivery', 'All Basic Features'],
        color: '#9d50bb',
        popular: true
    },
    {
        id: 'elite',
        name: 'Elite',
        price: '499',
        duration: 'mo',
        description: 'Ultimate service and perks for enthusiasts.',
        features: ['Unlimited Towing (100 miles)', 'Dedicated Advisor', 'Rental Car Reimbursement', 'All Premium Features'],
        color: '#f59e0b',
        popular: false
    }
];

export default function SubscriptionsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Subscription Plans</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Choose a plan that fits your needs</Text>

                {PLANS.map((plan, index) => (
                    <Animated.View
                        key={plan.id}
                        entering={FadeInUp.delay(index * 200).duration(600)}
                        style={[
                            styles.planCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: plan.popular ? plan.color : theme.border,
                                borderWidth: plan.popular ? 2 : 1
                            }
                        ]}
                    >
                        {plan.popular && (
                            <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                                <LucideStar size={12} color="#fff" fill="#fff" />
                                <Text style={styles.popularText}>MOST POPULAR</Text>
                            </View>
                        )}

                        <View style={styles.planHeader}>
                            <View>
                                <Text style={[styles.planName, { color: theme.text }]}>{plan.name}</Text>
                                <Text style={[styles.planDescription, { color: theme.tabIconDefault }]}>{plan.description}</Text>
                                <View style={styles.priceContainer}>
                                    <Text style={[styles.currency, { color: theme.text }]}>₹</Text>
                                    <Text style={[styles.price, { color: theme.text }]}>{plan.price}</Text>
                                    <Text style={[styles.duration, { color: theme.tabIconDefault }]}>/{plan.duration}</Text>
                                </View>
                            </View>
                            {plan.popular ? <LucideZap size={32} color={plan.color} /> : <LucideShieldCheck size={32} color={plan.color} />}
                        </View>

                        <View style={styles.divider} />

                        {plan.features.map((feature, idx) => (
                            <View key={idx} style={styles.featureItem}>
                                <LucideCheck size={18} color={plan.color} />
                                <Text style={[styles.featureText, { color: theme.text }]}>{feature}</Text>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={[
                                styles.selectButton,
                                { backgroundColor: plan.popular ? plan.color : 'transparent', borderColor: plan.color, borderWidth: 1 }
                            ]}
                            onPress={() => router.push({
                                pathname: '/payment',
                                params: { amount: plan.price, planId: plan.id }
                            })}
                        >
                            <Text style={[styles.selectButtonText, { color: plan.popular ? '#fff' : plan.color }]}>
                                {plan.popular ? 'Unlock Platinum' : 'Get Started'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                <View style={styles.secureContainer}>
                    <LucideShieldCheck size={16} color="#10b981" />
                    <Text style={styles.secureText}>Safe & Secure Payments via Razorpay</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
    },
    planCard: {
        borderRadius: 25,
        padding: 25,
        marginBottom: 25,
        position: 'relative',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 5,
    },
    popularText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    planDescription: {
        fontSize: 12,
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    currency: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 6,
        marginRight: 2,
    },
    price: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    duration: {
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(150, 150, 150, 0.1)',
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    featureText: {
        fontSize: 14,
    },
    selectButton: {
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    selectButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    secureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
    },
    secureText: {
        fontSize: 12,
        color: '#10b981',
    },
});
