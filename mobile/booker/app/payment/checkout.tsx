import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function Checkout() {
    const router = useRouter();
    const { planId } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Payment processed successfully!", [
                { text: "OK", onPress: () => router.replace('/(tabs)') }
            ]);
        }, 2000); // Simulate API delay
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Secure Checkout</Text>
            </View>

            <View className="p-6">
                <View className="bg-gray-50 p-4 rounded-xl mb-6">
                    <Text className="text-gray-500 text-sm mb-1 uppercase font-bold">Summary</Text>
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-lg font-bold text-gray-900 capitalize">{planId} Plan</Text>
                        <Text className="text-lg font-bold text-gray-900">₹199.00</Text>
                    </View>
                    <Text className="text-green-600 text-xs">Includes GST</Text>
                </View>

                <Text className="text-gray-900 font-bold mb-4">Payment Method</Text>

                <View className="space-y-4">
                    <View className="border border-blue-500 bg-blue-50 rounded-xl p-4 flex-row items-center">
                        <CreditCard size={24} color="#2563eb" />
                        <Text className="ml-3 font-medium text-gray-900 flex-1">Credit / Debit Card</Text>
                        <View className="w-5 h-5 rounded-full border-2 border-blue-600 items-center justify-center">
                            <View className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        </View>
                    </View>

                    <View className="border border-gray-200 rounded-xl p-4 flex-row items-center">
                        <View className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                            <Text className="font-bold text-xs">UPI</Text>
                        </View>
                        <Text className="ml-3 font-medium text-gray-600 flex-1">UPI / Wallets</Text>
                        <View className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    </View>
                </View>

                {/* Mock Card Form */}
                <View className="mt-6 space-y-4">
                    <View className="bg-gray-100 rounded-xl px-4 py-3">
                        <TextInput placeholder="Card Number" className="text-base" keyboardType="numeric" />
                    </View>
                    <View className="flex-row gap-4">
                        <View className="bg-gray-100 rounded-xl px-4 py-3 flex-1">
                            <TextInput placeholder="MM/YY" className="text-base" keyboardType="numeric" />
                        </View>
                        <View className="bg-gray-100 rounded-xl px-4 py-3 flex-1">
                            <TextInput placeholder="CVC" className="text-base" keyboardType="numeric" secureTextEntry />
                        </View>
                    </View>
                </View>

                <View className="mt-8">
                    <TouchableOpacity
                        className="bg-green-600 w-full py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-green-200"
                        onPress={handlePay}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Lock size={18} color="white" />
                                <Text className="text-white font-bold text-lg ml-2">Pay ₹199.00</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <Text className="text-center text-gray-400 text-xs mt-4 flex-row items-center justify-center">
                        <Lock size={12} color="#9ca3af" /> Secured by Razorpay
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
