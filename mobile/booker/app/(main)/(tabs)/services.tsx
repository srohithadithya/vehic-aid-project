import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Truck, Battery, AlertTriangle, Key, Fuel, Wrench } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const services = [
    { id: 'towing', name: 'Towing', icon: Truck, price: '₹999', color: '#3b82f6' },
    { id: 'battery', name: 'Battery', icon: Battery, price: '₹499', color: '#eab308' },
    { id: 'flat_tyre', name: 'Flat Tyre', icon: AlertTriangle, price: '₹299', color: '#ef4444' },
    { id: 'fuel', name: 'Fuel', icon: Fuel, price: '₹199', color: '#22c55e' },
    { id: 'locksmith', name: 'Locksmith', icon: Key, price: '₹349', color: '#a855f7' },
    { id: 'mechanic', name: 'Mechanic', icon: Wrench, price: '₹599', color: '#f97316' },
];

export default function Services() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 border-b border-white/5">
                <Text className="text-2xl font-bold text-foreground">Book Service</Text>
                <Text className="text-slate-400">Select a service to proceed</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="flex-row flex-wrap justify-between">
                    {services.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            className="w-[48%] bg-surface border border-white/5 rounded-2xl p-4 mb-4 items-center justify-between h-40 active:border-primary/50"
                            onPress={() => {
                                // Navigate to specific booking flow
                                // router.push(`/services/${service.id}`)
                            }}
                        >
                            <View className="w-14 h-14 rounded-full items-center justify-center bg-background border border-white/10 mb-2">
                                <service.icon size={28} color={service.color} />
                            </View>
                            <View className="items-center">
                                <Text className="text-foreground font-semibold text-lg">{service.name}</Text>
                                <Text className="text-slate-400 text-sm">Starts @ {service.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
