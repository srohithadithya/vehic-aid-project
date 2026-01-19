import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Truck, Wrench, Fuel, BatteryCharging, Key } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const SERVICES = [
  { id: 'TOWING', name: 'Towing', icon: Truck, color: '#2563eb', bg: 'bg-blue-100' },
  { id: 'MECHANIC', name: 'Mechanic', icon: Wrench, color: '#f97316', bg: 'bg-orange-100' },
  { id: 'FUEL', name: 'Fuel', icon: Fuel, color: '#eab308', bg: 'bg-yellow-100' },
  { id: 'JUMPSTART', name: 'Jumpstart', icon: BatteryCharging, color: '#16a34a', bg: 'bg-green-100' },
  { id: 'LOCKOUT', name: 'Lockout', icon: Key, color: '#9333ea', bg: 'bg-purple-100' },
];

export default function Home() {
  const router = useRouter();

  const handleServiceSelect = (id: string) => {
    // Navigate to request screen or AI flow
    console.log("Selected:", id);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white shadow-sm flex-row items-center justify-between">
        <View>
          <Text className="text-gray-500 text-xs font-medium">CURRENT LOCATION</Text>
          <View className="flex-row items-center mt-1">
            <MapPin size={16} color="#2563eb" />
            <Text className="ml-1 font-bold text-gray-800">Bangalore, KA</Text>
          </View>
        </View>
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text className="text-blue-700 font-bold text-xs">BASIC PLAN</Text>
        </View>
      </View>

      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">What do you need help with?</Text>

        <View className="flex-row flex-wrap justify-between">
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              className="w-[48%] bg-white p-4 rounded-xl shadow-sm mb-4 items-center justify-center border border-gray-100 active:bg-blue-50"
              onPress={() => handleServiceSelect(service.id)}
            >
              <View className={`${service.bg} p-3 rounded-full mb-3`}>
                <service.icon size={24} color={service.color} />
              </View>
              <Text className="font-bold text-gray-700">{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6 bg-blue-600 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <Text className="text-white font-bold text-lg mb-1">AI Agent Assistance</Text>
          <Text className="text-blue-100 text-sm mb-4 w-3/4">Type what's wrong and let our AI coordinate help for you.</Text>
          <TouchableOpacity className="bg-white py-3 px-6 rounded-xl self-start">
            <Text className="text-blue-600 font-bold">Ask AI Agent</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Recent Activity</Text>
          <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <Text className="text-gray-400 text-center italic">No recent bookings</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
