import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, History, Gift, Wallet as WalletIcon, TrendingUp } from 'lucide-react-native';

export default function Wallet() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-white/5">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#f8fafc" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground ml-4">Wallet & Rewards</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Balance Card */}
                <View className="p-6">
                    <View className="bg-primary p-8 rounded-[40px] shadow-2xl shadow-primary/30 relative overflow-hidden">
                        {/* Decorative Circles */}
                        <View className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
                        <View className="absolute -left-10 -bottom-10 w-20 h-20 rounded-full bg-black/10" />

                        <View className="flex-row justify-between items-start mb-8">
                            <View>
                                <Text className="text-black/60 font-bold mb-1">Total Balance</Text>
                                <Text className="text-4xl font-black text-black">₹1,250.00</Text>
                            </View>
                            <WalletIcon size={32} color="#000" />
                        </View>

                        <TouchableOpacity className="bg-black py-3 rounded-2xl items-center flex-row justify-center space-x-2">
                            <Plus size={18} color="#fff" />
                            <Text className="text-white font-bold ml-2">Add Money</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Rewards Section */}
                <View className="px-6 mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-foreground">Active Rewards</Text>
                        <TouchableOpacity>
                            <Text className="text-primary text-xs font-bold underline">Claim Points</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row space-x-4">
                        <View className="flex-1 bg-surface p-4 rounded-2xl border border-white/5 items-center">
                            <Gift size={24} color="#fbbf24" style={{ marginBottom: 8 }} />
                            <Text className="text-foreground font-bold">540</Text>
                            <Text className="text-slate-500 text-[10px]">Points Earned</Text>
                        </View>
                        <View className="flex-1 bg-surface p-4 rounded-2xl border border-white/5 items-center">
                            <TrendingUp size={24} color="#14b8a6" style={{ marginBottom: 8 }} />
                            <Text className="text-foreground font-bold">₹50</Text>
                            <Text className="text-slate-500 text-[10px]">Cashback Ready</Text>
                        </View>
                    </View>
                </View>

                {/* Transaction History */}
                <View className="px-6 pb-20">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-foreground">Transaction History</Text>
                        <History size={18} color="#475569" />
                    </View>

                    <View className="space-y-3">
                        {[
                            { title: 'Towing Service #4231', amount: '-₹450', date: 'Yesterday', type: 'debit' },
                            { title: 'Wallet Topup', amount: '+₹1,000', date: '15 Jan 2026', type: 'credit' },
                            { title: 'Points Redemption', amount: '+₹50', date: '10 Jan 2026', type: 'credit' },
                            { title: 'Battery Jumpstart', amount: '-₹250', date: '05 Jan 2026', type: 'debit' },
                        ].map((item, i) => (
                            <View key={i} className="bg-surface p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                                <View>
                                    <Text className="text-foreground font-medium">{item.title}</Text>
                                    <Text className="text-slate-500 text-[10px]">{item.date}</Text>
                                </View>
                                <Text className={`font-bold ${item.type === 'credit' ? 'text-green-500' : 'text-foreground'}`}>
                                    {item.amount}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
