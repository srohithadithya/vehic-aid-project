import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert, Image, Platform } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideUser, LucideShieldCheck, LucideStar, LucideAward, LucideCalendar, LucideTruck, LucideCreditCard, LucideSettings, LucideLogOut, LucideLanguages } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../src/i18n'; // Ensure i18n is initialized in provider app too

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { t, i18n: i18nInstance } = useTranslation();
    const [isHindi, setIsHindi] = useState(i18n.language === 'hi');

    // Mock Provider Stats
    const stats = {
        rating: 4.9,
        missions: 142,
        joined: 'Jan 2024'
    };

    const toggleLanguage = async (value: boolean) => {
        setIsHindi(value);
        const newLang = value ? 'hi' : 'en';
        i18nInstance.changeLanguage(newLang);
        await AsyncStorage.setItem('user-language', newLang);
    };

    const handleLogout = () => {
        Alert.alert("Log Out", "Are you sure?", [{ text: "Cancel" }, { text: "Log Out", onPress: logout, style: 'destructive' }]);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>

            {/* Digital ID Card */}
            <View style={styles.idCardContainer}>
                <LinearGradient
                    colors={['#9d50bb', '#6e48aa']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.idCard}
                >
                    <View style={styles.idHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <LucideUser size={40} color="#fff" />
                            </View>
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.verifiedText}>VERIFIED</Text>
                            </View>
                        </View>
                        <View style={styles.idInfo}>
                            <Text style={styles.providerName}>{user?.username || 'Provider'}</Text>
                            <Text style={styles.providerTitle}>Senior Recovery Specialist</Text>
                            <Text style={styles.providerId}>ID: PRO-{user?.id || '882'}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={styles.statRow}>
                                <LucideStar size={16} color="#fbbf24" fill="#fbbf24" />
                                <Text style={styles.statValue}>{stats.rating}</Text>
                            </View>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.statRow}>
                                <LucideAward size={16} color="#fb923c" />
                                <Text style={styles.statValue}>{stats.missions}</Text>
                            </View>
                            <Text style={styles.statLabel}>Missions</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.statRow}>
                                <LucideCalendar size={16} color="#60a5fa" />
                                <Text style={styles.statValue}>{stats.joined}</Text>
                            </View>
                            <Text style={styles.statLabel}>Joined</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Vehicle Info Box */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>VEHICLE & FLEET</Text>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.vehicleRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#3b82f620' }]}>
                            <LucideTruck size={24} color="#3b82f6" />
                        </View>
                        <View>
                            <Text style={[styles.cardTitle, { color: theme.text }]}>Tata Xenon Retrieval Unit</Text>
                            <Text style={[styles.cardSubtitle, { color: theme.tabIconDefault }]}>KA-01-EQ-9988</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.vehicleRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#22c55e20' }]}>
                            <LucideCreditCard size={24} color="#22c55e" />
                        </View>
                        <View>
                            <Text style={[styles.cardTitle, { color: theme.text }]}>Commercial License</Text>
                            <View style={styles.verifiedRow}>
                                <LucideShieldCheck size={14} color="#22c55e" />
                                <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: 'bold', marginLeft: 4 }}>ACTIVE & VERIFIED</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Settings & Preferences */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>PREFERENCES</Text>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <LucideLanguages size={24} color={theme.text} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Hindi / हिंदी</Text>
                    </View>
                    <Switch
                        value={isHindi}
                        onValueChange={toggleLanguage}
                        trackColor={{ false: '#767577', true: theme.tint }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: '#ef444420' }]}
                onPress={handleLogout}
            >
                <LucideLogOut size={20} color="#ef4444" style={{ marginRight: 10 }} />
                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Log Out</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    idCardContainer: {
        marginTop: 40,
        marginBottom: 30,
        shadowColor: "#9d50bb",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    idCard: {
        borderRadius: 25,
        padding: 25,
    },
    idHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 25,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: '#22c55e',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#9d50bb', // Match card bg
    },
    verifiedText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    idInfo: {
        flex: 1,
    },
    providerName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    providerTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 5,
    },
    providerId: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 15,
        borderRadius: 15,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 2,
    },
    statValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    vehicleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(150,150,150,0.1)',
        marginVertical: 15,
    },
    verifiedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
    },
});
