import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Sparkles, Brain, Zap } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AutoMind() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 border-b border-white/5 flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-bold text-foreground">AutoMind</Text>
                    <Text className="text-slate-400">AI-Powered Roadside Agent</Text>
                </View>
                <Sparkles size={24} color="#14b8a6" />
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <Animated.View entering={FadeIn.duration(1000)} className="bg-surface p-6 rounded-2xl border border-primary/20 mb-6">
                    <View className="flex-row items-center mb-4">
                        <View className="bg-primary/20 p-2 rounded-lg mr-3">
                            <Brain size={20} color="#14b8a6" />
                        </View>
                        <Text className="text-foreground font-bold text-lg">Active Assistance</Text>
                    </View>
                    <Text className="text-slate-300 leading-6">
                        "I'm monitoring your vehicle's health and surroundings. Need help with a breakdown or just a routine check?"
                    </Text>
                </Animated.View>

                <View className="space-y-4">
                    <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest ml-1">Suggestions</Text>
                    <TouchableOpacity className="bg-surface p-4 rounded-xl border border-white/5 flex-row items-center">
                        <Zap size={18} color="#fbbf24" className="mr-3" />
                        <Text className="text-foreground ml-3">Diagnose Engine Noise</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-surface p-4 rounded-xl border border-white/5 flex-row items-center">
                        <View className="w-4 h-4 rounded-full bg-primary/40 mr-3" />
                        <Text className="text-foreground ml-3">Find Nearest Charging Station</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-surface p-4 rounded-xl border border-white/5 flex-row items-center">
                        <View className="w-4 h-4 rounded-full bg-secondary/40 mr-3" />
                        <Text className="text-foreground ml-3">Subscription Status</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Input Area */}
            <View className="p-6 bg-background border-t border-white/5">
                <View className="flex-row items-center bg-surface border border-border rounded-2xl px-4 py-2">
                    <TextInput
                        placeholder="Ask AutoMind anything..."
                        placeholderTextColor="#64748b"
                        className="flex-1 text-foreground py-2"
                        multiline
                    />
                    <TouchableOpacity className="bg-primary p-2 rounded-full absolute right-2">
                        <Send size={18} color="#020617" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
