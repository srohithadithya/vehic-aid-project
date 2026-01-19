import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideShieldCheck, LucideClock, LucideMapPin, LucideUsers } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={[styles.title, { color: theme.text }]}>About VehicAid</Text>
                <Text style={styles.subtitle}>Revolutionizing roadside assistance.</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.description, { color: theme.text }]}>
                    VehicAid was founded with a simple mission: to make roadside assistance faster, safer, and more transparent.
                    We connect drivers in distress with a network of verified providers instantly.
                </Text>

                <View style={styles.grid}>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <LucideClock size={32} color={theme.tint} style={{ marginBottom: 10 }} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>24/7 Availability</Text>
                        <Text style={styles.cardText}>Our network never sleeps. Get help day or night.</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <LucideShieldCheck size={32} color={theme.tint} style={{ marginBottom: 10 }} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Verified Providers</Text>
                        <Text style={styles.cardText}>All partners are vetted, licensed, and insured.</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <LucideMapPin size={32} color={theme.tint} style={{ marginBottom: 10 }} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Real-Time Tracking</Text>
                        <Text style={styles.cardText}>Watch your provider arrive on the map live.</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <LucideUsers size={32} color={theme.tint} style={{ marginBottom: 10 }} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Community</Text>
                        <Text style={styles.cardText}>Building a community of drivers helping drivers.</Text>
                    </View>
                </View>

                <View style={[styles.footer, { backgroundColor: theme.tint + '10' }]}>
                    <Text style={[styles.footerTitle, { color: theme.text }]}>Our Operations</Text>
                    <Text style={styles.footerText}>
                        From easy booking via our web and mobile apps to seamless payment processing,
                        VehicAid manages the entire lifecycle of roadside assistance.
                    </Text>
                </View>
            </View>
        </ScrollView>
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
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    },
    content: {
        padding: 20,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 30,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    cardText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 40,
    },
    footerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    footerText: {
        color: '#888',
        textAlign: 'center',
        lineHeight: 20,
    },
});
