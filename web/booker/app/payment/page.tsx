'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, CreditCard, Wallet, Loader2, ArrowLeft, CheckCircle2, Lock, Smartphone } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

function RazorpayMock({ amount, onConfirm, onCancel, processing }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-[#2c333e] p-5 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-lg italic">R</div>
                        <div>
                            <h3 className="text-sm font-bold leading-tight">Razorpay Checkout</h3>
                            <p className="text-[10px] text-slate-400">VEHICAID TRUSTED PARTNER</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase">Amount</p>
                        <p className="text-lg font-bold">₹{amount}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 bg-slate-50">
                    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b">
                            <span className="text-xs font-bold text-slate-500">PAYMENT OPTIONS</span>
                            <Lock className="w-3 h-3 text-slate-400" />
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <Smartphone className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">UPI / QR</p>
                                    <p className="text-[10px] text-slate-500">Google Pay, PhonePe, & others</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 rounded-md bg-blue-50/50 border border-blue-200 cursor-pointer transition-all">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-700">Card</p>
                                    <p className="text-[10px] text-blue-500">Visa, Mastercard, RuPay, Maestro</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-[10px] text-center text-slate-400 uppercase tracking-widest">Simulation Mode</div>
                        <Button 
                            className="w-full bg-[#3395ff] hover:bg-[#2088ff] text-white font-bold h-12 rounded-lg"
                            onClick={onConfirm}
                            disabled={processing}
                        >
                            {processing ? <Loader2 className="animate-spin" /> : `Pay ₹${amount}`}
                        </Button>
                        <button 
                            className="w-full text-xs text-slate-400 hover:text-slate-600 font-medium"
                            onClick={onCancel}
                            disabled={processing}
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-white border-t flex justify-center items-center gap-2 grayscale opacity-50">
                    <p className="text-[10px] font-bold">SECURED BY</p>
                    <div className="flex gap-2">
                        <div className="text-[10px] font-black italic">VISA</div>
                        <div className="text-[10px] font-black italic">Mastercard</div>
                        <div className="text-[10px] font-black italic text-blue-800">RuPay</div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = searchParams.get('amount') || '999';
    const planId = searchParams.get('planId');
    const [processing, setProcessing] = useState(false);
    const [showGateway, setShowGateway] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');

    const handleConfirm = async () => {
        setProcessing(true);
        try {
            // Confirm with backend
            await apiClient.post('/payments/confirm/', {
                plan_id: planId,
                status: 'SUCCESS',
                amount: amount
            });
            
            setStatus('success');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (apiError) {
            console.error(apiError);
            setStatus('success'); // Fallback for demo
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } finally {
            setProcessing(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold">Payment Successful</h1>
                    <p className="text-slate-500">Activating your {planId} benefits now...</p>
                    <div className="pt-4">
                        <Loader2 className="animate-spin mx-auto text-primary" />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-12 px-4 relative">
            <div className="max-w-md mx-auto relative z-10">
                <Button variant="ghost" className="mb-6 hover:bg-slate-200" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <Card className="shadow-2xl border-none ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl overflow-hidden">
                    <CardHeader className="text-center pb-8 pt-10 px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black">Checkout</CardTitle>
                        <CardDescription>Securely complete your transaction</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="text-center py-10 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-800">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-bold">Payable Amount</p>
                            <p className="text-6xl font-black text-primary">₹{amount}</p>
                            <p className="text-xs text-slate-400 mt-4 font-mono">{planId || 'Basic'} Subscription</p>
                        </div>

                        <div className="space-y-4">
                             <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs">
                                <Lock className="w-3 h-3" />
                                <span>256-bit SSL encrypted secure payment environment</span>
                             </div>

                             <Button 
                                className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                size="lg"
                                onClick={() => setShowGateway(true)}
                             >
                                Checkout with Razorpay
                             </Button>
                        </div>

                        <div className="flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                             <span>Trusted by 10,000+ Users</span>
                             <div className="w-1 h-1 bg-slate-400 rounded-full" />
                             <span>Powered by Razorpay</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AnimatePresence>
                {showGateway && (
                    <RazorpayMock 
                        amount={amount} 
                        onConfirm={handleConfirm}
                        onCancel={() => setShowGateway(false)}
                        processing={processing}
                    />
                )}
            </AnimatePresence>
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
