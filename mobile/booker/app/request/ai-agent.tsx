import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, Send } from 'lucide-react-native';
import { api } from '../../services/api';

export default function AIAgent() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleConsult = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const response = await api.post('/agentic-booking/', {
                description: input,
                latitude: 12.9716, // Mock location
                longitude: 77.5946
            });

            // If success, navigate to request details or confirmation
            if (response.data.request_id) {
                router.replace(`/request/${response.data.request_id}`); // Assuming request view page exists
            } else {
                alert("AI could not determine capabilities. Please manual book.");
            }

        } catch (e) {
            console.error(e);
            alert("Something went wrong with AI.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#1f2937" size={24} />
                </TouchableOpacity>
                <Text className="font-bold text-xl text-gray-900">AI Assistance</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="items-center justify-center py-10">
                    <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                        <Sparkles size={32} color="#2563eb" />
                    </View>
                    <Text className="text-center text-lg font-medium text-gray-800">
                        Describe your specific problem
                    </Text>
                    <Text className="text-center text-gray-500 mt-2 px-6">
                        "My car is making a loud noise and smoke is coming from the hood."
                    </Text>
                </View>

                <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[150px]">
                    <TextInput
                        placeholder="Type here..."
                        multiline
                        className="text-base text-gray-800"
                        value={input}
                        onChangeText={setInput}
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-600 mt-6 py-4 rounded-xl flex-row items-center justify-center"
                    onPress={handleConsult}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg mr-2">Analyze & Book</Text>
                            <Send color="white" size={20} />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
