'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { MapPin, Clock, ArrowRight, CheckCircle, Smartphone, User } from 'lucide-react';
import { clsx } from 'clsx';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

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
        try {
            const response = await apiClient.get('/admin/bookings/');
            const allRequests: ServiceRequest[] = response.data;
            setAvailableJobs(allRequests.filter(r => r.status === 'PENDING'));
            setActiveJobs(allRequests.filter(r => r.status === 'DISPATCHED' || r.status === 'IN_PROGRESS'));
        } catch (error) {
            console.error('Failed to fetch jobs', error);
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
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <Navbar />
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('portal.title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{t('portal.subtitle')}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={clsx("text-sm font-medium", isAvailable ? "text-green-600" : "text-gray-500")}>
                            {isAvailable ? t('portal.online') : t('portal.offline')}
                        </span>
                        <button
                            onClick={() => setIsAvailable(!isAvailable)}
                            className={clsx(
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2",
                                isAvailable ? 'bg-green-600' : 'bg-gray-200'
                            )}
                        >
                            <span className={clsx(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                isAvailable ? 'translate-x-5' : 'translate-x-0'
                            )} />
                        </button>
                    </div>
                </div>

                {/* Active Jobs */}
                {activeJobs.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('portal.active_jobs')}</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {activeJobs.map(job => (
                                <div key={job.id} className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-l-4 border-l-purple-500 border-gray-200 dark:border-zinc-800 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-700/10">
                                            {job.status}
                                        </span>
                                        <span className="text-xs text-gray-400">#{job.id}</span>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{job.service_type}</h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-3">
                                        <MapPin className="w-4 h-4 mr-1" /> View Map Location
                                    </div>
                                    <Link
                                        href={`/job/${job.id}`}
                                        className="block w-full text-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                                    >
                                        {t('portal.manage')}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Requests */}
                <div className="bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 rounded-xl overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-white/10 px-4 py-4 sm:px-6 flex justify-between items-center">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">{t('portal.new_requests')}</h3>
                        <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium">{availableJobs.length} available</span>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading jobs...</div>
                    ) : availableJobs.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {t('portal.no_jobs')}
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-100 dark:divide-white/5">
                            {availableJobs.map((job) => (
                                <li key={job.id} className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 sm:px-6 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                                            {job.service_type.replace('_', ' ')}
                                            <span className="ml-2 inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
                                                {job.priority}
                                            </span>
                                        </p>
                                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                            <p className="truncate">Customer Details Hidden</p>
                                            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current"><circle cx={1} cy={1} r={1} /></svg>
                                            <p><time dateTime={job.created_at}>{new Date(job.created_at).toLocaleTimeString()}</time></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-none items-center gap-x-4">
                                        <button
                                            onClick={() => acceptJob(job.id)}
                                            className="rounded-md bg-white dark:bg-zinc-800 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 hover:text-green-600 hover:ring-green-600 transition-all"
                                        >
                                            {t('portal.accept')}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}
