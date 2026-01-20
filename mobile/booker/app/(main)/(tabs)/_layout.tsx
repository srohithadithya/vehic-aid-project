import { Tabs } from 'expo-router';
import { Home, Compass, User, Wrench } from 'lucide-react-native';
import { View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#09090b',
                    borderTopColor: '#1e293b',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#14b8a6',
                tabBarInactiveTintColor: '#64748b',
            }}
        >
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Services',
                    tabBarIcon: ({ color }) => <Wrench size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <View className="bg-primary/20 p-2 rounded-full -mt-4 border-4 border-background">
                            <Home size={28} color={color} />
                        </View>
                    ),
                    // Creating a popped-up effect for the home button
                }}
            />
            <Tabs.Screen
                name="automind"
                options={{
                    title: 'AutoMind',
                    tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
