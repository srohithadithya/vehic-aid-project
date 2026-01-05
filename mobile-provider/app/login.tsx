import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideTruck, LucideMail, LucideLock } from 'lucide-react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            await login({ username: email, password });
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid provider credentials');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <LucideTruck size={80} color={theme.tint} />
                    <Text style={[styles.title, { color: theme.text }]}>Vehic-Aid</Text>
                    <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Service Provider Terminal</Text>
                </View>

                <View style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.inputWrapper}>
                        <LucideMail size={20} color={theme.tint} style={styles.icon} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Provider Username"
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
                            placeholder="Terminal Password"
                            placeholderTextColor={theme.tabIconDefault}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.tint }]}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>Access Terminal</Text>
                    </TouchableOpacity>
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
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
    },
    formContainer: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 210, 255, 0.2)',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    button: {
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
