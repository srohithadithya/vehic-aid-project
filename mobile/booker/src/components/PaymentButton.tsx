import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

interface PaymentButtonProps {
    serviceRequestId: number;
    amount: number;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function PaymentButton({
    serviceRequestId,
    amount,
    onSuccess,
    onError,
}: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            // Create order
            const orderResponse = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/payments/create-order/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        service_request_id: serviceRequestId,
                        amount: amount
                    })
                }
            );

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            // Open Razorpay checkout in browser
            const checkoutUrl = `https://api.razorpay.com/v1/checkout/embedded?key_id=${orderData.key_id}&amount=${orderData.amount * 100}&currency=INR&order_id=${orderData.order_id}&name=VehicAid&description=Service Request #${serviceRequestId}`;

            const result = await WebBrowser.openBrowserAsync(checkoutUrl);

            if (result.type === 'cancel') {
                setLoading(false);
                return;
            }

            // In a real app, you'd handle the payment callback here
            // For now, we'll show a success message
            Alert.alert(
                'Payment Initiated',
                'Please complete the payment in your browser. You will receive a confirmation once payment is successful.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setLoading(false);
                            onSuccess?.();
                        }
                    }
                ]
            );

        } catch (error) {
            setLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            onError?.(errorMessage);
            Alert.alert('Payment Error', errorMessage);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePayment}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <>
                    <Ionicons name="card" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Pay ₹{amount}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2563eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    icon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
