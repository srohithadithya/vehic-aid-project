'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Activity, AlertCircle, CheckCircle2, Send, Loader2, IndianRupee, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/api';

export default function PaymentSimulationPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const [payload, setPayload] = useState({
        order_id: `ord_${Math.random().toString(36).substr(2, 9)}`,
        payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        amount: '1000',
        event: 'payment.captured'
    });

    const simulateWebhook = async (type: 'SUCCESS' | 'FAILED') => {
        setLoading(true);
        setStatus('idle');
        try {
            await apiClient.post('/payments/confirm/', {
                order_id: payload.order_id,
                payment_id: payload.payment_id,
                amount: payload.amount,
                status: type
            });
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 space-y-8"
        >
            <div className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                        Payment Simulator
                    </h2>
                    <p className="text-white/50 mt-1">Stress test the financial infrastructure and webhook listeners.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400">GATEWAY ONLINE</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Column */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Zap className="text-yellow-400 w-5 h-5" />
                                Webhook Mock Payload
                            </CardTitle>
                            <CardDescription>Configure the data to be sent to the backend endpoint.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Razorpay Order ID</label>
                                    <Input 
                                        value={payload.order_id} 
                                        onChange={(e) => setPayload({...payload, order_id: e.target.value})}
                                        className="bg-white/5 border-white/10 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase">Transaction ID</label>
                                    <Input 
                                        value={payload.payment_id} 
                                        onChange={(e) => setPayload({...payload, payment_id: e.target.value})}
                                        className="bg-white/5 border-white/10 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase">Amount (Paise)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                    <Input 
                                        type="number"
                                        value={payload.amount} 
                                        onChange={(e) => setPayload({...payload, amount: e.target.value})}
                                        className="bg-white/5 border-white/10 pl-10"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">JSON Output Preview</span>
                                    <button className="text-[10px] text-blue-400 hover:text-blue-300">Copy Payload</button>
                                </div>
                                <pre className="text-xs font-mono text-blue-300">
                                    {JSON.stringify({
                                        event: payload.event,
                                        payload: {
                                            payment: {
                                                entity: {
                                                    id: payload.payment_id,
                                                    amount: parseInt(payload.amount),
                                                    order_id: payload.order_id,
                                                    status: "captured"
                                                }
                                            }
                                        }
                                    }, null, 2)}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-6">
                        <Button 
                            className="h-20 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-900/20 group"
                            onClick={() => simulateWebhook('SUCCESS')}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <CheckCircle2 className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                                    Simulate Success Signal
                                </>
                            )}
                        </Button>
                        <Button 
                            className="h-20 text-lg font-bold bg-rose-600 hover:bg-rose-500 rounded-2xl shadow-lg shadow-rose-900/20 group"
                            onClick={() => simulateWebhook('FAILED')}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <AlertCircle className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                                    Simulate Failure Signal
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="glass-card border-white/10 h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg">Event Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {status === 'idle' && !loading && (
                                <div className="text-center py-12 text-white/30 italic text-sm">
                                    Waiting for simulation pulse...
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center gap-4 py-12">
                                    <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
                                    <p className="text-sm text-blue-400 font-bold animate-pulse">Broadcasting Signal...</p>
                                </div>
                            )}

                            {status === 'success' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-4"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                                    <div>
                                        <p className="font-bold text-emerald-400 uppercase tracking-widest text-xs">Response 200 OK</p>
                                        <p className="text-sm text-white/70 mt-1">Transaction reconciled successfully.</p>
                                    </div>
                                    <Button className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30">
                                        View In Ledger
                                    </Button>
                                </motion.div>
                            )}

                            {status === 'failed' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-4"
                                >
                                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                                    <div>
                                        <p className="font-bold text-rose-400 uppercase tracking-widest text-xs">Response 400 Bad Request</p>
                                        <p className="text-sm text-white/70 mt-1">Simulated error response received.</p>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-4 border-t border-white/5 space-y-3">
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Listeners</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[10px] font-mono">
                                        <span className="text-white/60">SubscriptionEngine</span>
                                        <span className="text-emerald-400">LISTENING</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[10px] font-mono">
                                        <span className="text-white/60">PayoutReconciler</span>
                                        <span className="text-emerald-400">LISTENING</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[10px] font-mono">
                                        <span className="text-white/60">LedgerService</span>
                                        <span className="text-emerald-400">LISTENING</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
