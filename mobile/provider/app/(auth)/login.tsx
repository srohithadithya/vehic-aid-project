import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
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
            alert("Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-6 justify-center">
            <View className="items-center mb-10">
                <Text className="text-3xl font-bold text-white">VehicAid Partner</Text>
                <Text className="text-gray-400 mt-2">Provider App</Text>
            </View>

            <View className="space-y-4">
                <View className="bg-gray-800 rounded-xl px-4 py-2 border border-gray-700">
                    <TextInput
                        placeholder="Username"
                        className="h-12 text-base text-white"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        placeholderTextColor="#6b7280"
                    />
                </View>
                <View className="bg-gray-800 rounded-xl px-4 py-2 border border-gray-700">
                    <TextInput
                        placeholder="Password"
                        className="h-12 text-base text-white"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#6b7280"
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-xl items-center mt-4 active:opacity-90"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? "Verifying..." : "Partner Login"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="mt-8 items-center">
                <Text className="text-gray-500 text-sm">Join VehicAid Network</Text>
                <Text className="text-gray-600 text-xs mt-1">Contact support to register</Text>
            </View>
        </SafeAreaView>
    );
}
