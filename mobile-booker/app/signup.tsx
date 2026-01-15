import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideArrowLeft } from 'lucide-react-native';

import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Signup() {
    const router = useRouter();
    const { register } = useAuth();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !email || !phone || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register({
                username,
                email,
                phone_number: phone,
                password
            });
        } catch (error: any) {
            const msg = error.response?.data?.error || "Registration failed. Please check your details.";
            Alert.alert('Registration Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>

                <Animated.View entering={FadeInUp.duration(800)} style={styles.headerContainer}>
                    <View style={styles.logoBlur}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>Join VehicAid</Text>
                    <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Experience premium roadside assistance</Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(200).duration(800)}
                    style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                    <View style={styles.inputWrapper}>
                        <LucideUser size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <LucideMail size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <LucidePhone size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            placeholder="Phone Number"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <LucideLock size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <LucideLock size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.tint, opacity: loading ? 0.7 : 1 }]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Started</Text>}
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.loginRow}>
                    <Text style={{ color: theme.tabIconDefault }}>Already member? </Text>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <Text style={[styles.loginText, { color: theme.tint }]}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, padding: 25, justifyContent: 'center' },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    headerContainer: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
    logoBlur: {
        width: 100,
        height: 100,
        borderRadius: 25,
        backgroundColor: 'rgba(157, 80, 187, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    logo: { width: 70, height: 70 },
    title: { fontSize: 30, fontWeight: 'bold' },
    subtitle: { fontSize: 16, marginTop: 5 },
    formContainer: {
        padding: 25,
        borderRadius: 30,
        borderWidth: 1,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 55,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        marginBottom: 15,
    },
    icon: { marginRight: 12 },
    input: { flex: 1, height: '100%', fontSize: 16 },
    button: {
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    loginText: { fontWeight: 'bold' },
});
