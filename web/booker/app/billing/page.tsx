'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Zap, Download } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [subscription, setSubscription] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch Subscription
                try {
                    const subRes = await apiClient.get('/services/subscriptions/current/');
                    setSubscription(subRes.data);
                } catch (e) {
                    setSubscription(null);
                }

                // Fetch History
                const histRes = await apiClient.get('/payments/history/booker/');
                setTransactions(histRes.data);
            } catch (error) {
                console.error("Error fetching billing data:", error);
            } finally {
                setLoadingData(false);
            }
        };

        if (!loading && user) {
            fetchData();
        } else if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);


    if (loading || loadingData) {
        return <div className="p-8 text-center text-muted-foreground">Loading billing details...</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <h1 className="text-3xl font-bold mb-2">Billing & Plans</h1>
            <p className="text-muted-foreground mb-8">Manage your subscription and payment methods.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Current Plan Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>
                                    You are currently on the <span className="font-semibold text-foreground">
                                        {subscription ? subscription.plan_details.name : 'Free Tier'}
                                    </span>
                                </CardDescription>
                            </div>
                            <Badge variant={subscription ? "default" : "outline"} className="text-sm py-1 px-3">
                                {subscription ? subscription.plan_details.name.replace(' Plan', '') : 'Free'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {subscription ? (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span>Status</span>
                                        <span className={`font-medium ${subscription.status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {subscription.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Renews On</span>
                                        <span className="font-medium">
                                            {new Date(subscription.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Price</span>
                                        <span className="font-medium">₹{subscription.plan_details.price}/mo</span>
                                    </div>
                                    <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-primary h-full" style={{ width: '100%' }}></div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Service Requests</span>
                                        <span className="font-medium">Pay-per-use</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Priority Support</span>
                                        <span className="text-muted-foreground">Not Included</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" onClick={() => router.push('/subscription')}>
                            {subscription ? 'Change Plan' : 'Upgrade Plan'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Payment Method Card - Placeholder for now as we use standard gateway */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Default for all charges</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="w-16 h-10 bg-slate-200 rounded-md flex items-center justify-center mb-4 text-slate-500">
                            <CreditCard />
                        </div>
                        <p className="text-sm font-medium">Razorpay Gateway</p>
                        <p className="text-xs text-muted-foreground">UPI / Cards / Netbanking</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="secondary" disabled>Manage in Gateway</Button>
                    </CardFooter>
                </Card>
            </div>

            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Invoice</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{tx.invoice_id}</td>
                                            <td className="p-4 align-middle">{tx.description}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant="default" className={tx.status === 'SUCCESS' ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500"}>
                                                    {tx.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">₹{tx.amount.toFixed(2)}</td>
                                            <td className="p-4 align-middle">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            No payment history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
