'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Battery, MapPin, Zap, AlertTriangle, Phone, Activity, Fuel, Disc, Wrench, Menu, Bell, User, LogOut, Settings, CreditCard } from 'lucide-react';
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
    );

    // Mock Data for IoT Device
    const deviceStatus = {
        connected: true,
        battery: 85,
        location: 'Indiranagar, Bangalore',
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

            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                            VehicAid
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="p-4 text-sm text-center text-muted-foreground">
                                    No new notifications
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold ring-2 ring-primary/20">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => router.push('/login')}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

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
                                        <div className={`w-2 h-2 rounded-full ${deviceStatus.connected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400'} animate-pulse`}></div>
                                        <span className="text-xs font-medium uppercase tracking-wider text-slate-300">System Online</span>
                                    </div>
                                    <h2 className="text-2xl font-bold">Vehic-Aid Connect</h2>
                                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                                        <MapPin size={14} /> {deviceStatus.location}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold flex items-center justify-end gap-2">
                                        {deviceStatus.battery}%
                                        <Battery className={deviceStatus.battery > 20 ? 'text-green-400' : 'text-red-400'} />
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
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                                Free Access
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Upgrade to Premium for 24/7 priority support and unlimited towing.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => router.push('/subscription')} className="w-full">
                            View Plans
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
                            { title: 'Exchange', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Vehicle Swap', link: '/exchange' },
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
