'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Plus, Battery, MapPin, Zap, AlertTriangle, Phone, Activity, Fuel, Disc, Wrench, Menu, Bell, User, LogOut, Settings, CreditCard, Truck, Headphones, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [deviceStatus, setDeviceStatus] = useState<any>(null);
    const [activePlan, setActivePlan] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch IoT Status
                const iotResponse = await apiClient.get('/iot/status/');
                setDeviceStatus(iotResponse.data);
            } catch (err) {
                console.debug("No IoT device linked or error fetching status.");
                setDeviceStatus(null);
            }

            try {
                // Fetch Active Subscription
                const subResponse = await apiClient.get('/services/subscriptions/current/');
                setActivePlan(subResponse.data);
            } catch (err) {
                // 404 means no active subscription
                setActivePlan(null);
            }
        };
        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
    );

    if (!user) {
        // Only redirect if not loading to avoid race conditions
        router.push('/auth/login?redirect=/dashboard');
        return null;
    }

    // Fallback if no device found
    const displayStatus = deviceStatus ? {
        connected: deviceStatus.is_active,
        battery: deviceStatus.battery || 0,
        location: deviceStatus.latitude ? `${parseFloat(deviceStatus.latitude).toFixed(4)}, ${parseFloat(deviceStatus.longitude).toFixed(4)}` : 'Unknown Location',
        lat: deviceStatus.latitude,
        lng: deviceStatus.longitude
    } : {
        connected: false,
        battery: 0,
        location: 'Not Connected'
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.02] select-none pointer-events-none">
                <h1 className="text-[12rem] font-bold -rotate-12 whitespace-nowrap">VehicAid</h1>
            </div>

            {/* Header Removed - Global Navbar Used */}
            <div className="h-4"></div>

            <main className="container px-4 sm:px-8 py-8 space-y-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back, {user?.username?.split('@')[0] || 'Traveler'}
                        </h1>
                        <p className="text-muted-foreground mt-1">Vehicle status is nominal. Ready for your journey.</p>
                    </div>
                    <Button onClick={() => router.push('/request')} className="shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Button>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* IoT Device Status Card */}
                    <motion.div variants={item} className="md:col-span-2 relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
                        <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${displayStatus.connected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400'} animate-pulse`}></div>
                                        <span className="text-xs font-medium uppercase tracking-wider text-slate-300">System Online</span>
                                    </div>
                                    <h2 className="text-2xl font-bold">Vehic-Aid Connect</h2>
                                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                                        <MapPin size={14} /> {displayStatus.location}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold flex items-center justify-end gap-2">
                                        {displayStatus.battery}%
                                        <Battery className={displayStatus.battery > 20 ? 'text-green-400' : 'text-red-400'} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Battery Level</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-auto py-3">
                                    <Activity className="mr-2 h-4 w-4" /> Diagnostics
                                </Button>
                                <Button variant="destructive" className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30 backdrop-blur-sm h-auto py-3">
                                    <AlertTriangle className="mr-2 h-4 w-4" /> SOS Mode
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats / Subscription */}
                    <motion.div variants={item} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Active Plan</h3>
                            {activePlan ? (
                                <>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                                        {activePlan?.plan?.name || 'Active Plan'}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {activePlan?.plan?.name === 'Elite'
                                            ? 'You have full VIP access and unlimited towing.'
                                            : activePlan?.plan?.name === 'Premium'
                                                ? 'Great choice! You have priority support.'
                                                : 'Upgrade to Elite for VIP support and unlimited towing.'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-4">
                                        Free Access
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Upgrade to Premium for 24/7 priority support and unlimited towing.
                                    </p>
                                </>
                            )}
                        </div>
                        <Button variant="outline" onClick={() => router.push(activePlan ? '/billing' : '/subscription')} className="w-full">
                            {activePlan ? 'Manage Subscription' : 'View Plans'}
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Services Grid */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Services</h3>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {[
                            { title: 'Towing', icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Recovery', link: '?type=TOWING' },
                            { title: 'Fuel', icon: Fuel, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Delivery', link: '?type=FUEL' },
                            { title: 'Flat Tire', icon: Disc, color: 'text-slate-500', bg: 'bg-slate-500/10', desc: 'Repair', link: '?type=FLAT_TIRE' },
                            { title: 'Replacement', icon: ArrowLeftRight, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Temp Vehicle', link: '/exchange' },
                            { title: 'Placement', icon: Truck, color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Move Vehicle', link: '/placement' },
                            { title: 'Helpline', icon: Headphones, color: 'text-red-500', bg: 'bg-red-500/10', desc: '24/7 Support', link: '/helpline' },
                        ].map((service, i) => (
                            <motion.button
                                key={service.title}
                                variants={item}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push(service.link.startsWith('?') ? `/request${service.link}` : service.link)}
                                className="flex flex-col items-center justify-center p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all text-center group"
                            >
                                <div className={`w-12 h-12 rounded-full ${service.bg} ${service.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <service.icon size={24} />
                                </div>
                                <h4 className="font-semibold">{service.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{service.desc}</p>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
