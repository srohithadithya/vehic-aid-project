import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { User, CheckCircle, Clock, MapPin, DollarSign, LogOut } from 'lucide-react-native';
import { getEarningsHistory, updateProviderStatus as updateApiStatus } from '../api'; 
import StatusToggle from '../components/StatusToggle'; 
import * as Theme from '../styles/Theme'; 

interface ProviderProfile {
    user_id: number;
    full_name: string;
    is_verified: boolean;
    jobs_completed: number;
    average_rating: number;
    service_types: string[];
    bank_account_verified: boolean;
    is_available: boolean;
}

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [isOnline, setIsOnline] = useState(false); 
    
    // Placeholder for bank details
    const [bankDetails] = useState({ account: 'XXXX-1234', ifsc: 'HDFC000XXX' }); 

    const fetchProfile = useCallback(async () => {
        // Mock API call for profile data
        const mockResponse = { 
            user_id: 42,
            full_name: 'Rajesh Sharma',
            is_verified: true, 
            jobs_completed: 154,
            average_rating: 4.8,
            service_types: ['Towing', 'Jumpstart'],
            bank_account_verified: true,
            is_available: true
        };

        setProfile(mockResponse as ProviderProfile);
        setIsOnline(mockResponse.is_available);
    }, []);

    useFocusEffect(useCallback(() => {
        fetchProfile();
    }, [fetchProfile]));
    
    const handleStatusChange = (newStatus: boolean) => {
        setIsOnline(newStatus);
        // Logic to call updateApiStatus API would go here
    };

    const handleNavigateToVehicles = () => {
        // Assuming VehicleListScreen is part of the same navigation stack
        navigation.navigate('VehicleList' as never); 
    };

    if (!profile) {
        return <View style={styles.loadingContainer}><Text>Loading Profile...</Text></View>;
    }

    const { full_name, is_verified, average_rating, jobs_completed, service_types, user_id } = profile;

    return (
        <ScrollView style={styles.container}>
            {/* Header and Availability Toggle */}
            <View style={styles.header}>
                <Text style={styles.nameText}>{full_name}</Text>
                <Text style={styles.detailText}>Provider ID: SP-{user_id}</Text>
            </View>

            {/* Status Toggle Component (Controls isOnline state and sends GPS data to backend) */}
            <StatusToggle initialStatus={isOnline} onStatusChange={handleStatusChange} />

            {/* Verification Status */}
            <View style={[styles.statusBox, is_verified ? styles.verifiedBox : styles.pendingBox]}>
                <CheckCircle size={20} color="#FFFFFF" />
                <Text style={styles.statusText}>
                    Status: {is_verified ? 'VERIFIED & APPROVED' : 'PENDING ADMIN REVIEW'}
                </Text>
            </View>

            {/* Operational Management Links */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Operational Management</Text>
                
                <TouchableOpacity style={styles.linkItem} onPress={handleNavigateToVehicles}>
                    <DollarSign size={20} color="#007bff" />
                    <Text style={styles.linkText}>Manage Service Vehicles</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkItem} onPress={() => Alert.alert("Doc Upload", "Navigate to document upload center.")}>
                    <CheckCircle size={20} color={is_verified ? Theme.COLORS.success : Theme.COLORS.danger} />
                    <Text style={styles.linkText}>Document Verification</Text>
                </TouchableOpacity>
            </View>

            {/* Performance and Payout Details */}
            <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{jobs_completed}</Text>
                    <Text style={styles.metricLabel}>Jobs Completed</Text>
                </View>
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{average_rating.toFixed(1)} ★</Text>
                    <Text style={styles.metricLabel}>Average Rating</Text>
                </View>
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>A/C: {profile.bank_account_verified ? 'Active' : 'N/A'}</Text>
                    <Text style={styles.metricLabel}>Settlement Status</Text>
                </View>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert("Logout", "Confirm logout.")}>
                <LogOut size={20} color="#FFFFFF" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F4F9' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#DEE2E6' },
    nameText: { fontSize: 24, fontWeight: 'bold', color: '#343A40' },
    detailText: { fontSize: 14, color: '#6C757D', marginTop: 4 },
    
    statusBox: { flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 16, marginTop: 10, borderRadius: 8 },
    verifiedBox: { backgroundColor: '#28A745' },
    pendingBox: { backgroundColor: '#FFC107' },
    statusText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 10 },
    
    metricsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
    metricCard: { flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 5 },
    metricValue: { fontSize: 24, fontWeight: 'bold', color: '#007bff' },
    metricLabel: { fontSize: 12, color: '#6C757D', marginTop: 5 },

    section: { backgroundColor: '#FFFFFF', margin: 16, padding: 15, borderRadius: 10, shadowOpacity: 0.1, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#343A40', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#DEE2E6', paddingBottom: 5 },
    
    linkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#DEE2E6', },
    linkText: { marginLeft: 15, fontSize: 16, color: '#343A40' },

    updateButton: { backgroundColor: '#FF8C00', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' },
    updateButtonText: { color: '#FFFFFF', fontWeight: 'bold' },

    logoutButton: { backgroundColor: '#DC3545', margin: 16, padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    logoutText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});

export default ProfileScreen;