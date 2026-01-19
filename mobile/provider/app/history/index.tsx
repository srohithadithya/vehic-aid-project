import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function JobHistory() {
    const router = useRouter();

    const history = [
        { id: 101, type: 'Towing', from: 'Indiranagar', to: 'Koramangala', earning: '₹350', date: 'Today, 10:30 AM', status: 'COMPLETED' },
        { id: 102, type: 'Jumpstart', from: 'MG Road', to: '-', earning: '₹150', date: 'Yesterday, 4:15 PM', status: 'COMPLETED' },
        { id: 103, type: 'Towing', from: 'Whitefield', to: 'Marathahalli', earning: '₹0', date: 'Oct 20, 2:00 PM', status: 'CANCELLED' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <View className="px-6 py-4 border-b border-gray-800 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Job History</Text>
            </View>

            <ScrollView className="p-6">
                {history.map((job) => (
                    <View key={job.id} className="bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-blue-400 font-bold uppercase text-xs">{job.type}</Text>
                            <Text className={`font-bold text-xs ${job.status === 'COMPLETED' ? 'text-green-500' : 'text-red-500'}`}>{job.status}</Text>
                        </View>

                        <View className="flex-row items-center mb-3">
                            <MapPin size={16} color="#9ca3af" />
                            <Text className="text-white font-medium ml-2">{job.from} {job.to !== '-' && `→ ${job.to}`}</Text>
                        </View>

                        <View className="flex-row justify-between items-center pt-3 border-t border-gray-700">
                            <View className="flex-row items-center">
                                <Clock size={14} color="#6b7280" />
                                <Text className="text-gray-500 text-xs ml-1">{job.date}</Text>
                            </View>
                            <Text className="text-white font-bold text-lg">{job.earning}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
