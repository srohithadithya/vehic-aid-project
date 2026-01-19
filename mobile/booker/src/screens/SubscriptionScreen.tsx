import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubscriptionScreen() {
    const [currentPlan, setCurrentPlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: 99,
            features: ['5 Services/month', 'Basic Support', '24/7 Availability'],
            color: '#3b82f6',
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 299,
            features: ['15 Services/month', 'Priority Support', 'Free Towing (5km)', '10% Discount'],
            color: '#8b5cf6',
            popular: true,
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 599,
            features: ['Unlimited Services', 'VIP Support', 'Free Towing (15km)', '20% Discount', 'Dedicated Manager'],
            color: '#f59e0b',
        },
    ];

    useEffect(() => {
        fetchCurrentPlan();
    }, []);

    const fetchCurrentPlan = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/subscriptions/current/`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.ok) {
                const data = await response.json();
                setCurrentPlan(data);
            }
        } catch (error) {
            console.error('Failed to fetch subscription:', error);
        }
    };

    const subscribeToPlan = async (planId: string, price: number) => {
        Alert.alert(
            'Confirm Subscription',
            `Subscribe to ${planId.toUpperCase()} plan for ₹${price}/month?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Subscribe',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const token = await AsyncStorage.getItem('token');
                            const response = await fetch(
                                `${process.env.EXPO_PUBLIC_API_URL}/subscriptions/subscribe/`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ plan_id: planId })
                                }
                            );

                            if (response.ok) {
                                Alert.alert('Success', 'Subscription activated successfully!');
                                fetchCurrentPlan();
                            } else {
                                throw new Error('Subscription failed');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to subscribe. Please try again.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Subscription Plans</Text>
                <Text style={styles.subtitle}>Choose the plan that fits your needs</Text>
            </View>

            {currentPlan && (
                <View style={styles.currentPlan}>
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                    <View style={styles.currentPlanText}>
                        <Text style={styles.currentPlanTitle}>Current Plan: {currentPlan.plan_name}</Text>
                        <Text style={styles.currentPlanExpiry}>
                            Expires: {new Date(currentPlan.expiry_date).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            )}

            {plans.map((plan) => (
                <View key={plan.id} style={[styles.planCard, { borderColor: plan.color }]}>
                    {plan.popular && (
                        <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                            <Text style={styles.popularText}>MOST POPULAR</Text>
                        </View>
                    )}

                    <View style={styles.planHeader}>
                        <Text style={styles.planName}>{plan.name}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.currency}>₹</Text>
                            <Text style={styles.price}>{plan.price}</Text>
                            <Text style={styles.period}>/month</Text>
                        </View>
                    </View>

                    <View style={styles.features}>
                        {plan.features.map((feature, index) => (
                            <View key={index} style={styles.feature}>
                                <Ionicons name="checkmark-circle" size={20} color={plan.color} />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.subscribeButton, { backgroundColor: plan.color }]}
                        onPress={() => subscribeToPlan(plan.id, plan.price)}
                        disabled={loading || currentPlan?.plan_id === plan.id}
                    >
                        <Text style={styles.subscribeButtonText}>
                            {currentPlan?.plan_id === plan.id ? 'Current Plan' : 'Subscribe'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    currentPlan: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    currentPlanText: {
        marginLeft: 12,
        flex: 1,
    },
    currentPlanTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#065f46',
    },
    currentPlanExpiry: {
        fontSize: 14,
        color: '#059669',
        marginTop: 4,
    },
    planCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 8,
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        position: 'relative',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        left: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    planHeader: {
        marginBottom: 20,
    },
    planName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currency: {
        fontSize: 20,
        fontWeight: '600',
    },
    price: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    period: {
        fontSize: 16,
        color: '#6b7280',
        marginLeft: 4,
    },
    features: {
        marginBottom: 20,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#374151',
    },
    subscribeButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    subscribeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
