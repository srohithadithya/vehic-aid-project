import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, Square, MapPin, Navigation, Phone } from 'lucide-react-native';
import { useState } from 'react';

export default function Earnings() {
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <View className="px-6 py-4 border-b border-gray-800">
                <Text className="text-white text-xl font-bold">Earnings</Text>
            </View>

            <ScrollView className="p-6">
                <View className="bg-blue-600 rounded-2xl p-6 mb-6">
                    <Text className="text-blue-100 font-medium mb-1">Today's Earnings</Text>
                    <Text className="text-white text-4xl font-bold">₹ 1,250</Text>
                    <View className="flex-row mt-4 pt-4 border-t border-blue-500 justify-between">
                        <View>
                            <Text className="text-blue-200 text-xs">TRIPS</Text>
                            <Text className="text-white font-bold text-lg">4</Text>
                        </View>
                        <View>
                            <Text className="text-blue-200 text-xs">ONLINE HRS</Text>
                            <Text className="text-white font-bold text-lg">3.5</Text>
                        </View>
                        <View>
                            <Text className="text-blue-200 text-xs">CASH</Text>
                            <Text className="text-white font-bold text-lg">₹ 400</Text>
                        </View>
                    </View>
                </View>

                <Text className="text-white font-bold text-lg mb-4">Recent Activity</Text>

                {[1, 2, 3].map((item) => (
                    <View key={item} className="bg-gray-800 p-4 rounded-xl mb-3 flex-row justify-between items-center border border-gray-700">
                        <View>
                            <Text className="text-gray-400 text-xs mb-1">10:30 AM • Towing</Text>
                            <Text className="text-white font-bold">Indiranagar to Koramangala</Text>
                        </View>
                        <Text className="text-green-400 font-bold">₹ 350</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
