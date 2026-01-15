'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import {
    MapPin, Clock, ArrowRight, CheckCircle, Smartphone, User, Power,
    DollarSign, Activity, Navigation, Shield, Wallet
} from 'lucide-react';
import { clsx } from 'clsx';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';

interface ServiceRequest {
    id: number;
    service_type: string;
    status: string;
    created_at: string;
    customer_notes?: string;
    provider_id: number | null;
    priority: string;
}

export default function ProviderDashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [activeJobs, setActiveJobs] = useState<ServiceRequest[]>([]);
    const [availableJobs, setAvailableJobs] = useState<ServiceRequest[]>([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem('provider_access_token')) {
            router.push('/login');
            return;
        }
        fetchJobs();
    }, [router]);

    const fetchJobs = async () => {
        // DEMO BYPASS: Check for demo token
        const token = localStorage.getItem('provider_access_token');
        if (token === 'demo-access-token-verified') {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            // Mock data consistent with "Mission Control" UI
            const mockJobs: ServiceRequest[] = [
                {
                    id: 204,
                    service_type: 'FUEL_DELIVERY',
                    status: 'PENDING',
                    created_at: new Date().toISOString(),
                    customer_notes: 'Ran out of petrol on highway',
                    provider_id: null,
                    priority: 'HIGH'
                },
                {
                    id: 205,
                    service_type: 'TIRE_CHANGE',
                    status: 'PENDING',
                    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                    customer_notes: 'Flat tire, need spare change',
                    provider_id: null,
                    priority: 'NORMAL'
                }
            ];
            setAvailableJobs(mockJobs);
            // Simulate one active job for demo purposes if needed, else empty
            setActiveJobs([{
                id: 199,
                service_type: 'TOW_SERVICE',
                status: 'IN_PROGRESS',
                created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
                customer_notes: 'Engine overheat, need tow to garage',
                provider_id: 123,
                priority: 'CRITICAL'
            }]);
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.get('/admin/bookings/');
            const allRequests: ServiceRequest[] = response.data;
            setAvailableJobs(allRequests.filter(r => r.status === 'PENDING'));
            setActiveJobs(allRequests.filter(r => r.status === 'DISPATCHED' || r.status === 'IN_PROGRESS'));
        } catch (error) {
            console.error('Failed to fetch jobs', error);
            // Fallback to empty state instead of crashing/redirecting
            setAvailableJobs([]);
            setActiveJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const acceptJob = async (id: number) => {
        try {
            await apiClient.post(`/provider/update/${id}/`, {
                status: 'DISPATCHED'
            });
            fetchJobs();
        } catch (err) {
            console.error("Failed to accept job", err);
            alert("Could not accept job. It might be taken.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pt-24">

                {/* Mission Control Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                            Mission Control
                        </h1>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            System Operational
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl p-2 pr-6 backdrop-blur-md">
                        <button
                            onClick={() => setIsAvailable(!isAvailable)}
                            className={clsx(
                                "flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-sm shadow-lg",
                                isAvailable
                                    ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-green-900/20"
                                    : "bg-red-500/20 text-red-400 border border-red-500/50 shadow-red-900/20"
                            )}
                        >
                            <Power className="w-5 h-5" />
                            {isAvailable ? "Online" : "Offline"}
                        </button>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500 font-medium">STATUS</p>
                            <p className="text-sm font-mono text-white tracking-widest">{isAvailable ? 'RECEIVING JOBS' : 'UNAVAILABLE'}</p>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/earnings" className="block">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wallet className="w-24 h-24" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Today's Earnings</p>
                            <h3 className="text-4xl font-bold text-white mt-2">₹ 2,450</h3>
                            <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-mono">
                                <Activity className="w-3 h-3" /> +12% from yesterday
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle className="w-24 h-24" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Jobs Completed</p>
                        <h3 className="text-4xl font-bold text-white mt-2">4</h3>
                        <div className="mt-4 flex items-center gap-2 text-purple-400 text-xs font-mono">
                            Target: 8 jobs
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield className="w-24 h-24" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Rating</p>
                        <h3 className="text-4xl font-bold text-white mt-2">4.9</h3>
                        <div className="flex gap-1 mt-4">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-1 bg-yellow-500 rounded-full opacity-80" />)}
                        </div>
                    </div>
                </div>

                {/* Active Mission */}
                {activeJobs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-1 overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)]"
                    >
                        <div className="bg-black/40 backdrop-blur-xl rounded-[1.4rem] p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                    <h2 className="text-xl font-bold text-white tracking-wide">ACTIVE MISSION</h2>
                                </div>
                                <span className="px-4 py-1.5 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-bold rounded-full uppercase tracking-widest">
                                    In Progress
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {activeJobs.map(job => (
                                    <div key={job.id} className="space-y-6">
                                        <div>
                                            <p className="text-gray-500 text-xs font-mono uppercase">Service Type</p>
                                            <h3 className="text-2xl font-bold text-white mt-1">{job.service_type.replace('_', ' ')}</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                    <MapPin className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs font-mono uppercase">Destination</p>
                                                    <p className="text-white mt-1">Downloading coordinates...</p>
                                                    <button className="text-sm text-purple-400 hover:text-purple-300 mt-1 flex items-center gap-1">
                                                        <Navigation className="w-3 h-3" /> Open Navigation
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/job/${job.id}`}
                                            className="block w-full text-center bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
                                        >
                                            Manage Mission
                                        </Link>
                                    </div>
                                ))}
                                <div className="hidden md:block bg-black rounded-2xl min-h-[200px] border border-white/5 relative overflow-hidden group">
                                    {/* Map Background */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                                        style={{ backgroundImage: 'url("/assets/dark_map_bg.png")' }}
                                    ></div>

                                    {/* Map UI Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                                    {/* Provider Marker */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <div className="relative">
                                            <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white z-10 relative shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                                            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75"></div>
                                        </div>
                                    </div>

                                    {/* Destination Marker */}
                                    <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <div className="relative">
                                            <MapPin className="text-red-500 w-8 h-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-bounce" />
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-red-500/50 blur-sm rounded-full"></div>
                                        </div>
                                        <div className="px-2 py-1 bg-black/80 backdrop-blur text-[10px] text-white rounded border border-white/10 mt-1">
                                            Incident Loc
                                        </div>
                                    </div>

                                    {/* Route Line Simulation */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                                        <path d="M 300 150 Q 350 100 450 80" stroke="#a855f7" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse" />
                                    </svg>

                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-green-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        LIVE VIEW
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Dispatch Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold text-white">Dispatch Feed</h2>
                        <span className="text-xs font-mono text-gray-500">{availableJobs.length} SIGNALS DETECTED</span>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="p-12 text-center text-gray-600 font-mono animate-pulse">Scanning frequencies...</div>
                        ) : availableJobs.length === 0 ? (
                            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
                                <Activity className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500">No distress signals detected in your sector.</p>
                            </div>
                        ) : (
                            availableJobs.map((job) => (
                                <div key={job.id} className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                                <Smartphone className="text-indigo-400 w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-bold text-white">{job.service_type.replace('_', ' ')}</h3>
                                                    <span className={clsx("px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider rounded border",
                                                        job.priority === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                                    )}>
                                                        {job.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> {new Date(job.created_at).toLocaleTimeString()}
                                                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                                    <span className="font-mono text-xs">ID: #{job.id}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => acceptJob(job.id)}
                                            className="px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-transform active:scale-95 shadow-lg shadow-white/5 whitespace-nowrap"
                                        >
                                            Accept Mission
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
