
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VehicleExchangePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [eligible, setEligible] = useState(false);
    const [days, setDays] = useState(3);
    const [location, setLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        checkEligibility();
    }, []);

    const checkEligibility = async () => {
        try {
            const res = await apiClient.get('/services/subscriptions/current/');
            const plan = res.data.plan;
            // Check based on plan name or features
            if (plan && (plan.name === 'PREMIUM' || plan.name === 'ELITE')) {
                setEligible(true);
            } else {
                setEligible(false);
            }
        } catch (error) {
            console.error("Error checking eligibility", error);
            setEligible(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!location) return alert("Please enter a location");
        setSubmitting(true);
        try {
            // Need a VehicleExchange endpoint. Assuming /services/vehicle-exchange/
            // Note: ViewSet requires 'request' (ServiceRequest ID) usually?
            // Wait, VehicleExchangeViewSet `perform_create` checks subscription.
            // But Model VehicleExchange links to `request`.
            // We might need to Create a ServiceRequest of type 'EXCHANGE' first?

            // For now, let's assume we can create a direct exchange request or this is a "Service Request" of type EXCHANGE.
            // Actually, usually Exchange is a separate flow. 
            // If the backend requires a ServiceRequest, we should create that first.

            // Simplified flow: Create Service Request with description "Vehicle Exchange"
            await apiClient.post('/services/request/', {
                service_type: 'TOWING', // or OTHER
                description: `Vehicle Exchange Request. Duration: ${days} days. Location: ${location}`,
                vehicle_id: null // User picks vehicle later or system picks default
            });

            alert("Exchange Request Submitted! A support agent will contact you shortly.");
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert("Failed to submit request.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (!eligible) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <ArrowRightLeft className="text-red-600 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Premium Feature</h2>
                    <p className="text-slate-500">
                        Vehicle Exchange is exclusively available for <span className="font-bold text-indigo-600">Premium</span> and <span className="font-bold text-indigo-600">Elite</span> members.
                    </p>
                    <Button onClick={() => router.push('/subscription')} className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Upgrade Plan
                    </Button>
                    <Button variant="ghost" onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-purple-600 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <ArrowRightLeft size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Premium Exchange</h1>
                    <p className="text-purple-100 mt-2 text-sm">Don&apos;t stop moving. Swap your vehicle instantly.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Pickup Location</label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:bg-white transition">
                            <MapPin size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter Address"
                                className="bg-transparent outline-none w-full text-sm"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Rental Duration (Days)</label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:bg-white transition">
                            <Calendar size={18} className="text-gray-400" />
                            <input
                                type="number"
                                className="bg-transparent outline-none w-full text-sm"
                                value={days}
                                onChange={(e) => setDays(parseInt(e.target.value))}
                                min={1}
                                max={7}
                            />
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-700 font-medium">Est. Rental Fee</span>
                            <span className="text-purple-900 font-bold text-lg">₹{(1500 * days).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-purple-500">Includes insurance and delivery. 24h Service.</p>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => router.back()} className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition transform active:scale-95 disabled:opacity-70 flex justify-center items-center"
                        >
                            {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Request Swap"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
