import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement actual auth
        router.replace('/(main)/(tabs)/home');
    };

    return (
        <View className="flex-1 bg-background p-6 pt-12">
            <TouchableOpacity
                onPress={() => router.back()}
                className="mb-8 w-10 h-10 items-center justify-center rounded-full bg-surface"
            >
                <ArrowLeft size={24} color="#f8fafc" />
            </TouchableOpacity>

            <Animated.View entering={FadeInDown.duration(600)}>
                <Text className="text-3xl font-bold text-foreground mb-2">Welcome Back</Text>
                <Text className="text-slate-400 text-lg mb-8">Sign in to continue</Text>

                <View className="space-y-4 mb-8">
                    <View className="space-y-2">
                        <Text className="text-slate-400 ml-1">Email</Text>
                        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                            <Mail size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-foreground"
                                placeholder="name@example.com"
                                placeholderTextColor="#64748b"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View className="space-y-2">
                        <Text className="text-slate-400 ml-1">Password</Text>
                        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                            <Lock size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-foreground"
                                placeholder="••••••••"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity className="items-end">
                        <Text className="text-primary font-medium">Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="w-full bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/20"
                    onPress={handleLogin}
                >
                    <Text className="text-black font-bold text-lg">Sign In</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-slate-400">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                        <Text className="text-primary font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}
