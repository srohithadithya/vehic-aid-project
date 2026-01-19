import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        try {
            // Implement signup API call
            // await api.post('/auth/register/', formData);
            alert("Account created! Please login.");
            router.back();
        } catch (e) {
            alert("Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <TouchableOpacity onPress={() => router.back()} className="mb-6">
                <Text className="text-blue-600 font-bold">Back to Login</Text>
            </TouchableOpacity>

            <Text className="text-3xl font-bold text-gray-900 mb-8">Create Account</Text>

            <View className="space-y-4">
                <View className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                    <TextInput
                        placeholder="Username"
                        className="h-12 text-base"
                        value={formData.username}
                        onChangeText={(t) => setFormData({ ...formData, username: t })}
                        autoCapitalize="none"
                    />
                </View>
                <View className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                    <TextInput
                        placeholder="Email"
                        className="h-12 text-base"
                        value={formData.email}
                        onChangeText={(t) => setFormData({ ...formData, email: t })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                    <TextInput
                        placeholder="Phone Number"
                        className="h-12 text-base"
                        value={formData.phone}
                        onChangeText={(t) => setFormData({ ...formData, phone: t })}
                        keyboardType="phone-pad"
                    />
                </View>
                <View className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-200">
                    <TextInput
                        placeholder="Password"
                        className="h-12 text-base"
                        value={formData.password}
                        onChangeText={(t) => setFormData({ ...formData, password: t })}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-primary p-4 rounded-xl items-center mt-6 active:opacity-90"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? "Creating..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
