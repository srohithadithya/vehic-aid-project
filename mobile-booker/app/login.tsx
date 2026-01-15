import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideShieldCheck, LucideMail, LucideLock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await login({ username: email, password });
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid credentials or server error');
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
                <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
                    <View style={styles.logoBlur}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>VehicAid</Text>
                    <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Intelligent Roadside Assistance</Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(200).duration(800)}
                    style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                    <View style={styles.inputWrapper}>
                        <LucideMail size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Email / Username"
                            placeholderTextColor={theme.tabIconDefault}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <LucideLock size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Password"
                            placeholderTextColor={theme.tabIconDefault}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.tint, opacity: loading ? 0.8 : 1 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={[styles.forgotText, { color: theme.tint }]}>Forgot password?</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.footer}>
                    <Text style={{ color: theme.tabIconDefault }}>New to VehicAid? </Text>
                    <TouchableOpacity onPress={() => router.push('/signup')}>
                        <Text style={[styles.signUpText, { color: theme.tint }]}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 25 },
    header: { alignItems: 'center', marginBottom: 50 },
    logoBlur: {
        width: 120,
        height: 120,
        borderRadius: 30,
        backgroundColor: 'rgba(157, 80, 187, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: { width: 90, height: 90 },
    title: { fontSize: 34, fontWeight: 'bold', letterSpacing: -1 },
    subtitle: { fontSize: 16, textAlign: 'center', marginTop: 8 },
    formContainer: {
        padding: 30,
        borderRadius: 30,
        borderWidth: 1,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 60,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.03)',
        marginBottom: 20,
    },
    icon: { marginRight: 15 },
    input: { flex: 1, height: '100%', fontSize: 16 },
    button: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    forgotPassword: { alignItems: 'center', marginTop: 20 },
    forgotText: { fontSize: 14, fontWeight: '500' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    signUpText: { fontWeight: 'bold' },
});
