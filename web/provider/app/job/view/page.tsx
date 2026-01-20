'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { MapPin, Phone, User, CheckCircle, Navigation, ArrowLeft, MessageSquare } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import Chat from '@/components/Chat';
import SparePartExplorer from '@/components/SparePartExplorer';
import { clsx } from 'clsx';

interface ServiceRequest {
    id: number;
    service_type: string;
    status: string;
    booker_name: string;
    booker_phone: string;
    customer_notes?: string;
    created_at: string;
    latitude: number;
    longitude: number;
}

function JobContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { t } = useLanguage();

    const [job, setJob] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');

    const fetchJobDetails = useCallback(async () => {
        if (!id) return;
        try {
            const response = await apiClient.get(`/provider/jobs/${id}/`);
            setJob(response.data);
        } catch (error) {
            console.error('Failed to fetch job', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const updateLocation = useCallback(async (lat: number, lng: number) => {
        try {
            await apiClient.post('/provider/location-update/', {
                latitude: lat,
                longitude: lng
            });
        } catch (err) {
            console.error("Failed to update location", err);
        }
    }, []);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        fetchJobDetails();
    }, [fetchJobDetails, id]);

    useEffect(() => {
        if (!job || (job.status !== 'DISPATCHED' && job.status !== 'ARRIVED' && job.status !== 'SERVICE_IN_PROGRESS')) return;

        // Initial update
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                updateLocation(pos.coords.latitude, pos.coords.longitude);
            });
        }

        const interval = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    updateLocation(pos.coords.latitude, pos.coords.longitude);
                });
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [job?.status, updateLocation, job]);

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            await apiClient.post(`/provider/update/${id}/`, {
                status: newStatus
            });
            if (job) setJob({ ...job, status: newStatus });
            if (newStatus === 'COMPLETED') {
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error("Failed to update status", err);
            // Even if it fails, try to fetch job again to stay synced
            fetchJobDetails();
        } finally {
            setUpdating(false);
        }
    };

    const handleFinalizeFare = async (parts: any[]) => {
        setUpdating(true);
        try {
            // First, find the quote for this request
            const quotesRes = await apiClient.get(`/quotes/?request_id=${id}`);
            const quoteId = quotesRes.data[0]?.id; // Simple assumption for MVP

            if (!quoteId) {
                alert("No active quote found for this request.");
                return;
            }

            await apiClient.post(`/quotes/${quoteId}/finalize/`, {
                spare_parts: parts,
                platform_fee: 25.00
            });

            alert("Fare finalized! Waiting for user approval.");
            fetchJobDetails();
        } catch (err) {
            console.error("Failed to finalize fare", err);
            alert("Error finalizing fare.");
        } finally {
            setUpdating(false);
        }
    };

    if (!id) return <div className="p-8 text-center text-red-500 font-bold">No Job ID provided.</div>;
    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading job details...</div>;
    if (!job) return <div className="p-8 text-center text-red-500 font-bold">Job not found.</div>;

    const isJobActive = ['DISPATCHED', 'ARRIVED', 'SERVICE_IN_PROGRESS'].includes(job.status);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <Navbar />
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">

                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('job.back')}
                    </Link>

                    <div className="flex bg-white dark:bg-zinc-900 rounded-2xl p-1.5 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/5">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={clsx(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                activeTab === 'details' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                            )}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={clsx(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                                activeTab === 'chat' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                            )}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Chat
                        </button>
                    </div>
                </div>

                {activeTab === 'details' ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Header */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
                                        {job.service_type.replace('_', ' ')}
                                    </h1>
                                    <span className={clsx(
                                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ring-1 ring-inset",
                                        job.status === 'COMPLETED' ? "bg-green-500/10 text-green-500 ring-green-500/20" : "bg-purple-500/10 text-purple-500 ring-purple-500/20"
                                    )}>
                                        {job.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">ID: #{job.id}</span>
                                    <span>•</span>
                                    <span>{new Date(job.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                </div>
                            </div>

                            {isJobActive && (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                        <span className="text-xs font-black text-green-500 uppercase tracking-tighter">Live Support</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500">Updating your location every 30s</p>
                                </div>
                            )}
                        </div>

                        {/* Customer & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 space-y-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    {t('job.customer')}
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                                        <p className="font-bold text-gray-900 dark:text-gray-200 text-lg">{job.booker_name}</p>
                                        <p className="text-gray-500 font-medium">{job.booker_phone}</p>
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]">
                                        <Phone className="w-5 h-5" /> {t('job.call')}
                                    </button>
                                </div>
                                <div className="pt-6 border-t dark:border-white/10">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('job.notes')}</p>
                                    <p className="text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">&quot;{job.customer_notes || t('job.no_notes')}&quot;</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 space-y-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                    </div>
                                    {t('job.location')}
                                </h2>
                                <div className="relative aspect-video bg-gray-100 dark:bg-zinc-800 rounded-2xl flex flex-col items-center justify-center text-[10px] text-gray-500 border-2 border-dashed dark:border-white/5 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
                                    <MapPin className="w-10 h-10 mb-2 text-blue-500/20 animate-bounce" />
                                    <span className="font-black text-gray-400">Lat: {job.latitude}</span>
                                    <span className="font-black text-gray-400">Lng: {job.longitude}</span>
                                </div>
                                <button
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`)}
                                    className="w-full bg-zinc-900 dark:bg-white dark:text-black text-white py-4 rounded-2xl flex items-center justify-center font-bold tracking-tight transition-all active:scale-[0.98] shadow-xl"
                                >
                                    <Navigation className="w-5 h-5 mr-3" /> {t('job.navigate')}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-gray-400" />
                                </div>
                                {t('job.actions')}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {job.status === 'DISPATCHED' && (
                                    <button
                                        onClick={() => updateStatus('ARRIVED')}
                                        disabled={updating}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Mark as Arrived
                                    </button>
                                )}

                                {job.status === 'ARRIVED' && (
                                    <button
                                        onClick={() => updateStatus('SERVICE_IN_PROGRESS')}
                                        disabled={updating}
                                        className="bg-orange-500 hover:bg-orange-400 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Start Service
                                    </button>
                                )}

                                {job.status === 'SERVICE_IN_PROGRESS' && (
                                    <div className="sm:col-span-2 space-y-6">
                                        <SparePartExplorer requestId={job.id} onFinalize={handleFinalizeFare} />
                                    </div>
                                )}

                                {job.status === 'FINAL_FARE_PENDING' && (
                                    <div className="sm:col-span-2 w-full text-center py-6 text-blue-600 font-black uppercase tracking-widest bg-blue-500/10 rounded-2xl border-2 border-blue-500/20 animate-pulse">
                                        Awaiting User Approval of Final Fare
                                    </div>
                                )}

                                {job.status === 'COMPLETED' && (
                                    <div className="sm:col-span-2 w-full text-center py-6 text-green-600 font-black uppercase tracking-widest bg-green-500/10 rounded-2xl border-2 border-green-500/20">
                                        {t('job.completed_success')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right-10 duration-500">
                        <Chat requestId={job.id} />
                    </div>
                )}

            </div>
        </div>
    );
}

export default function JobPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 animate-pulse">Loading job...</div>}>
            <JobContent />
        </Suspense>
    );
}
