import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Clock, XCircle, ChevronRight, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function History() {
    const router = useRouter();

    // Mock data - replace with API call
    const history = [
        { id: 101, service: 'Towing', date: 'Oct 24, 2025', amount: '₹ 450', status: 'COMPLETED' },
        { id: 102, service: 'Fuel Delivery', date: 'Sep 12, 2025', amount: '₹ 150', status: 'COMPLETED' },
        { id: 103, service: 'Mechanic', date: 'Aug 05, 2025', amount: '₹ 0', status: 'CANCELLED' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle size={16} color="#16a34a" />;
            case 'CANCELLED': return <XCircle size={16} color="#dc2626" />;
            default: return <Clock size={16} color="#ca8a04" />;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">Activity History</Text>
            </View>

            <ScrollView className="p-4">
                {history.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        className="bg-white p-4 rounded-xl mb-3 shadow-sm flex-row items-center border border-gray-100"
                        onPress={() => router.push(`/request/${item.id}`)}
                    >
                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                            <Calendar size={20} color="#4b5563" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800 text-base">{item.service}</Text>
                            <Text className="text-gray-500 text-xs">{item.date}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="font-bold text-gray-900 mb-1">{item.amount}</Text>
                            <View className="flex-row items-center">
                                {getStatusIcon(item.status)}
                                <Text className="text-xs text-gray-500 ml-1 font-medium">{item.status}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
