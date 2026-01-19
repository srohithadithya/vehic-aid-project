import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { apiClient } from '../../src/api/client';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useRouter } from 'expo-router';
import { LucideUser, LucideFileText, LucideSettings, LucideLogOut, LucideStar, LucideShieldCheck, LucideChevronRight, LucideCamera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../src/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isOnline, setIsOnline] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // We use the same generic profile endpoint but we can extract provider specific fields
                const response = await apiClient.get('/users/profile/');
                const userData = response.data.user || response.data;
                setProfile(userData);
                setIsOnline(userData.is_available ?? false);

                // Load local avatar
                const storedAvatar = await AsyncStorage.getItem('user_avatar_uri');
                if (storedAvatar) setAvatarUri(storedAvatar);

            } catch (e) {
                console.error(e);
            }
        };
        fetchProfile();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri);
            await AsyncStorage.setItem('user_avatar_uri', result.assets[0].uri);
        }
    };

    const toggleOnline = async (val: boolean) => {
        setIsOnline(val); // Optimistic update
        try {
            await apiClient.post('/users/provider/update-location/', { is_available: val });
        } catch (e: any) {
            console.error("Availability Error:", e.response?.data);
            // Revert if error (e.g. not verified)
            setIsOnline(!val);
            Alert.alert("Status Update Failed", e.response?.data?.error || "Could not update availability. Ensure you are verified.");
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: theme.tint, borderWidth: 2 }]} />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
                            <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'P'}</Text>
                            <View style={styles.cameraIconBadge}>
                                <LucideCamera size={16} color="#fff" />
                            </View>
                        </View>
                    )}
                    {profile?.is_verified && (
                        <View style={styles.checkBadge}>
                            <LucideShieldCheck size={16} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={[styles.name, { color: theme.text }]}>{profile?.full_name || 'Service Provider'}</Text>

                {/* Verification Badge & ID */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 5 }}>
                    {profile?.is_verified ? (
                        <>
                            <LucideShieldCheck size={16} color="#10b981" />
                            <Text style={{ color: '#10b981', fontWeight: 'bold' }}>Verified Partner</Text>
                        </>
                    ) : (
                        <Text style={{ color: theme.tabIconDefault }}>Pending Verification</Text>
                    )}
                </View>

                <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <Text style={[styles.info, { color: theme.tabIconDefault }]}>{profile?.email}</Text>
                    <Text style={[styles.info, { color: theme.tabIconDefault }]}>{profile?.phone || '+91 --- --- ----'}</Text>
                </View>
            </View>

            {/* Digital ID Card Section */}
            <View style={styles.section}>
                <View style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    borderRadius: 16,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: '#1e293b',
                    position: 'relative',
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5
                }}>
                    {/* Background decorations */}
                    <View style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: '#3b82f6', opacity: 0.1 }} />
                    <View style={{ position: 'absolute', left: -20, bottom: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: '#10b981', opacity: 0.1 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <Text style={{ color: '#94a3b8', fontSize: 12, letterSpacing: 1 }}>VEHIC-AID PARTNER ID</Text>
                            <Text style={{ color: '#f8fafc', fontSize: 20, fontWeight: 'bold', marginTop: 5 }}>{profile?.full_name?.toUpperCase()}</Text>
                            <Text style={{ color: '#cbd5e1', fontSize: 14, marginTop: 2 }}>ID: {profile?.id?.toString().padStart(6, '0') || '000000'}</Text>
                        </View>
                        <LucideShieldCheck size={32} color="#3b82f6" />
                    </View>

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <View>
                            <Text style={{ color: '#64748b', fontSize: 10 }}>JOINED</Text>
                            <Text style={{ color: '#e2e8f0', fontSize: 14 }}>{new Date().getFullYear()}</Text>
                        </View>
                        <View>
                            <Text style={{ color: '#64748b', fontSize: 10, textAlign: 'right' }}>STATUS</Text>
                            <Text style={{ color: profile?.is_verified ? '#4ade80' : '#fbbf24', fontSize: 14, fontWeight: 'bold' }}>
                                {profile?.is_verified ? 'ACTIVE' : 'PENDING'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.text }]}>{profile?.average_rating || '4.9'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Rating</Text>
                        <LucideStar size={12} color="#f59e0b" fill="#f59e0b" />
                    </View>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.text }]}>{profile?.jobs_completed || '128'}</Text>
                    <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Jobs</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.text }]}>2.5</Text>
                    <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Years</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={[styles.row, { backgroundColor: theme.card, borderRadius: 15, padding: 15 }]}>
                    <Text style={[styles.rowLabel, { color: theme.text }]}>Go Online</Text>
                    <Switch
                        value={isOnline}
                        onValueChange={toggleOnline}
                        trackColor={{ false: '#767577', true: '#10b981' }}
                    />
                </View>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => router.push('/documents')}>
                    <View style={styles.menuLeft}>
                        <LucideFileText size={20} color={theme.tint} />
                        <Text style={[styles.menuText, { color: theme.text }]}>My Documents</Text>
                    </View>
                    <LucideChevronRight size={20} color={theme.tabIconDefault} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => router.push('/(tabs)/settings')}>
                    <View style={styles.menuLeft}>
                        <LucideSettings size={20} color={theme.tint} />
                        <Text style={[styles.menuText, { color: theme.text }]}>Settings</Text>
                    </View>
                    <LucideChevronRight size={20} color={theme.tabIconDefault} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={handleLogout}>
                    <View style={styles.menuLeft}>
                        <LucideLogOut size={20} color="#ef4444" />
                        <Text style={[styles.menuText, { color: '#ef4444' }]}>Log Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', padding: 30 },
    avatarContainer: { marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
    checkBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#10b981', padding: 6, borderRadius: 15, borderWidth: 3, borderColor: '#fff' },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    role: { fontSize: 16 },
    info: { fontSize: 14, marginBottom: 2 },
    statsCard: { flexDirection: 'row', justifyContent: 'space-between', margin: 20, padding: 20, borderRadius: 20, elevation: 2 },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    statLabel: { fontSize: 12 },
    divider: { width: 1, height: '100%' },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowLabel: { fontSize: 18, fontWeight: '600' },
    menu: { padding: 20 },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 15, marginBottom: 10 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    menuText: { fontSize: 16, fontWeight: '500' },
    cameraIconBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 10 },
});
