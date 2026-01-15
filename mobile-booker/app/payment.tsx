import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideCreditCard, LucideShieldCheck, LucideChevronRight, LucideWallet } from 'lucide-react-native';
import { apiClient } from '../src/api/client';

export default function PaymentScreen() {
    const { requestId, amount } = useLocalSearchParams();
    const [processing, setProcessing] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const handlePayment = async () => {
        setProcessing(true);

        // Simulating Razorpay Bridge
        setTimeout(async () => {
            try {
                // In production, we'd wait for the Razorpay SDK response here
                const paymentSuccess = true;

                if (paymentSuccess) {
                    await apiClient.post(`/payments/confirm/`, {
                        request_id: requestId,
                        payment_method: 'RAZORPAY',
                        status: 'SUCCESS'
                    });

                    Alert.alert('Payment Successful', 'Receipt has been sent to your email.', [
                        { text: 'OK', onPress: () => router.replace('/(tabs)/history') }
                    ]);
                }
            } catch (error) {
                Alert.alert('Payment Error', "Your payment was successful but we couldn't update the status. Please contact support.");
            } finally {
                setProcessing(false);
            }
        }, 2000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Checkout</Text>
                <Text style={[styles.amount, { color: theme.tint }]}>₹{amount || '1,499'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>PAYMENT METHODS</Text>

                <TouchableOpacity
                    style={[styles.paymentOption, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={handlePayment}
                >
                    <View style={styles.optionLeft}>
                        <LucideCreditCard size={24} color={theme.tint} />
                        <Text style={[styles.optionText, { color: theme.text }]}>Credit / Debit Card</Text>
                    </View>
                    <LucideChevronRight size={20} color={theme.tabIconDefault} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.paymentOption, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={handlePayment}
                >
                    <View style={styles.optionLeft}>
                        <LucideWallet size={24} color={theme.tint} />
                        <Text style={[styles.optionText, { color: theme.text }]}>UPI / Google Pay</Text>
                    </View>
                    <LucideChevronRight size={20} color={theme.tabIconDefault} />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <View style={styles.secureBadge}>
                    <LucideShieldCheck size={16} color="#10b981" />
                    <Text style={styles.secureText}>Securely powered by Razorpay</Text>
                </View>

                <TouchableOpacity
                    style={[styles.payButton, { backgroundColor: theme.tint }]}
                    onPress={handlePayment}
                    disabled={processing}
                >
                    {processing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payButtonText}>Pay Now</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    amount: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 15,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        marginBottom: 12,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 30,
        paddingBottom: 50,
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    secureText: {
        fontSize: 12,
        color: '#10b981',
        marginLeft: 6,
    },
    payButton: {
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
