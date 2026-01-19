import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, CreditCard, Clock, LogOut, ChevronRight, User as UserIcon } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-6 bg-white mb-4">
                <Text className="text-2xl font-bold text-gray-900 mb-6">Profile</Text>
                <View className="flex-row items-center">
                    <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
                        <Text className="text-2xl font-bold text-blue-600">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-xl font-bold text-gray-800">{user?.username || 'Guest User'}</Text>
                        <Text className="text-gray-500">{user?.email || 'guest@example.com'}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* Subscription Card */}
                <TouchableOpacity
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-blue-600 p-4 rounded-xl mb-6 flex-row items-center justify-between shadow-sm"
                    onPress={() => router.push('/subscription/plans')}
                >
                    <View className="flex-row items-center">
                        <View className="bg-white/20 p-2 rounded-lg mr-3">
                            <Crown color="white" size={24} />
                        </View>
                        <View>
                            <Text className="text-white font-bold text-lg">Upgrade to Premium</Text>
                            <Text className="text-blue-100 text-xs">Get free towing & priority support</Text>
                        </View>
                    </View>
                    <ChevronRight color="white" size={20} />
                </TouchableOpacity>

                <View className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
                        <UserIcon size={20} color="#4b5563" />
                        <Text className="flex-1 ml-3 text-gray-700 font-medium">Edit Profile</Text>
                        <ChevronRight size={16} color="#9ca3af" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
                        <CreditCard size={20} color="#4b5563" />
                        <Text className="flex-1 ml-3 text-gray-700 font-medium">Payment Methods</Text>
                        <ChevronRight size={16} color="#9ca3af" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
                        <Clock size={20} color="#4b5563" />
                        <Text className="flex-1 ml-3 text-gray-700 font-medium">Service History</Text>
                        <ChevronRight size={16} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl"
                    onPress={handleLogout}
                >
                    <LogOut size={20} color="#dc2626" />
                    <Text className="ml-2 text-red-600 font-bold">Log Out</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-400 text-xs mt-8">Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
