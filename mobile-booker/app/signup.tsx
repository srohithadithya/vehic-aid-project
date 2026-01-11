import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideArrowLeft } from 'lucide-react-native';

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
            // Provide feedback is handled inside register (auto login) or throws error
            // If success, AuthContext redirects, but we might want to show a toast?
            // AuthContext does router.replace('/(tabs)'), so we are good.
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

                <View style={styles.headerContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={[styles.title, { color: theme.text }]}>Join VehicAid</Text>
                    <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Create an account to get started</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideUser size={20} color={theme.tabIconDefault} style={styles.icon} />
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideMail size={20} color={theme.tabIconDefault} style={styles.icon} />
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

                    <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucidePhone size={20} color={theme.tabIconDefault} style={styles.icon} />
                        <TextInput
                            placeholder="Phone Number"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideLock size={20} color={theme.tabIconDefault} style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={theme.tabIconDefault}
                            style={[styles.input, { color: theme.text }]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <LucideLock size={20} color={theme.tabIconDefault} style={styles.icon} />
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
                        <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <View style={styles.loginRow}>
                        <Text style={{ color: theme.tabIconDefault }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={[styles.loginText, { color: theme.tint }]}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 60,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    button: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        fontWeight: 'bold',
    },
});
