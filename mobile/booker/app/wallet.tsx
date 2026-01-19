import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideWallet, LucidePlus, LucideChevronLeft, LucideArrowUpRight, LucideArrowDownLeft, LucideCreditCard, LucideX } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { apiClient } from '@/src/api/client';

const { width } = Dimensions.get('window');

interface WalletTransaction {
    id: number;
    description: string;
    amount: string;
    transaction_type: 'credit' | 'debit';
    created_at: string;
}

export default function WalletScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [topUpModalVisible, setTopUpModalVisible] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [topUpLoading, setTopUpLoading] = useState(false);

    const fetchWalletData = useCallback(async () => {
        try {
            setLoading(true);
            const [walletRes, txRes] = await Promise.all([
                apiClient.get('/services/wallet/me/'),
                apiClient.get('/services/wallet/transactions/')
            ]);
            setBalance(parseFloat(walletRes.data.balance) || 0);
            setTransactions(txRes.data || []);
        } catch (error) {
            console.log('Wallet fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData]);

    const handleTopUp = async () => {
        const amount = parseFloat(topUpAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
            return;
        }
        setTopUpLoading(true);
        try {
            await apiClient.post('/services/wallet/add-money/', { amount });
            Alert.alert('Success', `₹${amount} added to your wallet!`);
            setTopUpModalVisible(false);
            setTopUpAmount('');
            fetchWalletData();
        } catch (error: any) {
            Alert.alert('Top Up Failed', error.response?.data?.error || 'Could not add money.');
        } finally {
            setTopUpLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <LucideChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Wallet & Payments</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInUp.duration(600)}>
                    <LinearGradient
                        colors={[theme.tint, '#9d50bb']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.balanceCard}
                    >
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Current Balance</Text>
                            <LucideWallet size={24} color="#fff" />
                        </View>
                        <Text style={styles.balanceAmount}>
                            {loading ? '...' : `₹${balance.toFixed(2)}`}
                        </Text>
                        <View style={styles.cardFooter}>
                            <Text style={styles.cardHolder}>Active Subscription: PRO</Text>
                            <LucideCreditCard size={20} color="#fff" />
                        </View>
                    </LinearGradient>
                </Animated.View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => setTopUpModalVisible(true)}
                    >
                        <LucidePlus size={20} color={theme.tint} />
                        <Text style={[styles.actionText, { color: theme.text }]}>Top Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => Alert.alert('Payment Methods', 'UPI, Cards, and Wallets are supported via Razorpay.')}
                    >
                        <LucideCreditCard size={20} color={theme.tint} />
                        <Text style={[styles.actionText, { color: theme.text }]}>Methods</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} />
                ) : transactions.length === 0 ? (
                    <Text style={{ color: theme.tabIconDefault, textAlign: 'center' }}>No transactions yet.</Text>
                ) : (
                    transactions.map((tx, index) => (
                        <Animated.View
                            key={tx.id}
                            entering={FadeInUp.delay(index * 100)}
                            style={[styles.txItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                        >
                            <View style={styles.txLeft}>
                                <View style={[styles.txIcon, { backgroundColor: tx.transaction_type === 'credit' ? '#10b98120' : '#ef444420' }]}>
                                    {tx.transaction_type === 'credit' ? <LucideArrowDownLeft size={18} color="#10b981" /> : <LucideArrowUpRight size={18} color="#ef4444" />}
                                </View>
                                <View style={styles.txInfo}>
                                    <Text style={[styles.txTitle, { color: theme.text }]}>{tx.description}</Text>
                                    <Text style={[styles.txDate, { color: theme.tabIconDefault }]}>{formatDate(tx.created_at)}</Text>
                                </View>
                            </View>
                            <Text style={[styles.txAmount, { color: tx.transaction_type === 'credit' ? '#10b981' : theme.text }]}>
                                {tx.transaction_type === 'credit' ? '+' : '-'} ₹{tx.amount}
                            </Text>
                        </Animated.View>
                    ))
                )}
            </ScrollView>

            {/* Top Up Modal */}
            <Modal visible={topUpModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <TouchableOpacity style={styles.modalClose} onPress={() => setTopUpModalVisible(false)}>
                            <LucideX size={24} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Add Money to Wallet</Text>
                        <TextInput
                            style={[styles.modalInput, { borderColor: theme.border, color: theme.text }]}
                            placeholder="Enter Amount (₹)"
                            placeholderTextColor={theme.tabIconDefault}
                            keyboardType="numeric"
                            value={topUpAmount}
                            onChangeText={setTopUpAmount}
                        />
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: theme.tint }]}
                            onPress={handleTopUp}
                            disabled={topUpLoading}
                        >
                            {topUpLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalButtonText}>Proceed to Pay</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    balanceCard: {
        height: 200,
        borderRadius: 30,
        padding: 25,
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        fontWeight: '500',
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 42,
        fontWeight: 'bold',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardHolder: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 25,
        marginBottom: 35,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 55,
        borderRadius: 15,
        borderWidth: 1,
    },
    actionText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
    },
    txLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    txIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txInfo: {
        justifyContent: 'center',
    },
    txTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    txDate: {
        fontSize: 12,
        marginTop: 2,
    },
    txAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        padding: 25,
        borderRadius: 20,
        elevation: 10,
    },
    modalClose: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButton: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
