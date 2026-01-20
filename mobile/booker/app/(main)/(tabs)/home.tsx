import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Bell, User as UserIcon, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export default function Home() {
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Top Navbar */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Menu size={24} color="#f8fafc" />
                </TouchableOpacity>

                <Text className="text-xl font-bold text-foreground">
                    Vehic<Text className="text-primary">Aid</Text>
                </Text>

                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <View className="w-8 h-8 rounded-full bg-surface items-center justify-center border border-white/10">
                        <UserIcon size={18} color="#94a3b8" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Saved Vehicles Section */}
                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-semibold text-foreground">Your Vehicles</Text>
                        <TouchableOpacity>
                            <Text className="text-primary text-sm">View All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
                        {/* Vehicle Card 1 */}
                        <View className="w-72 bg-surface p-4 rounded-xl border border-white/5 mr-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="w-10 h-10 bg-blue-500/20 rounded-lg items-center justify-center">
                                    <Text className="text-xl">🚗</Text>
                                </View>
                                <View className="bg-primary/20 px-2 py-1 rounded text-xs">
                                    <Text className="text-primary text-xs font-bold">ACTIVE</Text>
                                </View>
                            </View>
                            <Text className="text-foreground font-bold text-lg">Toyota Camry</Text>
                            <Text className="text-slate-400 text-sm">TN 01 AB 1234</Text>
                        </View>

                        {/* Add New Vehicle Card */}
                        <TouchableOpacity className="w-20 bg-surface/50 rounded-xl border border-dashed border-white/20 items-center justify-center">
                            <Plus size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Dashboard / History */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-foreground mb-4">Recent Activity</Text>

                    {/* History Item */}
                    <View className="bg-surface p-4 rounded-xl border border-white/5 mb-3 flex-row items-center">
                        <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                            <Text>✅</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-foreground font-medium">Towing Service</Text>
                            <Text className="text-slate-400 text-xs">Jan 15, 2026 • 10:30 AM</Text>
                        </View>
                        <Text className="text-foreground font-bold">₹450</Text>
                    </View>

                    {/* History Item */}
                    <View className="bg-surface p-4 rounded-xl border border-white/5 mb-3 flex-row items-center">
                        <View className="w-10 h-10 bg-yellow-500/20 rounded-full items-center justify-center mr-4">
                            <Text>⚡</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-foreground font-medium">Battery Jumpstart</Text>
                            <Text className="text-slate-400 text-xs">Dec 20, 2025 • 2:15 PM</Text>
                        </View>
                        <Text className="text-foreground font-bold">₹250</Text>
                    </View>
                </View>

                {/* User Stats/Data */}
                <View className="flex-row space-x-4 mb-20">
                    <View className="flex-1 bg-surface p-4 rounded-xl border border-white/5">
                        <Text className="text-slate-400 text-xs mb-1">Total Spent</Text>
                        <Text className="text-2xl font-bold text-foreground">₹3.2k</Text>
                    </View>
                    <View className="flex-1 bg-surface p-4 rounded-xl border border-white/5">
                        <Text className="text-slate-400 text-xs mb-1">Services</Text>
                        <Text className="text-2xl font-bold text-foreground">12</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
