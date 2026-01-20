import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function Index() {
    const router = useRouter();

    // Temporary auto-navigation for testing auth flow
    // useEffect(() => {
    //   setTimeout(() => router.push('/(auth)/login'), 2000);
    // }, []);

    return (
        <View className="flex-1 bg-background items-center justify-center p-6">
            <Animated.View entering={FadeIn.duration(1000)} className="items-center mb-12">
                <View className="mb-6 w-32 h-32 items-center justify-center">
                    <Image
                        source={require('../logo_booker.png')}
                        className="w-full h-full rounded-2xl"
                        resizeMode="contain"
                    />
                </View>
                <Text className="text-5xl font-black text-foreground mb-2">Vehic<Text className="text-primary">Aid</Text></Text>
                <Text className="text-slate-400 text-center text-lg px-8">
                    Smart Roadside Assistance at your fingertips.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(800)} className="w-full space-y-4">
                <TouchableOpacity
                    className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 active:opacity-90 transition-all mb-4"
                    onPress={() => router.push('/auth/login')}
                >
                    <Text className="text-black font-bold text-lg">Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full bg-surface border border-border py-4 rounded-2xl items-center active:bg-border/50 transition-all"
                    onPress={() => router.push('/auth/signup')}
                >
                    <Text className="text-foreground font-semibold text-lg">Sign Up</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
