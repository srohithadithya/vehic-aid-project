import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LucideArrowLeft, LucideMail, LucidePhone } from 'lucide-react-native';
import Colors from '../../constants/Colors';

export default function HelpScreen() {
    const router = useRouter();
    const theme = Colors.dark; // Force dark for consistency

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Help & Support</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Contact Support</Text>
                    <Text style={[styles.cardText, { color: theme.tabIconDefault }]}>
                        Our team is available 24/7 to assist you.
                    </Text>

                    <TouchableOpacity style={styles.row}>
                        <LucidePhone size={20} color={theme.tint} />
                        <Text style={[styles.link, { color: theme.tint }]}>+91 1800-VEHIC-AID</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.row}>
                        <LucideMail size={20} color={theme.tint} />
                        <Text style={[styles.link, { color: theme.tint }]}>support@vehicaid.com</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>FAQ</Text>
                    <Text style={[styles.question, { color: theme.text }]}>How do I get paid?</Text>
                    <Text style={[styles.answer, { color: theme.tabIconDefault }]}>
                        Payments are settled daily to your linked bank account.
                    </Text>

                    <Text style={[styles.question, { color: theme.text }]}>How do I go offline?</Text>
                    <Text style={[styles.answer, { color: theme.tabIconDefault }]}>
                        Toggle the "Go Online" switch in your Profile tab.
                    </Text>
                </View>
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
    card: { padding: 20, borderRadius: 15, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    cardText: { fontSize: 14, marginBottom: 15 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    link: { fontSize: 16, fontWeight: '500' },
    question: { fontSize: 16, fontWeight: '600', marginTop: 10 },
    answer: { fontSize: 14, marginTop: 5, lineHeight: 20 },
});
