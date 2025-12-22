import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CheckCircle, Truck, Info } from 'lucide-react-native';
import { apiClient } from '../services/apiClient'; 
import * as Theme from '../styles/Theme';

interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    is_exchange_eligible: boolean;
    is_current: boolean;
}

const mockPlans: Plan[] = [
    { id: 1, name: 'Free Plan', description: 'On-Demand Service Access (Pay-per-use)', price: 0.00, is_exchange_eligible: false, is_current: true },
    { id: 2, name: 'Standard Plan', description: 'Unlimited Service Access & 24/7 Helpline', price: 999.00, is_exchange_eligible: false, is_current: false },
    { id: 3, name: 'Premium + IoT', description: 'All features, Vehicle Exchange, IoT Integration', price: 1999.00, is_exchange_eligible: true, is_current: false },
];

const SubscriptionScreen: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>(mockPlans);
    
    useEffect(() => {
        fetchSubscriptionPlans();
    }, []);

    const fetchSubscriptionPlans = async () => {
        try {
            // API call to fetch available plans
            const response = await apiClient.get('services/subscriptions/plans/');
            // Logic to merge API data with user's current status
            // setPlans(response.data.plans.map(p => ({ ...p, is_current: p.name === user.current_plan })));
        } catch (error) {
            console.error("Failed to fetch plans.");
            setPlans(mockPlans);
        }
    };

    const handleUpgrade = (plan: Plan) => {
        if (plan.is_current) {
            Alert.alert("Current Plan", `You are already subscribed to the ${plan.name}.`);
            return;
        }

        Alert.alert(
            "Confirm Upgrade",
            `Do you want to purchase the ${plan.name} for ₹${plan.price.toFixed(2)}?`,
            [
                { text: "Cancel", style: 'cancel' },
                { text: "Buy Now", onPress: async () => {
                    // In a real app: Initiate payment gateway (Razorpay) here
                    Alert.alert("Payment Initiated", `Redirecting to secure payment gateway for ₹${plan.price.toFixed(2)}.`);
                    // await apiClient.post('payments/initiate/', { plan_id: plan.id });
                }}
            ]
        );
    };

    const renderPlanCard = (plan: Plan) => (
        <View key={plan.id} style={[styles.planCard, plan.is_current && styles.currentPlanCard]}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>
                {plan.price === 0 ? 'FREE' : `₹${plan.price.toFixed(2)} / Month`}
            </Text>
            
            <View style={styles.features}>
                <View style={styles.featureItem}>
                    <CheckCircle size={16} color={Theme.COLORS.success} />
                    <Text style={styles.featureText}>Unlimited On-Demand Service Calls</Text>
                </View>
                <View style={styles.featureItem}>
                    <Truck size={16} color={plan.is_exchange_eligible ? Theme.COLORS.success : Theme.COLORS.gray} />
                    <Text style={[styles.featureText, !plan.is_exchange_eligible && { color: Theme.COLORS.gray }]}>
                        Vehicle Exchange Add-on Eligibility
                    </Text>
                </View>
                <View style={styles.featureItem}>
                    <Info size={16} color={Theme.COLORS.primary} />
                    <Text style={styles.featureText}>24/7 Toll-Free Priority Helpline</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={[styles.actionButton, plan.is_current ? styles.currentButton : styles.upgradeButton]}
                onPress={() => handleUpgrade(plan)}
                disabled={plan.is_current}
            >
                <Text style={styles.buttonText}>
                    {plan.is_current ? 'CURRENT PLAN' : 'UPGRADE NOW'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>Your Current Plan:</Text>
                <Text style={styles.currentPlanName}>{plans.find(p => p.is_current)?.name || 'N/A'}</Text>
            </View>
            
            <View style={styles.plansContainer}>
                {plans.map(renderPlanCard)}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.COLORS.background,
    },
    infoBox: {
        backgroundColor: Theme.COLORS.white,
        padding: 20,
        margin: 15,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: Theme.COLORS.accent,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    infoText: {
        fontSize: 16,
        color: Theme.COLORS.darkText,
    },
    currentPlanName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Theme.COLORS.primary,
        marginTop: 5,
    },
    plansContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    planCard: {
        backgroundColor: Theme.COLORS.white,
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Theme.COLORS.border,
    },
    currentPlanCard: {
        borderColor: Theme.COLORS.primary,
        borderWidth: 2,
        shadowColor: Theme.COLORS.primary,
        shadowOpacity: 0.2,
        elevation: 5,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.COLORS.darkText,
        marginBottom: 5,
    },
    planPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: Theme.COLORS.success,
        marginBottom: 15,
    },
    features: {
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        marginLeft: 10,
        fontSize: 14,
        color: Theme.COLORS.darkText,
    },
    actionButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    upgradeButton: {
        backgroundColor: Theme.COLORS.accent,
    },
    currentButton: {
        backgroundColor: Theme.COLORS.primary,
    },
    buttonText: {
        color: Theme.COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SubscriptionScreen;