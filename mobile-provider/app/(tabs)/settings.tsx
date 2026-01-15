import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideLanguages, LucideMoon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isHindi, setIsHindi] = useState(false);
    const router = useRouter();

    const toggleLanguage = async (value: boolean) => {
        setIsHindi(value);
        await AsyncStorage.setItem('user-language', value ? 'hi' : 'en');
        // Reload or toast
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>PREFERENCES</Text>

                <View style={[styles.item, { backgroundColor: theme.card }]}>
                    <View style={styles.itemLeft}>
                        <LucideLanguages size={24} color={theme.text} />
                        <Text style={[styles.itemText, { color: theme.text }]}>Hindi / हिंदी</Text>
                    </View>
                    <Switch
                        value={isHindi}
                        onValueChange={toggleLanguage}
                        trackColor={{ false: '#767577', true: theme.tint }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>

                <View style={[styles.item, { backgroundColor: theme.card, marginTop: 1 }]}>
                    <View style={styles.itemLeft}>
                        <LucideMoon size={24} color={theme.text} />
                        <Text style={[styles.itemText, { color: theme.text }]}>Dark Mode</Text>
                    </View>
                    <Text style={{ color: theme.tabIconDefault }}>System Default</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>APP INFO</Text>

                <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]}>
                    <Text style={[styles.itemText, { color: theme.text }]}>Notifications</Text>
                    <Switch value={true} trackColor={{ false: '#767577', true: theme.tint }} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]} onPress={() => router.push('/options/help')}>
                    <Text style={[styles.itemText, { color: theme.text }]}>Help & Support</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]} onPress={() => router.push('/options/terms')}>
                    <Text style={[styles.itemText, { color: theme.text }]}>Terms & Privacy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]} onPress={() => router.push('/options/about')}>
                    <Text style={[styles.itemText, { color: theme.text }]}>About Vehic-Aid</Text>
                </TouchableOpacity>

                <View style={[styles.item, { backgroundColor: theme.card, marginTop: 10 }]}>
                    <Text style={[styles.itemText, { color: theme.text }]}>Version</Text>
                    <Text style={{ color: theme.tabIconDefault }}>2.1.0 (Stable)</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { marginTop: 40, marginBottom: 30 },
    title: { fontSize: 32, fontWeight: 'bold' },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginLeft: 10 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 15, marginBottom: 10 },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    itemText: { fontSize: 16, fontWeight: '500' },
});
