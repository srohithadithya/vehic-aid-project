import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Truck, Phone, Star, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [available, setAvailable] = useState(true);

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <View className="p-6 bg-gray-800 mb-4 border-b border-gray-700">
                <Text className="text-2xl font-bold text-white mb-6">Partner Profile</Text>
                <View className="flex-row items-center">
                    <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-4 border-2 border-blue-400">
                        <User size={32} color="white" />
                    </View>
                    <View>
                        <Text className="text-xl font-bold text-white">John Doe</Text>
                        <View className="flex-row items-center mt-1">
                            <Star size={14} color="#fbbf24" fill="#fbbf24" />
                            <Text className="text-yellow-400 ml-1 font-bold">4.8 Rating</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* Status Toggle Card */}
                <View className="bg-gray-800 p-4 rounded-xl mb-6 flex-row items-center justify-between border border-gray-700">
                    <Text className="text-gray-300 font-medium">Available for Jobs</Text>
                    <Switch
                        value={available}
                        onValueChange={setAvailable}
                        trackColor={{ false: '#374151', true: '#16a34a' }}
                        thumbColor={'#fff'}
                    />
                </View>

                <View className="bg-gray-800 rounded-xl overflow-hidden mb-6 border border-gray-700">
                    <View className="p-4 border-b border-gray-700">
                        <Text className="text-gray-400 text-xs uppercase font-bold mb-2">VEHICLE DETAILS</Text>
                        <View className="flex-row items-center">
                            <Truck size={20} color="#60a5fa" />
                            <View className="ml-3">
                                <Text className="text-white font-bold">Toyota Tow Truck</Text>
                                <Text className="text-gray-500 text-sm">KA 01 MG 1234</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-700">
                        <Text className="flex-1 text-gray-300 font-medium">Edit Vehicle</Text>
                        <ChevronRight size={16} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                <View className="bg-gray-800 rounded-xl overflow-hidden mb-6 border border-gray-700">
                    <Text className="text-gray-400 text-xs uppercase font-bold p-4 pb-2">SETTINGS</Text>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-700">
                        <Text className="flex-1 text-gray-300 font-medium">Documents & License</Text>
                        <ChevronRight size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-700">
                        <Text className="flex-1 text-gray-300 font-medium">Bank Details</Text>
                        <ChevronRight size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-700">
                        <Text className="flex-1 text-gray-300 font-medium">Support</Text>
                        <ChevronRight size={16} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="flex-row items-center justify-center p-4 bg-red-900/20 rounded-xl border border-red-900/50"
                    onPress={handleLogout}
                >
                    <LogOut size={20} color="#f87171" />
                    <Text className="ml-2 text-red-500 font-bold">Log Out</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-600 text-xs mt-8">Partner App v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
