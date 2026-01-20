import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, Globe, CreditCard, Bell, Shield, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

export default function Settings() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#f8fafc" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground ml-4">Settings</Text>
            </View>

            <ScrollView className="flex-1 p-6">

                <View className="space-y-6">

                    {/* Appearance */}
                    <View className="space-y-4">
                        <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest ml-1">Appearance</Text>
                        <View className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                            <View className="p-4 flex-row items-center justify-between border-b border-white/5">
                                <View className="flex-row items-center">
                                    <View className="p-2 rounded-lg bg-white/5 mr-3">
                                        <Moon size={18} color="#94a3b8" />
                                    </View>
                                    <Text className="text-foreground">Dark Mode</Text>
                                </View>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={setIsDarkMode}
                                    trackColor={{ false: '#334155', true: '#14b8a6' }}
                                    thumbColor="#f8fafc"
                                />
                            </View>
                            <TouchableOpacity className="p-4 flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <View className="p-2 rounded-lg bg-white/5 mr-3">
                                        <Globe size={18} color="#94a3b8" />
                                    </View>
                                    <Text className="text-foreground">Language</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-slate-500 text-sm mr-2">English</Text>
                                    <ChevronRight size={16} color="#475569" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Payments */}
                    <View className="space-y-4">
                        <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest ml-1">Payments</Text>
                        <TouchableOpacity className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="p-2 rounded-lg bg-white/5 mr-3">
                                    <CreditCard size={18} color="#94a3b8" />
                                </View>
                                <Text className="text-foreground">Saved Cards & Methods</Text>
                            </View>
                            <ChevronRight size={16} color="#475569" />
                        </TouchableOpacity>
                    </View>

                    {/* Notifications */}
                    <View className="space-y-4">
                        <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest ml-1">Notifications</Text>
                        <View className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="p-2 rounded-lg bg-white/5 mr-3">
                                    <Bell size={18} color="#94a3b8" />
                                </View>
                                <Text className="text-foreground">Push Notifications</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#334155', true: '#14b8a6' }}
                                thumbColor="#f8fafc"
                            />
                        </View>
                    </View>

                    {/* Privacy */}
                    <View className="space-y-4">
                        <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest ml-1">Privacy & Security</Text>
                        <TouchableOpacity className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="p-2 rounded-lg bg-white/5 mr-3">
                                    <Shield size={18} color="#94a3b8" />
                                </View>
                                <Text className="text-foreground">Security Settings</Text>
                            </View>
                            <ChevronRight size={16} color="#475569" />
                        </TouchableOpacity>
                    </View>

                </View>
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
