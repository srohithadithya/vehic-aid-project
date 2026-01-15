import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LucideArrowLeft } from 'lucide-react-native';
import Colors from '../../constants/Colors';

export default function AboutScreen() {
    const router = useRouter();
    const theme = Colors.dark;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>About</Text>
            </View>

            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/provider_logo_final.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={[styles.appName, { color: theme.text }]}>Vehic-Aid</Text>
                <Text style={[styles.version, { color: theme.tabIconDefault }]}>Provider Edition v2.1.0</Text>

                <Text style={[styles.description, { color: theme.text }]}>
                    Empowering Roadside Heroes.
                </Text>

                <Text style={[styles.copyright, { color: theme.tabIconDefault }]}>
                    © {new Date().getFullYear()} Vehic-Aid Inc. All rights reserved.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
    backButton: { marginRight: 15 },
    title: { fontSize: 24, fontWeight: 'bold' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    logo: { width: 150, height: 150, marginBottom: 20 },
    appName: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
    version: { fontSize: 16, marginBottom: 20 },
    description: { fontSize: 18, fontStyle: 'italic', marginBottom: 40 },
    copyright: { fontSize: 12, position: 'absolute', bottom: 20 },
});
