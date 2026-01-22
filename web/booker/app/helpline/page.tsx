'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Headphones, ArrowLeft, Lock, Shield, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';

// Toll-Free Helpline Numbers (Subscription-based)
const HELPLINE_NUMBERS: Record<string, string | null> = {
    FREE: null,
    STANDARD: '1800-123-4567',
    PREMIUM: '1800-VEHIC-AID',
    IOT: '1800-IOT-HELP',
};

interface Subscription {
    plan: {
        name: string;
    };
    is_active: boolean;
}

interface HelplineCall {
    id: number;
    call_start: string;
    notes: string;
}

export default function HelplinePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [callHistory, setCallHistory] = useState<HelplineCall[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subRes, callsRes] = await Promise.all([
                apiClient.get('/services/subscriptions/active/'),
                apiClient.get('/services/helpline/')
            ]);
            setSubscription(subRes.data);
            setCallHistory(callsRes.data.results || callsRes.data || []);
        } catch (error) {
            console.log('Helpline fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHelplineNumber = (): string | null => {
        if (!subscription || !subscription.is_active) return null;
        const planName = subscription.plan?.name?.toUpperCase() || 'FREE';
        return HELPLINE_NUMBERS[planName] || HELPLINE_NUMBERS.STANDARD;
    };

    const hasHelplineAccess = () => {
        return subscription && subscription.is_active && subscription.plan?.name !== 'FREE';
    };

    const handleCall = async () => {
        const number = getHelplineNumber();
        if (!number) return;

        try {
            await apiClient.post('/services/helpline/', {
                call_start: new Date().toISOString(),
                notes: 'Call initiated from web app'
            });
            window.location.href = `tel:${number.replace(/-/g, '')}`;
            fetchData();
        } catch (error) {
            console.log('Call log error:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getPlanBenefits = (planName: string) => {
        switch (planName?.toUpperCase()) {
            case 'PREMIUM':
                return ['24/7 Dedicated Support', 'Priority Response', 'No Wait Time', 'Replacement Vehicle Access'];
            case 'STANDARD':
                return ['24/7 Toll-Free Support', 'Average Wait: 2 mins', 'Call Records Saved'];
            default:
                return ['In-App Chat Only', 'Business Hours Support'];
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Hero Section */}
                <Card className="mb-8 bg-gradient-to-r from-red-500 to-rose-600 text-white border-0">
                    <CardHeader className="text-center pb-2">
                        <Headphones className="h-16 w-16 mx-auto mb-4" />
                        <CardTitle className="text-3xl">24/7 Emergency Helpline</CardTitle>
                        <CardDescription className="text-red-100">
                            Get immediate assistance anytime, anywhere
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        {hasHelplineAccess() && (
                            <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
                                <Phone className="h-5 w-5" />
                                <span className="text-xl font-bold">{getHelplineNumber()}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Call Button or Upgrade */}
                {loading ? (
                    <Card className="mb-8 text-center py-12">
                        <CardContent>Loading...</CardContent>
                    </Card>
                ) : hasHelplineAccess() ? (
                    <>
                        <Button
                            onClick={handleCall}
                            className="w-full h-16 text-xl mb-8 bg-green-500 hover:bg-green-600"
                        >
                            <Phone className="mr-3 h-6 w-6" />
                            Call Now - FREE
                        </Button>

                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    Your Plan: {subscription?.plan.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {getPlanBenefits(subscription?.plan.name || '').map((benefit, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card className="mb-8 border-dashed">
                        <CardContent className="text-center py-8">
                            <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Helpline Access Locked</h3>
                            <p className="text-gray-500 mb-6">
                                Subscribe to get 24/7 toll-free helpline access, even when your phone has no network or recharge!
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <Card className="text-left">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Basic</CardTitle>
                                        <CardDescription className="text-2xl font-bold text-primary">₹99/mo</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">Toll-Free: 1800-123-4567</p>
                                    </CardContent>
                                </Card>
                                <Card className="text-left">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Premium</CardTitle>
                                        <CardDescription className="text-2xl font-bold text-primary">₹199/mo</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">Priority: 1800-VEHIC-AID</p>
                                    </CardContent>
                                </Card>
                                <Card className="text-left border-primary bg-primary/5">
                                    <CardHeader className="pb-2">
                                        <Badge className="w-fit mb-2">Best Value</Badge>
                                        <CardTitle className="text-lg">Elite</CardTitle>
                                        <CardDescription className="text-2xl font-bold text-primary">₹499/mo</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">Dedicated: 1800-ELITE-AID</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Button onClick={() => router.push('/subscription')} size="lg">
                                View Subscription Plans
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Call History */}
                {hasHelplineAccess() && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Recent Calls</h2>
                        {callHistory.length === 0 ? (
                            <Card className="text-center py-8">
                                <CardContent>
                                    <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500">No call history yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {callHistory.slice(0, 5).map((call) => (
                                    <Card key={call.id}>
                                        <CardContent className="py-3 flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{formatDate(call.call_start)}</p>
                                                <p className="text-sm text-gray-500">{call.notes || 'Helpline call'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* IoT Promo */}
                <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                    <CardContent className="py-6">
                        <h3 className="font-bold text-lg mb-2">📱 No Phone? No Problem!</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            With our IoT device, you can call for help even when your phone has no battery or network.
                            One button for common issues, another for all services.
                        </p>
                        <Button variant="outline" onClick={() => router.push('/health')}>
                            Learn about IoT Device
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
