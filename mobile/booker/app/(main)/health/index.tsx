import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Activity, Thermometer, Battery, Gauge, Zap } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function VehicleHealth() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#f8fafc" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground ml-4">Vehicle Health</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                {/* Status Overview */}
                <Animated.View entering={FadeIn.duration(800)} className="bg-surface p-6 rounded-[32px] border border-white/5 mb-8 items-center">
                    <View className="w-32 h-32 rounded-full border-8 border-primary/20 items-center justify-center mb-4">
                        <View className="items-center">
                            <Text className="text-3xl font-black text-foreground">98%</Text>
                            <Text className="text-slate-500 text-[10px] font-bold">HEALTHY</Text>
                        </View>
                    </View>
                    <Text className="text-foreground font-bold text-lg mb-1">Toyota Camry</Text>
                    <Text className="text-slate-400 text-xs text-center px-8">
                        All systems are performing optimally. Next service due in 2,400 km.
                    </Text>
                </Animated.View>

                {/* Real-time Metrics */}
                <View className="space-y-4">
                    <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest ml-1">Live Diagnostics</Text>

                    <View className="flex-row flex-wrap justify-between">
                        {[
                            { label: 'Battery', val: '12.6V', status: 'Optimal', icon: Battery, color: '#14b8a6' },
                            { label: 'Coolant', val: '92°C', status: 'Normal', icon: Thermometer, color: '#3b82f6' },
                            { label: 'TPMS', val: '32 PSI', status: 'Good', icon: Gauge, color: '#fbbf24' },
                            { label: 'Engine', val: 'Idle', status: 'Steady', icon: Activity, color: '#a855f7' },
                        ].map((item, i) => (
                            <View key={i} className="w-[48%] bg-surface p-4 rounded-2xl border border-white/5 mb-4">
                                <View className="flex-row justify-between items-start mb-3">
                                    <item.icon size={20} color={item.color} />
                                    <View className="bg-white/5 px-2 py-0.5 rounded">
                                        <Text className="text-[8px] font-bold text-slate-400">{item.status}</Text>
                                    </View>
                                </View>
                                <Text className="text-2xl font-bold text-foreground mb-1">{item.val}</Text>
                                <Text className="text-slate-500 text-xs">{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity className="mt-8 bg-primary/10 p-4 rounded-2xl border border-primary/20 flex-row items-center justify-center space-x-2">
                    <Zap size={18} color="#14b8a6" />
                    <Text className="text-primary font-bold ml-2">Run Full Scan</Text>
                </TouchableOpacity>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
