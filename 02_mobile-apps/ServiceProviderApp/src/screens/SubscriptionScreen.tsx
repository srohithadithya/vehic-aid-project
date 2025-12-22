// ServiceProviderApp/src/screens/SubscriptionScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Zap, DollarSign, Clock, CheckCircle } from 'lucide-react-native';
import { apiClient } from '../api'; 
import * as Theme from '../styles/Theme';

interface ProviderPlan {
    id: number;
    name: string;
    description: string;
    status: 'ACTIVE' | 'EXPIRED' | 'FREE';
    renewal_date: string;
    priority_dispatch: boolean;
}

const mockProviderPlan: ProviderPlan = {
    id: 1, name: 'Pro Dispatch Tier', description: 'Priority access to all URGENT and HIGH priority jobs.', status: 'ACTIVE', renewal_date: '2026-03-15', priority_dispatch: true
};

const SubscriptionScreen: React.FC = () => {
    const [plan, setPlan] = useState<ProviderPlan>(mockProviderPlan);

    useEffect(() => {
        fetchProviderSubscription();
    }, []);

    const fetchProviderSubscription = async () => {
        try {
            // API call to fetch provider's current plan status
            const response = await apiClient.get('users/provider/subscription/');
            setPlan(response.data.plan || mockProviderPlan); 
        } catch (error) {
            console.error("Failed to fetch provider plan.");
        }
    };

    const handleRenewal = () => {
        Alert.alert("Renew Subscription", "Initiating secure renewal payment process.");
        // Logic to initiate renewal payment API call
    };

    const isCurrent = plan.status === 'ACTIVE';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Zap size={30} color={Theme.COLORS.primary} />
                <Text style={styles.headerTitle}>Dispatch Tier Status</Text>
            </View>

            {/* Current Status Box */}
            <View style={[styles.statusBox, isCurrent ? styles.activeBox : styles.expiredBox]}>
                <Text style={styles.statusLabel}>Current Status:</Text>
                <Text style={styles.statusValue}>{plan.status}</Text>
            </View>

            {/* Plan Details Card */}
            <View style={styles.planCard}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
                
                <View style={styles.featureItem}>
                    <Clock size={16} color={Theme.COLORS.primary} />
                    <Text style={styles.featureText}>Renewal Date: {plan.renewal_date}</Text>
                </View>
                <View style={styles.featureItem}>
                    <CheckCircle size={16} color={plan.priority_dispatch ? Theme.COLORS.success : Theme.COLORS.danger} />
                    <Text style={styles.featureText}>
                        Priority Dispatch Access: {plan.priority_dispatch ? 'ACTIVE' : 'INACTIVE'}
                    </Text>
                </View>

                {!isCurrent && (
                    <TouchableOpacity style={styles.renewalButton} onPress={handleRenewal}>
                        <DollarSign size={20} color="#FFFFFF" />
                        <Text style={styles.renewalText}>Renew Now</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {/* Note on Free Tier */}
            <Text style={styles.note}>
                * Commission tiers are managed separately. This plan relates to job **priority** only.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.COLORS.background, padding: 15 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: Theme.COLORS.darkText, marginLeft: 10 },
    
    statusBox: { padding: 20, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
    activeBox: { backgroundColor: Theme.COLORS.success },
    expiredBox: { backgroundColor: Theme.COLORS.danger },
    statusLabel: { fontSize: 16, color: Theme.COLORS.white },
    statusValue: { fontSize: 28, fontWeight: 'bold', color: Theme.COLORS.white, marginTop: 5 },

    planCard: { backgroundColor: Theme.COLORS.white, padding: 20, borderRadius: 10, shadowOpacity: 0.1, elevation: 3 },
    planName: { fontSize: 22, fontWeight: 'bold', color: Theme.COLORS.primary, marginBottom: 5 },
    planDescription: { fontSize: 16, color: Theme.COLORS.gray, marginBottom: 15 },
    
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    featureText: { marginLeft: 10, fontSize: 16, color: Theme.COLORS.darkText },
    
    renewalButton: { flexDirection: 'row', backgroundColor: Theme.COLORS.accent, padding: 15, borderRadius: 8, marginTop: 20, justifyContent: 'center' },
    renewalText: { color: Theme.COLORS.white, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    
    note: { fontSize: 12, color: Theme.COLORS.gray, textAlign: 'center', marginTop: 20 },
});

export default SubscriptionScreen;