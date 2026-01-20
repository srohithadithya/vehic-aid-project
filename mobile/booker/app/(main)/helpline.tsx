import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, Phone, Mail, FileText, ChevronRight, Search, CreditCard, Gift, Wrench } from 'lucide-react-native';

export default function HelpSupport() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#f8fafc" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground ml-4">Help & Support</Text>
            </View>

            <ScrollView className="flex-1 p-6">

                {/* Search */}
                <View className="flex-row items-center bg-surface border border-border rounded-2xl px-4 py-3 mb-8">
                    <Search size={18} color="#64748b" />
                    <TextInput
                        placeholder="How can we help you?"
                        placeholderTextColor="#64748b"
                        className="flex-1 ml-3 text-foreground"
                    />
                </View>

                {/* Contact Methods */}
                <View className="flex-row space-x-4 mb-8">
                    <TouchableOpacity className="flex-1 bg-primary/10 border border-primary/20 p-4 rounded-2xl items-center">
                        <MessageCircle size={24} color="#14b8a6" style={{ marginBottom: 8 }} />
                        <Text className="text-primary font-bold">Live Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-surface border border-white/5 p-4 rounded-2xl items-center">
                        <Phone size={24} color="#94a3b8" style={{ marginBottom: 8 }} />
                        <Text className="text-foreground font-bold">Call Us</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ Categories */}
                <View className="space-y-4">
                    <Text className="text-slate-400 text-sm font-semibold uppercase tracking-widest ml-1">Popular Topics</Text>

                    {[
                        { title: 'Booking a Service', icon: FileText },
                        { title: 'Payment & Refunds', icon: CreditCard },
                        { title: 'Subscription Benefits', icon: Gift },
                        { title: 'Technical Issues', icon: Wrench },
                    ].map((item, i) => (
                        <TouchableOpacity key={i} className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="p-2 rounded-lg bg-white/5 mr-3">
                                    {/* For simplicity using MessageCircle as placeholder icon here or specific icons if imported */}
                                    <MessageCircle size={18} color="#94a3b8" />
                                </View>
                                <Text className="text-foreground">{item.title}</Text>
                            </View>
                            <ChevronRight size={16} color="#475569" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mt-12 items-center">
                    <Text className="text-slate-500 text-xs text-center px-12">
                        Our support team is available 24/7 for emergency roadside assistance.
                    </Text>
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
