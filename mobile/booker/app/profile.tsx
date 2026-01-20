import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, CheckCircle2, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react-native';

export default function Profile() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#f8fafc" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground">Profile Settings</Text>
                <View className="w-6" />
            </View>

            <ScrollView className="flex-1">
                {/* Avatar Section */}
                <View className="items-center py-8">
                    <View className="relative">
                        <View className="w-24 h-24 rounded-full bg-surface border-2 border-primary items-center justify-center">
                            <Text className="text-3xl">👤</Text>
                        </View>
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-background">
                            <Camera size={16} color="#020617" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold text-foreground mt-4">Rohith Adithya</Text>
                    <View className="flex-row items-center mt-1">
                        <ShieldCheck size={14} color="#14b8a6" />
                        <Text className="text-primary text-xs font-semibold ml-1">GOLD MEMBER</Text>
                    </View>
                </View>

                {/* Info Categories */}
                <View className="px-6 space-y-6 pb-20">

                    <View className="space-y-4">
                        <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Personal Information</Text>

                        <View className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                            <View className="p-4 border-b border-white/5">
                                <Text className="text-slate-500 text-xs mb-1">Email Address</Text>
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-foreground font-medium">rohith@example.com</Text>
                                    <TouchableOpacity>
                                        <Text className="text-primary text-xs font-bold">VERIFY</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="p-4 border-b border-white/5">
                                <Text className="text-slate-500 text-xs mb-1">Mobile Number</Text>
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-foreground font-medium">+91 98765 43210</Text>
                                    <View className="flex-row items-center">
                                        <CheckCircle2 size={12} color="#14b8a6" />
                                        <Text className="text-green-500 text-xs font-bold ml-1">VERIFIED</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity className="p-4 flex-row items-center justify-between">
                                <Text className="text-foreground">Change Password</Text>
                                <ChevronRight size={18} color="#475569" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="space-y-4">
                        <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Documentation</Text>
                        <TouchableOpacity className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="bg-primary/20 p-2 rounded-lg mr-4">
                                    <CreditCard size={20} color="#14b8a6" />
                                </View>
                                <View>
                                    <Text className="text-foreground font-bold">Driving License</Text>
                                    <Text className="text-slate-500 text-xs">Verify your identity</Text>
                                </View>
                            </View>
                            <View className="bg-yellow-500/10 px-2 py-1 rounded">
                                <Text className="text-yellow-500 text-[10px] font-bold">PENDING</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="bg-primary/20 p-2 rounded-lg mr-4">
                                    <ShieldCheck size={20} color="#14b8a6" />
                                </View>
                                <View>
                                    <Text className="text-foreground font-bold">Vehicle Documents</Text>
                                    <Text className="text-slate-500 text-xs">RC & Insurance upload</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#475569" />
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
