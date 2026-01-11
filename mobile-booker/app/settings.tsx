import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LucideLanguages, LucideMoon } from 'lucide-react-native';
import i18n from '../src/i18n';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { t, i18n: i18nInstance } = useTranslation();
    const [isHindi, setIsHindi] = useState(i18n.language === 'hi');

    const toggleLanguage = async (value: boolean) => {
        setIsHindi(value);
        const newLang = value ? 'hi' : 'en';
        i18nInstance.changeLanguage(newLang);
        await AsyncStorage.setItem('user-language', newLang);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
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
                <View style={[styles.item, { backgroundColor: theme.card }]}>
                    <Text style={[styles.itemText, { color: theme.text }]}>Version</Text>
                    <Text style={{ color: theme.tabIconDefault }}>2.0.0 (Beta)</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        marginBottom: 10,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
