
// ServiceBookerApp/src/screens/ProfileScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { User, Car, CheckCircle, CreditCard, LogOut, Zap } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import { theme } from '../theme'; // Cosmic Glass

// Mock Data Interfaces
interface UserProfile {
    full_name: string;
    email: string;
    phone: string;
    subscription_plan: 'FREE' | 'STANDARD' | 'PREMIUM';
    vehicle_count: number;
    iot_status: 'PAIRED' | 'UNPAIRED';
}

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // --- Data Fetching ---
    const fetchUserProfile = useCallback(async () => {
        try {
            // API call to the Django profile endpoint: /api/v1/users/profile/
            const response = await apiClient.get('users/profile/');
            // Map API response to local state
            setProfile({
                full_name: response.data.full_name || 'Riya Sharma',
                email: response.data.email || 'riya.s@example.com',
                phone: response.data.phone || '9876543210',
                subscription_plan: response.data.plan || 'PREMIUM',
                vehicle_count: response.data.vehicles?.length || 2,
                iot_status: response.data.iot_device_id ? 'PAIRED' : 'UNPAIRED'
            } as UserProfile);

        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Fallback for demo
            setProfile({ full_name: 'Guest User', email: 'guest@aid.com', phone: 'N/A', subscription_plan: 'FREE', vehicle_count: 0, iot_status: 'UNPAIRED' });
        }
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchUserProfile();
        }
    }, [isFocused, fetchUserProfile]);

    // --- Action Handlers ---
    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: 'cancel' },
                {
                    text: "Logout", style: 'destructive', onPress: () => {
                        // 1. Clear tokens (AsyncStorage/SecureStore)
                        // 2. Redirect to Login Screen
                        navigation.reset({ index: 0, routes: [{ name: 'Auth' as never }] });
                    }
                }
            ]
        );
    };

    if (!profile) {
        return <View style={styles.loadingContainer}><Text style={{ color: theme.colors.text }}>Loading Profile...</Text></View>;
    }

    const { full_name, email, subscription_plan, vehicle_count, iot_status } = profile;

    return (
        <ScrollView style={styles.container}>
            {/* User Header */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                    <User size={36} color={theme.colors.primary} />
                </View>
                <View style={styles.profileText}>
                    <Text style={styles.nameText}>{full_name}</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>
                <View style={[styles.planBadge, subscription_plan === 'PREMIUM' ? styles.premiumBadge : styles.freeBadge]}>
                    <Text style={styles.planText}>{subscription_plan}</Text>
                </View>
            </View>

            {/* Account Management Links */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account & Services</Text>

                {/* Vehicles Link (Navigates to VehicleListScreen) */}
                <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('VehicleList' as never)}>
                    <Car size={20} color={theme.colors.textSecondary} style={styles.linkIcon} />
                    <Text style={styles.linkText}>Manage Vehicles ({vehicle_count})</Text>
                </TouchableOpacity>

                {/* Subscription Details Link (Navigates to SubscriptionScreen) */}
                <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('SubscriptionDetails' as never)}>
                    <CheckCircle size={20} color={theme.colors.success} style={styles.linkIcon} />
                    <Text style={styles.linkText}>View Plan & Upgrade</Text>
                </TouchableOpacity>

                {/* IoT Status Link */}
                <TouchableOpacity style={styles.linkItem} onPress={() => Alert.alert("IoT Status", `Status: ${iot_status}. Paired devices allow for quick emergency requests.`)}>
                    <Zap size={20} color={iot_status === 'PAIRED' ? theme.colors.primary : theme.colors.danger} style={styles.linkIcon} />
                    <Text style={styles.linkText}>IoT Device Status: {iot_status}</Text>
                </TouchableOpacity>

                {/* Payments Link */}
                <TouchableOpacity style={styles.linkItem}>
                    <CreditCard size={20} color={theme.colors.secondary} style={styles.linkIcon} />
                    <Text style={styles.linkText}>Payment Methods</Text>
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#FFF" style={styles.linkIcon} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },

    profileHeader: {
        backgroundColor: theme.colors.surface,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: 10,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 229, 255, 0.1)', // Primary tint
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: { marginLeft: 16, flex: 1 },
    nameText: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    emailText: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },

    planBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginLeft: 10 },
    premiumBadge: { backgroundColor: 'rgba(255, 215, 0, 0.2)', borderWidth: 1, borderColor: '#FFD700' },
    freeBadge: { backgroundColor: theme.colors.border },
    planText: { fontSize: 10, fontWeight: 'bold', color: theme.colors.text }, // Gold/White

    section: {
        backgroundColor: theme.glass.backgroundColor,
        marginHorizontal: 16,
        borderRadius: theme.borderRadius.m,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 8 },

    linkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    linkIcon: { marginRight: 16 },
    linkText: { fontSize: 16, color: theme.colors.text }, // White text

    logoutButton: {
        backgroundColor: theme.colors.danger,
        marginHorizontal: 16,
        marginTop: 20,
        padding: 16,
        borderRadius: theme.borderRadius.m,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoutText: { color: "#FFF", fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default ProfileScreen;