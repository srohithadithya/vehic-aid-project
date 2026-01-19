import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Clock } from 'lucide-react-native';
import { useState } from 'react';

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-6 py-4 bg-gray-800 shadow-sm flex-row items-center justify-between border-b border-gray-700">
        <View>
          <Text className="text-gray-400 text-xs font-medium">STATUS</Text>
          <View className="flex-row items-center mt-1">
            <View className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <Text className="font-bold text-white text-lg">{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
          </View>
        </View>
        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          trackColor={{ false: '#374151', true: '#16a34a' }}
          thumbColor={'#fff'}
        />
      </View>

      <ScrollView className="p-6">
        {!isOnline ? (
          <View className="items-center justify-center p-10 mt-10">
            <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-4">
              <Clock size={40} color="#6b7280" />
            </View>
            <Text className="text-gray-400 text-center text-lg">You are currently offline.</Text>
            <Text className="text-gray-600 text-center mt-2">Go online to start receiving service requests nearby.</Text>
          </View>
        ) : (
          <>
            <Text className="text-xl font-bold text-white mb-4">Nearby Requests</Text>

            {/* Mock Job Card */}
            <View className="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-4">
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <View className="bg-blue-900/50 px-3 py-1 rounded-full self-start mb-2">
                    <Text className="text-blue-400 font-bold text-xs uppercase">Towing</Text>
                  </View>
                  <Text className="text-white text-xl font-bold">Toyota Innova</Text>
                </View>
                <Text className="text-gray-400 text-sm">2 mins ago</Text>
              </View>

              <View className="space-y-3 mb-6">
                <View className="flex-row items-center">
                  <MapPin size={18} color="#9ca3af" />
                  <Text className="text-gray-300 ml-2 flex-1">Indiranagar, 12th Main Road</Text>
                </View>
                <View className="flex-row items-center">
                  <Navigation size={18} color="#9ca3af" />
                  <Text className="text-gray-300 ml-2">3.2 km away</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-gray-700 p-3 rounded-lg items-center">
                  <Text className="text-white font-bold">Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-green-600 p-3 rounded-lg items-center">
                  <Text className="text-white font-bold">Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
