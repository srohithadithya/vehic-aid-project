import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react-native';

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        // TODO: Implement actual signup
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
                <Text className="text-3xl font-bold text-foreground mb-2">Create Account</Text>
                <Text className="text-slate-400 text-lg mb-8">Join VehicAid today</Text>

                <View className="space-y-4 mb-8">
                    <View className="space-y-2">
                        <Text className="text-slate-400 ml-1">Full Name</Text>
                        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                            <User size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-foreground"
                                placeholder="John Doe"
                                placeholderTextColor="#64748b"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

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
                        <Text className="text-slate-400 ml-1">Phone</Text>
                        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 py-3">
                            <Phone size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-foreground"
                                placeholder="+91 98765 43210"
                                placeholderTextColor="#64748b"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
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
                </View>

                <TouchableOpacity
                    className="w-full bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/20"
                    onPress={handleSignup}
                >
                    <Text className="text-black font-bold text-lg">Create Account</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-slate-400">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text className="text-primary font-bold">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}
