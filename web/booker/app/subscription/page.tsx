'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Shield, Star, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<any[]>([]);
    const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Plans (Public)
                const plansRes = await apiClient.get('/services/subscriptions/plans/');
                const sortedPlans = plansRes.data.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
                setPlans(sortedPlans);

                // Fetch Current Subscription (Private)
                if (user) {
                    try {
                        const subRes = await apiClient.get('/services/subscriptions/current/');
                        if (subRes.data && subRes.data.plan) {
                            setCurrentPlanId(subRes.data.plan.id);
                        }
                    } catch (e) {
                        // No active subscription, ignore
                    }
                }

            } catch (err) {
                console.error("Failed to fetch subscription data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const getIcon = (name: string) => {
        if (name.includes('Elite')) return Zap;
        if (name.includes('Premium')) return Star;
        if (name.includes('Basic')) return Shield;
        if (name.includes('Free')) return User;
        return User;
    };

    const handleSubscribe = (plan: any) => {
        // Redirect to payment page with plan details
        // Assuming price is a string like "2999.00"
        const amount = plan.price;
        // Payment page expects planId as name or ID. We used name in mock, but lets use name here too as per mock view.
        if (parseFloat(amount) === 0) {
            // Free plan logic - might need a direct subscribe API call here
            // For now, redirect to a confirmation or dashboard since no payment is needed
            // In a real app, you'd hit an endpoint to switch to free plan immediately
            router.push('/dashboard');
            return;
        }
        router.push(`/payment?amount=${amount}&planId=${plan.name}`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading plans...</div>;
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-muted-foreground">Choose the plan that fits your driving lifestyle.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, index) => {
                        const Icon = getIcon(plan.name);
                        const isCurrent = currentPlanId === plan.id;
                        const isPopular = plan.name.includes('Premium'); // Example logic

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className={`relative h-full flex flex-col border-2 ${isCurrent ? 'border-green-500 shadow-xl' : isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'border-muted hover:border-primary/50'}`}>
                                    {isPopular && !isCurrent && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    )}
                                    {isCurrent && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                            <Check size={14} /> Current Plan
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <CardDescription>{plan.description || "Features included in this plan."}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="text-4xl font-bold mb-6">
                                            ₹{parseFloat(plan.price).toFixed(0)}
                                            <span className="text-base font-normal text-muted-foreground">/mo</span>
                                        </div>
                                        <ul className="space-y-3">
                                            {/* Assuming plan.features is a JSON array or string list */}
                                            {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, i: number) => (
                                                <li key={i} className="flex items-center text-sm">
                                                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                            {(!plan.features || plan.features.length === 0) && (
                                                <li className="text-sm text-muted-foreground">Standard features included.</li>
                                            )}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full"
                                            variant={isCurrent ? "secondary" : (isPopular ? "default" : "outline")}
                                            onClick={() => handleSubscribe(plan)}
                                            disabled={isCurrent}
                                        >
                                            {isCurrent ? "Active Plan" : "Upgrade"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-16 bg-slate-50/50 p-8 rounded-2xl border border-dashed border-indigo-200 text-center space-y-4 backdrop-blur-sm">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Premium Benefit: Replacement Vehicle</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Stuck with a breakdown? Premium and Elite members can instantly request a temporary replacement vehicle to continue their journey while we handle the repairs.
                </p>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8"
                    onClick={() => router.push('/exchange')}
                >
                    Request Replacement Vehicle
                </Button>
            </div>
        </div>
    );
}
