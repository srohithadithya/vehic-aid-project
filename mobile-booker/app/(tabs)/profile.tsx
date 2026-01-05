import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, SafeAreaView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideLanguages, LucideCoins, LucideLogOut, LucideChevronRight, LucideUser } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { t, i18n } = useTranslation();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { user, logout } = useAuth();
    const router = useRouter();

    const toggleLanguage = async () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        await i18n.changeLanguage(newLang);
        await AsyncStorage.setItem('user-language', newLang);
        Alert.alert('Language Updated', `Now speaking ${newLang === 'en' ? 'English' : 'हिन्दी'}`);
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
                <Text style={[styles.userName, { color: theme.text }]}>{user?.username || 'Guest'}</Text>
                <Text style={[styles.userEmail, { color: theme.tabIconDefault }]}>{user?.email || 'No email provided'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>PREFERENCES</Text>

                <TouchableOpacity
                    style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={toggleLanguage}
                >
                    <View style={styles.optionLeft}>
                        <LucideLanguages size={22} color={theme.tint} />
                        <Text style={[styles.optionText, { color: theme.text }]}>Language / भाषा</Text>
                    </View>
                    <View style={styles.optionRight}>
                        <Text style={[styles.currentValue, { color: theme.tabIconDefault }]}>
                            {i18n.language === 'en' ? 'English' : 'हिन्दी'}
                        </Text>
                        <LucideChevronRight size={18} color={theme.tabIconDefault} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.optionLeft}>
                        <LucideCoins size={22} color={theme.tint} />
                        <Text style={[styles.optionText, { color: theme.text }]}>Currency</Text>
                    </View>
                    <View style={styles.optionRight}>
                        <Text style={[styles.currentValue, { color: theme.tabIconDefault }]}>INR (₹)</Text>
                        <LucideChevronRight size={18} color={theme.tabIconDefault} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>ACCOUNT</Text>

                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: '#ef4444' }]}
                    onPress={handleLogout}
                >
                    <LucideLogOut size={22} color="#ef4444" />
                    <Text style={styles.logoutText}>Logout</Text>
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
        elevation: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        marginTop: 5,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
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
        marginBottom: 10,
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
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentValue: {
        fontSize: 14,
        marginRight: 10,
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
