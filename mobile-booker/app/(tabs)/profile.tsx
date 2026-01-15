import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideUser, LucideCar, LucideCreditCard, LucideSettings, LucideInfo, LucideLogOut, LucideChevronRight, LucideHeartPulse, LucideMessageSquare, LucideStar, LucideArrowLeftRight, LucideTruck, LucidePhone } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const menuItems = [
        { icon: LucideCar, title: 'My Vehicles', link: '/vehicles' },
        { icon: LucideCreditCard, title: 'Wallet & Payments', link: '/wallet' },
        { icon: LucideStar, title: 'Subscriptions & Plans', link: '/subscriptions' },
        { icon: LucideArrowLeftRight, title: 'Vehicle Exchange', link: '/exchange', premium: true },
        { icon: LucideTruck, title: 'Vehicle Placement', link: '/placement', premium: true },
        { icon: LucidePhone, title: '24/7 Helpline', link: '/helpline', premium: true },
        { icon: LucideHeartPulse, title: 'IoT Device Status', link: '/(tabs)/iot' },
        { icon: LucideMessageSquare, title: 'Support & Help', link: '/(tabs)/chat' },
        { icon: LucideSettings, title: 'Settings', link: '/settings' },
        { icon: LucideInfo, title: 'About VehicAid', link: '/about' },
    ];

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: logout }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={[styles.avatarContainer, { borderColor: theme.tint }]}>
                    <Text style={[styles.avatarText, { color: theme.tint }]}>
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={[styles.name, { color: theme.text }]}>
                    {user?.username || 'Guest User'}
                </Text>
                <Text style={[styles.email, { color: theme.tabIconDefault }]}>
                    {user?.email || 'guest@vehicaid.com'}
                </Text>
                <Text style={[styles.phone, { color: theme.tabIconDefault }]}>
                    {user?.phone_number || '+91 98765 43210'}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.menuContainer}>
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                            onPress={() => item.link ? router.push(item.link as any) : null}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: theme.tint + '15' }]}>
                                    <Icon size={20} color={theme.tint} />
                                </View>
                                <Text style={[styles.menuTitle, { color: theme.text }]}>{item.title}</Text>
                            </View>
                            <LucideChevronRight size={20} color={theme.tabIconDefault} />
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 20 }]}
                    onPress={handleLogout}
                >
                    <View style={styles.menuLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: '#ef444415' }]}>
                            <LucideLogOut size={20} color="#ef4444" />
                        </View>
                        <Text style={[styles.menuTitle, { color: '#ef4444' }]}>Log Out</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.versionContainer}>
                    <Text style={[styles.versionText, { color: theme.tabIconDefault }]}>VehicAid v2.0.0 (Beta)</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(157, 80, 187, 0.05)',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        marginBottom: 2,
    },
    phone: {
        fontSize: 14,
    },
    menuContainer: {
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    versionText: {
        fontSize: 12,
    },
});
