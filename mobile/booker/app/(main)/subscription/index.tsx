import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, Star, Zap, Crown } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const plans = [
    {
        id: 'basic',
        name: 'Basic',
        price: 'Free',
        features: ['Standard Towing (Up to 2km)', 'Basic Battery Support', '24/7 Support'],
        icon: Star,
        color: '#94a3b8'
    },
    {
        id: 'silver',
        name: 'Silver',
        price: '₹199/mo',
        features: ['Unlimited Towing (Up to 10km)', 'Priority Support', 'Flat Tyre Repair', 'Fuel Delivery'],
        icon: Zap,
        color: '#14b8a6',
        popular: true
    },
    {
        id: 'gold',
        name: 'Gold',
        price: '₹499/mo',
        features: ['Premium Towing (No limit)', 'Free Battery Replacement', 'VIP Assistance', 'Vehicle Health Monitoring'],
        icon: Crown,
        color: '#fbbf24'
    }
];

export default function Subscription() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#f8fafc" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground ml-4">Subscription Plans</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-slate-400 mb-8 text-center px-4">
                    Choose a plan that fits your journey. Upgrade anytime.
                </Text>

                {plans.map((plan, index) => (
                    <Animated.View
                        key={plan.id}
                        entering={FadeInRight.delay(index * 200).duration(600)}
                        className={`bg-surface p-6 rounded-3xl border ${plan.popular ? 'border-primary' : 'border-white/5'} mb-6 overflow-hidden`}
                    >
                        {plan.popular && (
                            <View className="bg-primary absolute right-0 top-0 px-4 py-1 rounded-bl-xl">
                                <Text className="text-black text-[10px] font-bold">POPULAR</Text>
                            </View>
                        )}

                        <View className="flex-row items-center mb-4">
                            <View className="p-3 rounded-2xl bg-white/5 mr-4">
                                <plan.icon size={24} color={plan.color} />
                            </View>
                            <View>
                                <Text className="text-xl font-bold text-white">{plan.name}</Text>
                                <Text className="text-primary font-bold">{plan.price}</Text>
                            </View>
                        </View>

                        <View className="space-y-3 mb-6">
                            {plan.features.map((feature, i) => (
                                <View key={i} className="flex-row items-center">
                                    <CheckCircle2 size={16} color="#14b8a6" />
                                    <Text className="text-slate-400 ml-3 text-sm">{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            className={`w-full py-4 rounded-xl items-center ${plan.popular ? 'bg-primary' : 'bg-white/10'}`}
                        >
                            <Text className={`font-bold ${plan.popular ? 'text-black' : 'text-white'}`}>
                                {plan.id === 'basic' ? 'Current Plan' : 'Subscribe Now'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
