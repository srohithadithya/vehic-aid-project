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
        <SafeAreaView className="flex-1 bg-gray-900 items-center justify-between p-6">
            <View className="items-center mt-20">
                <View className="w-24 h-24 bg-blue-600 rounded-3xl items-center justify-center mb-6 shadow-xl shadow-black/50">
                    <Text className="text-white text-5xl font-extrabold italic">V</Text>
                </View>
                <Text className="text-4xl font-bold text-white text-center">Partner App</Text>
                <Text className="text-lg text-gray-400 text-center mt-2">
                    Drive, Serve & Earn
                </Text>
            </View>

            <View className="w-full space-y-4 mb-10">
                <TouchableOpacity
                    className="bg-blue-600 w-full py-4 rounded-xl items-center"
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text className="text-white font-bold text-lg">Partner Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-800 border border-gray-700 w-full py-4 rounded-xl items-center"
                >
                    <Text className="text-gray-300 font-bold text-lg">Register as Partner</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
