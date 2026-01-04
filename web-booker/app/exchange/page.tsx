
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VehicleExchangePage() {
    const router = useRouter();

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
                    <p className="text-purple-100 mt-2 text-sm">Don't stop moving. Swap your broken vehicle for a rental instantly.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Pickup Location</label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:bg-white transition">
                            <MapPin size={18} className="text-gray-400" />
                            <input type="text" placeholder="Current Location" className="bg-transparent outline-none w-full text-sm" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Rental Duration (Days)</label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:bg-white transition">
                            <Calendar size={18} className="text-gray-400" />
                            <input type="number" placeholder="e.g. 3" className="bg-transparent outline-none w-full text-sm" />
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-700 font-medium">Est. Rental Fee</span>
                            <span className="text-purple-900 font-bold text-lg">₹1,500</span>
                        </div>
                        <p className="text-xs text-purple-500">Includes insurance and delivery.</p>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => router.back()} className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition">Cancel</button>
                        <button className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition transform active:scale-95">
                            Request Swap
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
