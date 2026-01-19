import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DocumentsScreen() {
    const [documents, setDocuments] = useState({
        drivingLicense: null,
        vehicleInsurance: null,
        vehicleRegistration: null,
        identityProof: null,
        addressProof: null,
    });

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/providers/documents/`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        }
    };

    const pickDocument = async (type: string) => {
        Alert.alert(
            'Upload Document',
            'Choose upload method',
            [
                {
                    text: 'Take Photo',
                    onPress: () => pickImage(type),
                },
                {
                    text: 'Choose File',
                    onPress: () => pickFile(type),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const pickImage = async (type: string) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadDocument(type, result.assets[0].uri);
        }
    };

    const pickFile = async (type: string) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf'],
        });

        if (result.type === 'success') {
            uploadDocument(type, result.uri);
        }
    };

    const uploadDocument = async (type: string, uri: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();
            formData.append('document_type', type);
            formData.append('file', {
                uri,
                name: `${type}.jpg`,
                type: 'image/jpeg',
            } as any);

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/providers/documents/upload/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                Alert.alert('Success', 'Document uploaded successfully');
                fetchDocuments();
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload document');
        }
    };

    const DocumentCard = ({ title, type, icon, status, expiryDate }: any) => (
        <View style={styles.documentCard}>
            <View style={styles.documentHeader}>
                <View style={[styles.iconContainer, status === 'verified' && styles.iconVerified]}>
                    <Ionicons name={icon} size={24} color={status === 'verified' ? '#10b981' : '#6b7280'} />
                </View>
                <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{title}</Text>
                    {status && (
                        <View style={styles.statusContainer}>
                            <View style={[
                                styles.statusDot,
                                status === 'verified' && styles.statusVerified,
                                status === 'pending' && styles.statusPending,
                                status === 'rejected' && styles.statusRejected,
                            ]} />
                            <Text style={[
                                styles.statusText,
                                status === 'verified' && styles.statusVerifiedText,
                                status === 'pending' && styles.statusPendingText,
                                status === 'rejected' && styles.statusRejectedText,
                            ]}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                        </View>
                    )}
                    {expiryDate && (
                        <Text style={styles.expiryText}>Expires: {expiryDate}</Text>
                    )}
                </View>
            </View>
            <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument(type)}
            >
                <Ionicons name={status ? 'refresh' : 'cloud-upload'} size={20} color="#2563eb" />
                <Text style={styles.uploadButtonText}>
                    {status ? 'Update' : 'Upload'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Documents</Text>
                <Text style={styles.subtitle}>Upload and manage your documents</Text>
            </View>

            <View style={styles.alertCard}>
                <Ionicons name="information-circle" size={24} color="#2563eb" />
                <View style={styles.alertText}>
                    <Text style={styles.alertTitle}>Verification Required</Text>
                    <Text style={styles.alertDescription}>
                        Please upload all required documents to complete your profile verification
                    </Text>
                </View>
            </View>

            <View style={styles.documentsContainer}>
                <DocumentCard
                    title="Driving License"
                    type="drivingLicense"
                    icon="card"
                    status="verified"
                    expiryDate="Dec 31, 2026"
                />
                <DocumentCard
                    title="Vehicle Insurance"
                    type="vehicleInsurance"
                    icon="shield-checkmark"
                    status="pending"
                    expiryDate="Jun 30, 2026"
                />
                <DocumentCard
                    title="Vehicle Registration"
                    type="vehicleRegistration"
                    icon="car"
                    status="verified"
                />
                <DocumentCard
                    title="Identity Proof (Aadhar/PAN)"
                    type="identityProof"
                    icon="person"
                    status="verified"
                />
                <DocumentCard
                    title="Address Proof"
                    type="addressProof"
                    icon="home"
                    status={null}
                />
            </View>

            <View style={styles.helpCard}>
                <Ionicons name="help-circle" size={24} color="#6b7280" />
                <View style={styles.helpText}>
                    <Text style={styles.helpTitle}>Need Help?</Text>
                    <Text style={styles.helpDescription}>
                        Contact support if you have any issues with document verification
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    alertCard: {
        flexDirection: 'row',
        backgroundColor: '#eff6ff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2563eb',
    },
    alertText: {
        marginLeft: 12,
        flex: 1,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 4,
    },
    alertDescription: {
        fontSize: 14,
        color: '#3b82f6',
    },
    documentsContainer: {
        padding: 16,
        paddingTop: 0,
    },
    documentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    documentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconVerified: {
        backgroundColor: '#d1fae5',
    },
    documentInfo: {
        marginLeft: 12,
        flex: 1,
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusVerified: {
        backgroundColor: '#10b981',
    },
    statusPending: {
        backgroundColor: '#f59e0b',
    },
    statusRejected: {
        backgroundColor: '#ef4444',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statusVerifiedText: {
        color: '#059669',
    },
    statusPendingText: {
        color: '#d97706',
    },
    statusRejectedText: {
        color: '#dc2626',
    },
    expiryText: {
        fontSize: 12,
        color: '#6b7280',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#eff6ff',
    },
    uploadButtonText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#2563eb',
    },
    helpCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
    },
    helpText: {
        marginLeft: 12,
        flex: 1,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    helpDescription: {
        fontSize: 14,
        color: '#6b7280',
    },
});
