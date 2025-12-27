'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { MapPin, Clock, ArrowRight, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ServiceRequest {
    id: number;
    service_type: string;
    status: string;
    created_at: string;
    priority: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check auth
        if (!localStorage.getItem('customer_access_token')) {
            router.push('/login');
            return;
        }
        fetchRequests();
    }, [router]);

    const fetchRequests = async () => {
        try {
            const response = await apiClient.get('/request/');
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            // Optional: Handle 401 via interceptor redirect, or show toast
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'DISPATCHED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400">Welcome back, Traveler.</p>
                    </div>
                    <Link
                        href="/book"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Request Assistance
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 rounded-xl overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-white/10 px-4 py-4 sm:px-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Recent Activity</h3>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 dark:text-zinc-600 mb-3">
                                <MapPin className="w-12 h-12 mx-auto opacity-50" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">No service requests found.</p>
                            <Link href="/book" className="text-blue-600 hover:underline mt-2 inline-block">Book your first service</Link>
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-100 dark:divide-white/5">
                            {requests.map((request) => (
                                <li key={request.id} className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 sm:px-6 transition-colors">
                                    <div className="min-w-0">
                                        <div className="flex items-start gap-x-3">
                                            <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white capitalize">
                                                {request.service_type.replace('_', ' ').toLowerCase()}
                                            </p>
                                            <span className={clsx(
                                                getStatusColor(request.status),
                                                "rounded-md whitespace-nowrap px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-opacity-20"
                                            )}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <p>
                                                Requested on <time dateTime={request.created_at}>{new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}</time>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-none items-center gap-x-4">
                                        <Link
                                            href={`/request/${request.id}`}
                                            className="hidden rounded-md bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 sm:block"
                                        >
                                            View status
                                        </Link>
                                        <ArrowRight className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
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
