import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation, Phone, CheckCircle, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import { api } from '../../services/api';

export default function JobDetails() {
    const { id } = useLocalSearchParams();
    const [status, setStatus] = useState('ACCEPTED'); // ACCEPTED -> ARRIVED -> IN_PROGRESS -> COMPLETED
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await api.post(`/provider/update/${id}/`, { status: newStatus });
            setStatus(newStatus);
            if (newStatus === 'COMPLETED') {
                Alert.alert("Job Completed", "Earnings added to your wallet.");
                router.replace('/(tabs)');
            }
        } catch (e) {
            Alert.alert("Error", "Failed to update status");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <View className="px-6 py-4 border-b border-gray-800 flex-row justify-between items-center">
                <Text className="text-white text-xl font-bold">Job #{id}</Text>
                <View className="bg-green-900/50 px-3 py-1 rounded-full">
                    <Text className="text-green-400 font-bold text-xs">{status.replace('_', ' ')}</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                {/* Customer Card */}
                <View className="bg-gray-800 p-5 rounded-xl border border-gray-700 mb-6">
                    <Text className="text-gray-400 text-xs uppercase font-bold mb-4">Customer Details</Text>
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-white text-xl font-bold">Rahul Kumar</Text>
                            <Text className="text-gray-400">+91 98765 43210</Text>
                        </View>
                        <TouchableOpacity className="bg-green-600 p-3 rounded-full">
                            <Phone size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location */}
                <View className="bg-gray-800 p-5 rounded-xl border border-gray-700 mb-6">
                    <View className="flex-row items-center mb-4">
                        <Navigation size={24} color="#3b82f6" />
                        <Text className="text-white text-lg font-bold ml-3">Pickup Location</Text>
                    </View>
                    <Text className="text-gray-300 ml-9 text-base">
                        Near Wipro Park, 80 Feet Road, Koramangala 1st Block
                    </Text>
                    <TouchableOpacity className="bg-blue-600 mt-6 py-3 rounded-lg flex-row items-center justify-center">
                        <Navigation size={18} color="white" />
                        <Text className="text-white font-bold ml-2">Navigate</Text>
                    </TouchableOpacity>
                </View>

                {/* Action Button */}
                <View className="mt-4">
                    {status === 'ACCEPTED' && (
                        <TouchableOpacity
                            className="bg-purple-600 py-4 rounded-xl items-center"
                            onPress={() => handleStatusUpdate('ARRIVED')}
                        >
                            <Text className="text-white font-bold text-lg">Mark Arrived</Text>
                        </TouchableOpacity>
                    )}
                    {status === 'ARRIVED' && (
                        <TouchableOpacity
                            className="bg-blue-600 py-4 rounded-xl items-center"
                            onPress={() => handleStatusUpdate('IN_PROGRESS')}
                        >
                            <Text className="text-white font-bold text-lg">Start Service</Text>
                        </TouchableOpacity>
                    )}
                    {status === 'IN_PROGRESS' && (
                        <TouchableOpacity
                            className="bg-green-600 py-4 rounded-xl items-center"
                            onPress={() => handleStatusUpdate('COMPLETED')}
                        >
                            <Text className="text-white font-bold text-lg">Complete Job</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
