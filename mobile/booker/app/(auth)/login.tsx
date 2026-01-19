import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login(username, password);
            router.replace('/(tabs)');
        } catch (e) {
            alert("Login failed. Please check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6 justify-center">
            <View className="items-center mb-10">
                <Text className="text-3xl font-bold text-primary">VehicAid</Text>
                <Text className="text-gray-500 mt-2">Booker App</Text>
            </View>

            <View className="space-y-4">
                <View className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                    <TextInput
                        placeholder="Email / Username"
                        className="h-12 text-base"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        placeholderTextColor="#9ca3af"
                    />
                </View>
                <View className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                    <TextInput
                        placeholder="Password"
                        className="h-12 text-base"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <TouchableOpacity
                    className="bg-primary p-4 rounded-xl items-center mt-4 active:opacity-90"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? "Logging in..." : "Login"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="mt-8 flex-row justify-center">
                <Text className="text-gray-500">Don't have an account? </Text>
                <Link href="/(auth)/signup" asChild>
                    <TouchableOpacity>
                        <Text className="text-primary font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}
