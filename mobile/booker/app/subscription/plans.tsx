import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Star, Shield, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const PLANS = [
    {
        id: 'basic',
        name: 'Basic',
        price: '₹99',
        period: '/month',
        color: 'bg-gray-100',
        btnColor: 'bg-gray-800',
        features: ['2 Free Services', 'Standard Response', 'No Towing'],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '₹199',
        period: '/month',
        popular: true,
        color: 'bg-blue-50 border-2 border-blue-500',
        btnColor: 'bg-blue-600',
        features: ['Unlimited Services', 'Priority Response', 'Free Towing (50km)', 'Family Coverage'],
    },
    {
        id: 'elite',
        name: 'Elite',
        price: '₹499',
        period: '/year',
        color: 'bg-yellow-50 border border-yellow-200',
        btnColor: 'bg-yellow-600',
        features: ['All Premium Benefits', 'Dedicated Agent', 'Inter-city Towing', 'Luxury Replacement Car'],
    },
];

export default function Plans() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = (planId: string) => {
        // Navigate to payment
        router.push({ pathname: '/payment/checkout', params: { planId } });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Subscription Plans</Text>
            </View>

            <ScrollView className="p-6">
                <Text className="text-center text-gray-500 mb-6">Choose a plan that fits your driving needs.</Text>

                {PLANS.map((plan) => (
                    <View key={plan.id} className={`rounded-2xl p-6 mb-6 ${plan.color} relative overflow-hidden`}>
                        {plan.popular && (
                            <View className="absolute top-0 right-0 bg-blue-600 px-3 py-1 rounded-bl-xl">
                                <Text className="text-white text-xs font-bold">POPULAR</Text>
                            </View>
                        )}

                        <Text className="text-xl font-bold text-gray-900 mb-2">{plan.name}</Text>
                        <View className="flex-row items-baseline mb-4">
                            <Text className="text-3xl font-bold text-gray-900">{plan.price}</Text>
                            <Text className="text-gray-500">{plan.period}</Text>
                        </View>

                        <View className="space-y-3 mb-6">
                            {plan.features.map((feature, i) => (
                                <View key={i} className="flex-row items-center">
                                    <Check size={16} color="#16a34a" />
                                    <Text className="ml-2 text-gray-600 text-sm font-medium">{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            className={`w-full py-3 rounded-xl items-center ${plan.btnColor}`}
                            onPress={() => handleSubscribe(plan.id)}
                        >
                            <Text className="text-white font-bold">Choose {plan.name}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
