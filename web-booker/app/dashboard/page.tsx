
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Battery, MapPin, Zap, AlertTriangle, Phone } from 'lucide-react';

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    // Assuming protected route logic handles redirect if !user

    // Mock Data for IoT Device (In real implementation, fetch this via API)
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
        <div className="min-h-screen bg-neutral-50 p-6 font-sans">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hello, {user?.username || 'Traveler'} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Ready to hit the road?</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition">
                        <span className="sr-only">Notifications</span>
                        🔔
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                </div>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* IoT Device Status Card */}
                <motion.div variants={item} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${deviceStatus.connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">IoT Shield Active</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">Vehic-Aid Connect</h2>
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                <MapPin size={14} /> {deviceStatus.location}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold flex items-center justify-end gap-1">
                                {deviceStatus.battery}% <Battery size={24} className={deviceStatus.battery > 20 ? 'text-green-400' : 'text-red-400'} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Battery Level</p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 transition p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                            <Zap size={16} /> Diagnostic Scan
                        </button>
                        <button className="flex-1 bg-red-500/20 text-red-100 hover:bg-red-500/30 transition p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium border border-red-500/20">
                            <AlertTriangle size={16} /> SOS Mode
                        </button>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.button
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/request?type=TOWING')}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-left group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Towing</h3>
                        <p className="text-xs text-gray-500 mt-1">Breakdown recovery</p>
                    </motion.button>

                    <motion.button
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/request?type=FUEL')}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-left group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Fuel Delivery</h3>
                        <p className="text-xs text-gray-500 mt-1">Petrol or Diesel</p>
                    </motion.button>

                    <motion.button
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/request?type=FLAT_TIRE')}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-left group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                            <div className="w-6 h-6 rounded-full border-4 border-current"></div>
                        </div>
                        <h3 className="font-semibold text-gray-900">Flat Tire</h3>
                        <p className="text-xs text-gray-500 mt-1">Change or pump</p>
                    </motion.button>

                    <motion.button
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/exchange')}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-left group border border-purple-100"
                    >
                        <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        </div>
                        <h3 className="font-semibold text-purple-900">Vehicle Exchange</h3>
                        <p className="text-xs text-purple-500 mt-1">Premium Service</p>
                    </motion.button>
                </div>

                {/* Recent Activity or Active Requests */}
                <motion.div variants={item}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Active Requests</h3>
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <MapPin />
                        </div>
                        <p className="text-gray-500">No active service requests.</p>
                        <button onClick={() => router.push('/request')} className="mt-4 text-primary font-medium hover:underline">
                            Start a new request
                        </button>
                    </div>
                </motion.div>

                {/* Subscription Teaser */}
                <motion.div variants={item} className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                    <div>
                        <h3 className="text-xl font-bold">Upgrade to Premium</h3>
                        <p className="text-purple-100 text-sm mt-1 max-w-md">
                            Get 24/7 Helpline access, vehicle exchange benefits, and unlimited free towing.
                        </p>
                    </div>
                    <button onClick={() => router.push('/subscription')} className="px-6 py-2 bg-white text-purple-600 font-bold rounded-lg shadow-sm hover:bg-gray-50 transition">
                        View Plans
                    </button>
                </motion.div>

                {/* 24/7 Helpline FAB */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:bg-red-700 transition"
                >
                    <Phone size={24} />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></span>
                </motion.button>

            </motion.div>
        </div>
    );
}
