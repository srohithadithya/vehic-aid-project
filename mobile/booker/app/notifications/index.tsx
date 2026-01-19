import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Info, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Notifications() {
    const router = useRouter();

    const notifications = [
        { id: 1, type: 'success', title: 'Service Completed', message: 'Your tow service was completed successfully.', time: '2 hours ago' },
        { id: 2, type: 'info', title: 'Provider Assigned', message: 'John Doe is on the way to your location.', time: '5 hours ago' },
        { id: 3, type: 'alert', title: 'Payment Failed', message: 'Please retry payment for your last request.', time: 'Yesterday' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} color="#16a34a" />;
            case 'alert': return <AlertTriangle size={20} color="#dc2626" />;
            default: return <Info size={20} color="#2563eb" />;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Notifications</Text>
            </View>

            <ScrollView className="p-4">
                {notifications.map((item) => (
                    <View key={item.id} className="flex-row p-4 bg-gray-50 rounded-xl mb-3 border border-gray-100">
                        <View className="mr-3 mt-1">
                            {getIcon(item.type)}
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-900 mb-1">{item.title}</Text>
                            <Text className="text-gray-600 text-sm mb-2 leading-5">{item.message}</Text>
                            <Text className="text-gray-400 text-xs">{item.time}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
