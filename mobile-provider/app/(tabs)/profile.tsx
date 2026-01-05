import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideLanguages, LucideLogOut, LucideUser, LucideCheckCircle, LucideShield } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProviderProfileScreen() {
    const { t, i18n } = useTranslation();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { user, logout } = useAuth();
    const router = useRouter();

    const toggleLanguage = async () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        await i18n.changeLanguage(newLang);
        await AsyncStorage.setItem('provider-language', newLang);
        Alert.alert('Language Updated', `अब इंटरफ़ेस ${newLang === 'en' ? 'English' : 'हिन्दी'} में है`);
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout", style: "destructive", onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
                    <LucideUser size={40} color="#fff" />
                </View>
                <Text style={[styles.userName, { color: theme.text }]}>{user?.username || 'Provider'}</Text>

                <View style={styles.verifyBadge}>
                    <LucideShield size={14} color="#10b981" />
                    <Text style={styles.verifyText}>Verified Partner</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statItem, { backgroundColor: theme.card }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>4.9</Text>
                    <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Rating</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.card }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>124</Text>
                    <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Jobs</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>SETTINGS</Text>

                <TouchableOpacity
                    style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={toggleLanguage}
                >
                    <View style={styles.optionLeft}>
                        <LucideLanguages size={22} color={theme.tint} />
                        <Text style={[styles.optionText, { color: theme.text }]}>Interface Language</Text>
                    </View>
                    <Text style={[styles.currentValue, { color: theme.tabIconDefault }]}>
                        {i18n.language === 'en' ? 'English' : 'हिन्दी'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: '#ef4444' }]}
                    onPress={handleLogout}
                >
                    <LucideLogOut size={22} color="#ef4444" />
                    <Text style={styles.logoutText}>Go Offline & Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 40,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    verifyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b98120',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginTop: 10,
    },
    verifyText: {
        color: '#10b981',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statItem: {
        flex: 0.48,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
    },
    section: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 10,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 15,
        borderWidth: 1,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 15,
    },
    currentValue: {
        fontSize: 14,
    },
    footer: {
        marginTop: 'auto',
        padding: 20,
        paddingBottom: 40,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
