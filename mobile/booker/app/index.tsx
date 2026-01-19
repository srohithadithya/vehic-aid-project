import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Landing() {
    const { token, isLoading, checkAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) return null;

    if (token) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-between p-6">
            <View className="items-center mt-20">
                <View className="w-24 h-24 bg-blue-600 rounded-3xl items-center justify-center mb-6 shadow-xl shadow-blue-200">
                    <Text className="text-white text-5xl font-extrabold italic">V</Text>
                </View>
                <Text className="text-4xl font-bold text-gray-900 text-center">Vehic-Aid</Text>
                <Text className="text-lg text-gray-500 text-center mt-2">
                    India's #1 Roadside Assistance
                </Text>
            </View>

            <View className="w-full space-y-4 mb-10">
                <TouchableOpacity
                    className="bg-blue-600 w-full py-4 rounded-xl items-center shadow-lg shadow-blue-200"
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text className="text-white font-bold text-lg">Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white border-2 border-gray-100 w-full py-4 rounded-xl items-center"
                    onPress={() => router.push('/(auth)/signup')}
                >
                    <Text className="text-gray-900 font-bold text-lg">Create Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
