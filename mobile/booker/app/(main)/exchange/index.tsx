import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Repeat, Info, ChevronRight, Car } from 'lucide-react-native';

export default function VehicleExchange() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#f8fafc" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground ml-4">Vehicle Exchange</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="bg-primary/10 p-6 rounded-3xl border border-primary/20 mb-8 items-center">
                    <View className="bg-primary p-4 rounded-full mb-4">
                        <Repeat size={32} color="#000" />
                    </View>
                    <Text className="text-foreground text-center font-bold text-lg mb-2">Upgrade Your Ride</Text>
                    <Text className="text-slate-400 text-center text-sm">
                        Get the best resale value and seamless transition to your next vehicle with VehicAid Exchange.
                    </Text>
                </View>

                <View className="space-y-6">
                    <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Active Quotations</Text>

                    <View className="bg-surface p-6 rounded-3xl border border-white/5 items-center justify-center border-dashed">
                        <Text className="text-slate-500 mb-4">No active exchange quotes found.</Text>
                        <TouchableOpacity className="bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                            <Text className="text-primary font-bold">Start New Exchange</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-4 pt-4">
                        <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest">How it works</Text>

                        {[
                            { step: '1', title: 'Upload Details', desc: 'Add images and vehicle documents.' },
                            { step: '2', title: 'Inspection', desc: 'AI-driven health check & appraisal.' },
                            { step: '3', title: 'Get Quote', desc: 'Receive instant exchange value.' },
                        ].map((item, i) => (
                            <View key={i} className="flex-row items-start space-x-4">
                                <View className="w-8 h-8 rounded-full bg-surface border border-primary items-center justify-center">
                                    <Text className="text-primary font-bold">{item.step}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-foreground font-bold">{item.title}</Text>
                                    <Text className="text-slate-500 text-xs">{item.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity className="mt-12 bg-surface p-4 rounded-2xl flex-row items-center justify-between border border-white/5">
                    <View className="flex-row items-center">
                        <Info size={18} color="#14b8a6" className="mr-3" />
                        <Text className="text-foreground ml-3">Exchange Policy & Terms</Text>
                    </View>
                    <ChevronRight size={18} color="#475569" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
