import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideUpload, LucideCheck, LucideFileText, LucideChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function DocumentsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // Mock State for Documents
    const [docs, setDocs] = useState([
        { id: 'LICENSE', label: 'Driving License', status: 'VERIFIED', uri: null },
        { id: 'RC', label: 'Vehicle RC', status: 'PENDING', uri: null },
        { id: 'INSURANCE', label: 'Vehicle Insurance', status: 'MISSING', uri: null },
    ]);

    const pickImage = async (id: string) => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setDocs(current => current.map(doc =>
                doc.id === id ? { ...doc, status: 'PENDING', uri: result.assets[0].uri as any } : doc
            ));
            Alert.alert("Uploaded", "Document submitted for verification.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'VERIFIED': return '#10b981';
            case 'PENDING': return '#f59e0b';
            case 'MISSING': return '#ef4444';
            default: return theme.text;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <LucideChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>My Documents</Text>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>
                    Please upload valid documents to activate your account.
                </Text>

                {docs.map((doc) => (
                    <View key={doc.id} style={[styles.card, { backgroundColor: theme.card, borderColor: doc.uri ? theme.tint : theme.border }]}>
                        <View style={styles.cardHeader}>
                            <View style={styles.labelRow}>
                                <LucideFileText size={20} color={theme.text} />
                                <Text style={[styles.docLabel, { color: theme.text }]}>{doc.label}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: getStatusColor(doc.status) + '20' }]}>
                                <Text style={[styles.badgeText, { color: getStatusColor(doc.status) }]}>{doc.status}</Text>
                            </View>
                        </View>

                        {doc.uri && (
                            <Image source={{ uri: doc.uri }} style={styles.preview} />
                        )}

                        <TouchableOpacity
                            style={[styles.uploadButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                            onPress={() => pickImage(doc.id)}
                        >
                            <LucideUpload size={18} color={theme.tint} />
                            <Text style={[styles.uploadText, { color: theme.tint }]}>
                                {doc.uri ? 'Replace Document' : 'Upload Document'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
    backBtn: { marginRight: 15 },
    title: { fontSize: 24, fontWeight: 'bold' },
    list: { padding: 20 },
    subtitle: { marginBottom: 20, lineHeight: 20 },
    card: { borderRadius: 15, padding: 15, marginBottom: 20, borderWidth: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    docLabel: { fontSize: 16, fontWeight: '600' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    preview: { width: '100%', height: 150, borderRadius: 10, marginBottom: 15, resizeMode: 'cover' },
    uploadButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', gap: 8 },
    uploadText: { fontWeight: '600' },
});
