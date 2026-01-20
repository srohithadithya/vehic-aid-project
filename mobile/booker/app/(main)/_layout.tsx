import { Drawer } from 'expo-router/drawer';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
    CreditCard,
    RefreshCw,
    Wallet,
    Settings as SettingsIcon,
    Brain,
    HeartPulse,
    HelpCircle,
    LogOut,
    User,
    Star
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

function CustomDrawerContent(props: any) {
    const router = useRouter();

    return (
        <View className="flex-1 bg-background">
            <View className="p-8 pt-16 border-b border-white/5 bg-primary/5">
                <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-4 shadow-lg shadow-primary/20">
                    <Text className="text-3xl">🚗</Text>
                </View>
                <Text className="text-xl font-bold text-foreground">VehicAid</Text>
                <Text className="text-slate-400 text-xs">v2.6.0 Stable</Text>
            </View>

            <DrawerContentScrollView {...props} className="px-2">
                <DrawerItem
                    label="Subscription"
                    labelStyle={{ color: '#f8fafc', marginLeft: -16 }}
                    icon={({ color, size }) => <Star size={size} color="#fbbf24" />}
                    onPress={() => router.push('/subscription')}
                />
                <DrawerItem
                    label="Vehicle Exchange"
                    labelStyle={{ color: '#f8fafc', marginLeft: -16 }}
                    icon={({ color, size }) => <RefreshCw size={size} color="#14b8a6" />}
                    onPress={() => router.push('/exchange')}
                />
                <DrawerItem
                    label="Wallet & Rewards"
                    labelStyle={{ color: '#f8fafc', marginLeft: -16 }}
                    icon={({ color, size }) => <Wallet size={size} color="#14b8a6" />}
                    onPress={() => router.push('/wallet')}
                />
                <DrawerItem
                    label="AutoMind Settings"
                    labelStyle={{ color: '#f8fafc', marginLeft: -16 }}
                    icon={({ color, size }) => <Brain size={size} color="#14b8a6" />}
                    onPress={() => router.push('/automind')}
                />
                <DrawerItem
                    label="Vehicle Health"
                    labelStyle={{ color: '#f8fafc', marginLeft: -16 }}
                    icon={({ color, size }) => <HeartPulse size={size} color="#ef4444" />}
                    onPress={() => router.push('/health')}
                />
                <View className="h-[1] bg-white/5 my-4 mx-4" />
                <DrawerItem
                    label="Help & Support"
                    labelStyle={{ color: '#f8fafc', marginLeft: -16 }}
                    icon={({ color, size }) => <HelpCircle size={size} color="#94a3b8" />}
                    onPress={() => router.push('/helpline')}
                />
                <DrawerItem
                    label="Settings"
                    labelStyle={{ color: '#f8fafc', marginLeft: -16 }}
                    icon={({ color, size }) => <SettingsIcon size={size} color="#94a3b8" />}
                    onPress={() => router.push('/settings')}
                />
            </DrawerContentScrollView>

            <View className="p-6 border-t border-white/5">
                <TouchableOpacity
                    className="flex-row items-center p-4 rounded-xl bg-destructive/10"
                    onPress={() => router.replace('/')}
                >
                    <LogOut size={20} color="#ef4444" />
                    <Text className="text-destructive font-bold ml-4">Logout</Text>
                </TouchableOpacity>
                <Text className="text-slate-600 text-[10px] text-center mt-4">Powered by AutoMind AI</Text>
            </View>
        </View>
    );
}

export default function MainLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'slide',
                drawerStyle: {
                    width: '80%',
                    backgroundColor: '#09090b',
                },
                overlayColor: 'rgba(0,0,0,0.7)',
            }}
        >
            <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home' }} />
        </Drawer>
    );
}
