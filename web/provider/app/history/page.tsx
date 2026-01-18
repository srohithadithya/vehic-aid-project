'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import {
    Calendar, MapPin, DollarSign, Clock, Search, Filter,
    ArrowUpRight, CheckCircle, XCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import AuthGuard from '@/components/AuthGuard';

interface APIJob {
    id: number;
    service_type: string;
    created_at: string;
    latitude: string;
    longitude: string;
    amount?: number;
    status: string;
}

interface JobHistoryItem {
    id: number;
    type: string;
    date: string;
    location: string;
    amount: number;
    status: string;
}

export default function HistoryPage() {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('ALL');
    const [history, setHistory] = useState<JobHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await apiClient.get('/services/provider/jobs/');
                // Transform API data to match UI needs
                const mappedData = response.data.map((job: APIJob) => ({
                    id: job.id,
                    type: job.service_type,
                    date: job.created_at,
                    location: `${parseFloat(job.latitude).toFixed(4)}, ${parseFloat(job.longitude).toFixed(4)}`, // Basic Lat/Lng since we don't have reverse geocoding in API yet
                    amount: job.amount || 0,
                    status: job.status
                }));
                setHistory(mappedData);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredHistory = history.filter(item => {
        if (filter === 'ALL') return true;
        return item.status === filter;
    });

    return (
        <AuthGuard>
            <div className="min-h-screen bg-black text-white">
                <Navbar />

                <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pt-24 space-y-8">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Mission Log
                            </h1>
                            <p className="text-gray-400 mt-1">Archive of all past operations and settlements.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search ID or Location..."
                                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none w-64"
                                />
                            </div>
                            <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <Filter className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['ALL', 'COMPLETED', 'CANCELLED'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap",
                                    filter === f
                                        ? "bg-white text-black border-white"
                                        : "bg-transparent text-gray-500 border-white/10 hover:border-white/30"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        {filteredHistory.map((job, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={job.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all group relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                                            job.status === 'COMPLETED'
                                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                                : "bg-red-500/10 border-red-500/20 text-red-400"
                                        )}>
                                            {job.status === 'COMPLETED' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-white text-lg">{job.type.replace('_', ' ')}</h3>
                                                <span className="text-xs font-mono text-gray-500">#{job.id}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(job.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1 pl-16 md:pl-0">
                                        <span className={clsx(
                                            "text-xl font-bold font-mono",
                                            job.status === 'COMPLETED' ? "text-white" : "text-gray-600 line-through"
                                        )}>
                                            ₹{job.amount}
                                        </span>
                                        <span className={clsx(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                                            job.status === 'COMPLETED' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                        )}>
                                            {job.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </main>
            </div>
        </AuthGuard>
    );
}
