import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import Chat from '../../components/Chat';
import { MapPin, Clock, Phone, ChevronLeft, MessageSquare } from 'lucide-react-native';

export default function RequestDetails() {
    const { id } = useLocalSearchParams();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
    const router = useRouter();

    const fetchDetails = async () => {
        try {
            const response = await api.get(`/request/${id}/`);
            setRequest(response.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
        const interval = setInterval(fetchDetails, 5000); // Poll status
        return () => clearInterval(interval);
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!request) return <Text>Request not found</Text>;

    const STATUS_COLORS: any = {
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'DISPATCHED': 'bg-blue-100 text-blue-700',
        'IN_PROGRESS': 'bg-purple-100 text-purple-700',
        'COMPLETED': 'bg-green-100 text-green-700',
        'CANCELLED': 'bg-red-100 text-red-700',
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <ChevronLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="font-bold text-lg">Request #{id}</Text>
                <TouchableOpacity onPress={() => fetchDetails()} className="p-2">
                    <Clock size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className="flex-row border-b border-gray-200">
                <TouchableOpacity
                    className={`flex-1 py-4 items-center ${activeTab === 'details' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setActiveTab('details')}
                >
                    <Text className={`font-bold ${activeTab === 'details' ? 'text-blue-600' : 'text-gray-500'}`}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-4 items-center ${activeTab === 'chat' ? 'border-b-2 border-blue-600' : ''}`}
                    onPress={() => setActiveTab('chat')}
                >
                    <Text className={`font-bold ${activeTab === 'chat' ? 'text-blue-600' : 'text-gray-500'}`}>Chat</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'details' ? (
                <ScrollView className="flex-1 p-6">
                    <View className="items-center mb-8">
                        <View className={`px-4 py-1 rounded-full ${STATUS_COLORS[request.status]?.split(' ')[0] || 'bg-gray-100'}`}>
                            <Text className={`font-bold text-sm ${STATUS_COLORS[request.status]?.split(' ')[1] || 'text-gray-600'}`}>
                                {request.status}
                            </Text>
                        </View>
                        <Text className="text-2xl font-bold mt-2 capitalize">{request.service_type.replace('_', ' ')}</Text>
                    </View>

                    {/* Map Placeholder */}
                    <View className="bg-gray-100 h-48 rounded-2xl items-center justify-center mb-6">
                        <MapPin size={40} color="#9ca3af" />
                        <Text className="text-gray-400 mt-2">Live Map Tracking</Text>
                    </View>

                    {/* Provider Info */}
                    {request.provider && (
                        <View className="bg-blue-50 p-4 rounded-xl flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-gray-500 text-xs uppercase font-bold">Provider</Text>
                                <Text className="font-bold text-lg text-gray-900">John Doe</Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="text-yellow-600 font-bold">★ 4.8</Text>
                                    <Text className="text-gray-400 text-xs ml-2">• Toyota Tow Truck</Text>
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                                    <Phone size={20} color="#2563eb" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-sm"
                                    onPress={() => setActiveTab('chat')}
                                >
                                    <MessageSquare size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-500 text-xs mb-1">LOCATION</Text>
                            <Text className="font-medium text-gray-800">12th Main, Indiranagar, Bangalore</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-xs mb-1">NOTES</Text>
                            <Text className="font-medium text-gray-800">{request.customer_notes || 'No notes provided'}</Text>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <Chat requestId={Number(id)} />
            )}
        </SafeAreaView>
    );
}
