'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function WalletPage() {
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addAmount, setAddAmount] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchWallet = async () => {
        try {
            const res = await apiClient.get('/services/wallet/');
            setWallet(res.data);
            const txRes = await apiClient.get('/services/wallet/transactions/');
            setTransactions(txRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleAddMoney = async () => {
        if (!addAmount) return;
        try {
            await apiClient.post('/services/wallet/add-money/', { amount: addAmount });
            setShowAddModal(false);
            setAddAmount('');
            fetchWallet();
        } catch (error) {
            alert('Failed to add money');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Wallet...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-black text-white p-8 shadow-2xl"
                >
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <p className="text-white/60 font-medium mb-1">Total Balance</p>
                            <h1 className="text-5xl font-bold tracking-tight">
                                ₹{parseFloat(wallet?.balance || '0').toLocaleString()}
                            </h1>
                        </div>
                        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="rounded-full bg-white text-black hover:bg-slate-200 font-bold px-8 h-12">
                                    <Plus className="w-5 h-5 mr-2" /> Add Money
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Funds</DialogTitle>
                                    <DialogDescription>Top up your secure VehicAid wallet.</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        type="number"
                                        placeholder="Amount (₹)"
                                        value={addAmount}
                                        onChange={(e) => setAddAmount(e.target.value)}
                                        className="text-lg"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddMoney}>Confirm Payment</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/30 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/30 blur-[100px] rounded-full pointer-events-none" />
                </motion.div>

                {/* Transactions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Recent Transactions
                    </h2>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-0">
                            {transactions.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No transactions yet.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full ${parseFloat(tx.amount) > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {parseFloat(tx.amount) > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{tx.description || 'Transaction'}</p>
                                                    <p className="text-xs text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${parseFloat(tx.amount) > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                                {parseFloat(tx.amount) > 0 ? '+' : ''}₹{Math.abs(parseFloat(tx.amount)).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
