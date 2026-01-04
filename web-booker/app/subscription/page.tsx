'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Shield, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: "Basic",
        price: "$9.99/mo",
        description: "Essential coverage for peace of mind.",
        features: ["3 Towing Requests / yr (5 miles)", "Battery Jump Start", "Flat Tire Change", "Lockout Service"],
        popular: false,
        icon: Shield
    },
    {
        name: "Premium",
        price: "$19.99/mo",
        description: "Comprehensive protection for daily drivers.",
        features: ["Unlimited Towing (25 miles)", "Priority Response", "Trip Interruption Coverage", "Fuel Delivery", "All Basic Features"],
        popular: true,
        icon: Star
    },
    {
        name: "Elite",
        price: "$29.99/mo",
        description: "Ultimate service and perks for enthusiasts.",
        features: ["Unlimited Towing (100 miles)", "Dedicated Advisor", "Vehicle Inspection Reports", "Rental Car Reimbursement", "All Premium Features"],
        popular: false,
        icon: Zap
    }
];

export default function SubscriptionPage() {
    return (
        <div className="min-h-screen bg-background py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-muted-foreground">Choose the plan that fits your driving lifestyle.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className={`relative h-full flex flex-col border-2 ${plan.popular ? 'border-primary shadow-2xl scale-105 z-10' : 'border-muted hover:border-primary/50'}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <plan.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6">
                                        {plan.price}
                                        <span className="text-base font-normal text-muted-foreground">/mo</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center text-sm">
                                                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                        Subscribe Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
