import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LucideArrowLeft } from 'lucide-react-native';
import Colors from '../../constants/Colors';

export default function TermsScreen() {
    const router = useRouter();
    const theme = Colors.dark;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Terms & Privacy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.h2, { color: theme.text }]}>1. Introduction</Text>
                <Text style={[styles.p, { color: theme.tabIconDefault }]}>
                    Welcome to Vehic-Aid. By using our platform, you agree to these terms.
                </Text>

                <Text style={[styles.h2, { color: theme.text }]}>2. Service Standards</Text>
                <Text style={[styles.p, { color: theme.tabIconDefault }]}>
                    Providers must maintain a minimum rating of 4.0. Failure to do so may result in suspension.
                </Text>

                <Text style={[styles.h2, { color: theme.text }]}>3. Privacy Policy</Text>
                <Text style={[styles.p, { color: theme.tabIconDefault }]}>
                    We collect location data to match you with nearby requests. Your data is encrypted and secure.
                </Text>

                <Text style={[styles.h2, { color: theme.text }]}>4. Payments</Text>
                <Text style={[styles.p, { color: theme.tabIconDefault }]}>
                    Vehic-Aid charges a 10% platform fee on all completed services.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
    backButton: { marginRight: 15 },
    title: { fontSize: 24, fontWeight: 'bold' },
    content: { paddingBottom: 30 },
    h2: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    p: { fontSize: 14, lineHeight: 22 },
});
