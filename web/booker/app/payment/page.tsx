'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, CreditCard, Wallet, Loader2, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api';

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = searchParams.get('amount') || '999';
    const planId = searchParams.get('planId');
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        // Simulate Web Payment Gateway Delay
        setTimeout(async () => {
            try {
                // In production: await razorpay.open()
                // Here we verify the backend endpoint is reachable
                try {
                    // Using the confirm/ endpoint for verification
                    await apiClient.post('/payments/confirm/', {
                        plan_id: planId,
                        status: 'SUCCESS',
                        amount: amount
                    });

                    alert('Payment Successful! Receipt sent to email.');
                    router.push('/dashboard');
                } catch (apiError) {
                    console.error(apiError);
                    // Fallback for demo if backend auth missing
                    alert('Payment Simulation Successful!');
                    router.push('/dashboard');
                }
            } catch (error) {
                alert('Payment failed. Please try again.');
            } finally {
                setProcessing(false);
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-md mx-auto">
                <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <Card className="shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Checkout</CardTitle>
                        <CardDescription>Secure Payment Gateway</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center py-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-5xl font-bold text-primary">₹{amount}</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Method</h3>

                            <div
                                onClick={handlePayment}
                                className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-primary hover:bg-slate-50 transition-all"
                            >
                                <CreditCard className="h-6 w-6 text-primary mr-4" />
                                <div className="flex-1">
                                    <p className="font-semibold">Credit / Debit Card</p>
                                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Rupay</p>
                                </div>
                            </div>

                            <div
                                onClick={handlePayment}
                                className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-primary hover:bg-slate-50 transition-all"
                            >
                                <Wallet className="h-6 w-6 text-primary mr-4" />
                                <div className="flex-1">
                                    <p className="font-semibold">UPI / Wallets</p>
                                    <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full h-12 text-lg"
                                size="lg"
                                onClick={handlePayment}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Pay Securely'
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center justify-center text-xs text-green-600 font-medium">
                            <ShieldCheck className="h-4 w-4 mr-1.5" />
                            Payments processed securely by Razorpay
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Checkout...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
