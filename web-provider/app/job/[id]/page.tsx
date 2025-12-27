'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { MapPin, Phone, User, CheckCircle, Navigation, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

interface ServiceRequest {
    id: number;
    service_type: string;
    status: string;
    customer: string;
    customer_notes?: string;
    created_at: string;
    latitude: number;
    longitude: number;
}

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [job, setJob] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            // NOTE: Using Admin endpoint as proxy since Provider specific endpoint was not fully built
            // In prod, this should be /api/v1/provider/jobs/{id}/
            const response = await apiClient.get('/admin/bookings/');
            const all: ServiceRequest[] = response.data;
            const found = all.find(r => r.id === parseInt(id));
            if (found) {
                setJob(found);
            } else {
                // fallback if direct access via ID is possible (ServiceRequestView requires booker auth, wait, ProviderStatusUpdateView handles updates but not reading?)
                // We will assume "found" works for now via the list.
            }
        } catch (error) {
            console.error('Failed to fetch job', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            // Endpoint: path('provider/update/<int:request_id>/', ProviderStatusUpdateView...
            await apiClient.post(`/provider/update/${id}/`, {
                status: newStatus
            });

            // Optimistic update
            if (job) setJob({ ...job, status: newStatus });

            if (newStatus === 'COMPLETED') {
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error("Failed to update status", err);
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert("Update failed.");
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading job details...</div>;
    if (!job) return <div className="p-8 text-center text-red-500">Job not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>

                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                                {job.service_type.replace('_', ' ')}
                            </h1>
                            <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-700/10">
                                {job.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">Request #{job.id}</p>
                    </div>

                </div>

                {/* Customer & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 space-y-4">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-400" /> Customer
                        </h2>
                        <div className="pl-7">
                            <p className="font-medium text-gray-900 dark:text-gray-200">{job.customer}</p>
                            {/* Phone would be here in real app */}
                            <button className="text-blue-600 text-sm flex items-center mt-2">
                                <Phone className="w-4 h-4 mr-1" /> Call Customer
                            </button>
                        </div>
                        <div className="border-t pt-4 mt-4 text-sm text-gray-500">
                            <p className="font-medium text-gray-900 dark:text-gray-300 mb-1">Notes:</p>
                            <p>{job.customer_notes || "No notes provided."}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 space-y-4">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-gray-400" /> Location
                        </h2>
                        <div className="bg-gray-100 dark:bg-zinc-800 h-32 rounded-lg flex items-center justify-center text-xs text-gray-500">
                            Map View (Lat: {job.latitude}, Lng: {job.longitude})
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center font-medium transition-colors">
                            <Navigation className="w-4 h-4 mr-2" /> Navigate
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Job Actions</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {job.status === 'DISPATCHED' && (
                            <button
                                onClick={() => updateStatus('IN_PROGRESS')}
                                disabled={updating}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-white py-3 rounded-lg font-bold shadow-sm transition-colors"
                            >
                                Mark as Arrived / In Progress
                            </button>
                        )}

                        {(job.status === 'IN_PROGRESS' || job.status === 'DISPATCHED') && (
                            <button
                                onClick={() => updateStatus('COMPLETED')}
                                disabled={updating}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold shadow-sm flex items-center justify-center transition-colors"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" /> Complete Job
                            </button>
                        )}

                        {job.status === 'COMPLETED' && (
                            <div className="w-full text-center py-2 text-green-600 font-medium bg-green-50 rounded-lg">
                                Job Completed Successfully
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
