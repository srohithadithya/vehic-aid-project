'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { clsx } from 'clsx';
import { CheckCircle2, Clock, MapPin, Loader2, ArrowLeft, MessageSquare, CreditCard } from 'lucide-react';
import { Chat } from '@/components/Chat';
import { NotificationContainer, useNotifications } from '@/components/Notifications';

interface ServiceRequest {
    id: number;
    service_type: string;
    status: string;
    provider_id: number | null;
    created_at: string;
    provider_location?: any;
}

function FareBreakup({ id, onAccept }: { id: string; onAccept: () => void }) {
    const [quote, setQuote] = useState<any>(null);

    useEffect(() => {
        const fetch = async () => {
            const res = await apiClient.get(`/quotes/?request_id=${id}`);
            setQuote(res.data.find((q: any) => q.is_final));
        };
        fetch();
    }, [id]);

    if (!quote) return null;

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl ring-1 ring-blue-600/20 space-y-4 border-l-4 border-blue-600">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Final Fare Review
            </h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Service Base Charge</span>
                    <span className="font-bold">₹{quote.base_price}</span>
                </div>
                {quote.spare_parts_details?.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-400 capitalize">{p.name.replace(/_/g, ' ')}</span>
                        <span className="text-gray-600 font-medium">₹{p.price}</span>
                    </div>
                ))}
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-black/20 rounded-lg">
                    <span className="text-gray-500">Platform Fee & Taxes</span>
                    <span className="font-bold">₹{(parseFloat(quote.platform_fee) + parseFloat(quote.tax_amount)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2 border-t dark:border-white/10">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{quote.dynamic_total}</span>
                </div>
            </div>
            <button
                onClick={onAccept}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
            >
                Approve & Pay ₹{quote.dynamic_total}
            </button>
        </div>
    );
}

function RequestStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'status' | 'chat'>('status');
    const socketRef = useRef<WebSocket | null>(null);
    const { notifications, removeNotification, success, info, warning } = useNotifications();

    const fetchRequestDetails = useCallback(async () => {
        if (!id) return;
        try {
            const response = await apiClient.get(`/request/${id}/`);
            setRequest(response.data);
        } catch (error) {
            console.error("Error fetching request", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        fetchRequestDetails();

        // Setup WebSocket for real-time updates
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // Extract host from API URL or use window.location if API URL is relative/missing host
        let wsHost = 'localhost:8001';
        try {
            const url = new URL(apiUrl);
            wsHost = url.host;
        } catch (e) {
            // fallback if NEXT_PUBLIC_API_URL is just a path or invalid
            console.warn("Invalid API URL for WS, falling back to localhost", e);
        }

        const wsUrl = `${wsProtocol}//${wsHost}/ws/service/${id}/`;

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket Connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("WS Message:", data);

            if (data.status) {
                setRequest(prev => {
                    const oldStatus = prev?.status;
                    if (oldStatus !== data.status) {
                        if (data.status === 'DISPATCHED') {
                            success('Provider Assigned!', 'A service provider is on the way to your location.');
                        } else if (data.status === 'IN_PROGRESS') {
                            info('Service Started', 'The provider has started working on your vehicle.');
                        } else if (data.status === 'COMPLETED') {
                            success('Service Completed', 'Your service has been completed successfully!');
                        }
                    }
                    return prev ? { ...prev, status: data.status } : null;
                });
            }
            if (data.type === 'status_update' && data.message === 'location') {
                console.log("Provider Location:", data.latitude, data.longitude);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.readyState === 1) ws.close();
        };
    }, [id, fetchRequestDetails, success, info]);

    const handleAcceptFinalFare = async () => {
        try {
            const quotesRes = await apiClient.get(`/quotes/?request_id=${id}`);
            const quote = quotesRes.data.find((q: any) => q.is_final);
            if (!quote) return;

            await apiClient.post(`/quotes/${quote.id}/accept/`);
            success("Payment Successful", "Your service is complete. Thank you!");
            fetchRequestDetails();
        } catch (error) {
            console.error("Accept failed", error);
            warning("Payment Failed", "Please try again.");
        }
    };

    if (!id) return <div className="p-8 text-center text-red-500">No request ID provided.</div>;
    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
    if (!request) return <div className="p-8 text-center text-red-500">Request not found.</div>;

    const steps = [
        { id: 'PENDING_DISPATCH', label: 'Request Received' },
        { id: 'DISPATCHED', label: 'Provider Dispatched' },
        { id: 'ARRIVED', label: 'Provider Arrived' },
        { id: 'SERVICE_IN_PROGRESS', label: 'Service In Progress' },
        { id: 'FINAL_FARE_PENDING', label: 'Review Final Fare' },
        { id: 'COMPLETED', label: 'Service Completed' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === request.status);
    const isCancelled = request.status === 'CANCELLED';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <NotificationContainer notifications={notifications} onClose={removeNotification} />

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Request #{request.id}</h1>
                        <p className="text-gray-500 text-sm">Service: {request.service_type.replace('_', ' ')}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-zinc-800">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('status')}
                                className={clsx(
                                    'flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors',
                                    activeTab === 'status'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                )}
                            >
                                <Clock className="w-4 h-4 inline mr-2" />
                                Status
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={clsx(
                                    'flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors',
                                    activeTab === 'chat'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                )}
                            >
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Chat
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'status' ? (
                            <div className="space-y-8">
                                {/* Status Tracker */}
                                {isCancelled ? (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                                            <span className="text-2xl font-bold">X</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Cancelled</h2>
                                        <p className="text-gray-500 mt-2">This service request has been cancelled.</p>
                                    </div>
                                ) : (
                                    <nav aria-label="Progress">
                                        <ol role="list" className="overflow-hidden">
                                            {steps.map((step, stepIdx) => {
                                                const isComplete = currentStepIndex > stepIdx;
                                                const isCurrent = currentStepIndex === stepIdx;

                                                return (
                                                    <li key={step.id} className={clsx(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
                                                        {stepIdx !== steps.length - 1 ? (
                                                            <div className={clsx(
                                                                "absolute top-4 left-4 -ml-px h-full w-0.5",
                                                                isComplete ? "bg-blue-600" : "bg-gray-200 dark:bg-zinc-700"
                                                            )} aria-hidden="true" />
                                                        ) : null}
                                                        <div className="group relative flex items-start">
                                                            <span className="flex h-9 items-center">
                                                                <span className={clsx(
                                                                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                                                                    isComplete ? "border-blue-600 bg-blue-600" :
                                                                        isCurrent ? "border-blue-600 bg-white dark:bg-zinc-900" : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                                                )}>
                                                                    {isComplete ? (
                                                                        <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                                                                    ) : isCurrent ? (
                                                                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                                                                    ) : null}
                                                                </span>
                                                            </span>
                                                            <span className="ml-4 flex min-w-0 flex-col">
                                                                <span className={clsx("text-sm font-medium", isCurrent ? "text-blue-600" : "text-gray-500 dark:text-zinc-400")}>{step.label}</span>
                                                            </span>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ol>
                                    </nav>
                                )}

                                {request.status === 'FINAL_FARE_PENDING' && (
                                    <FareBreakup id={id} onAccept={handleAcceptFinalFare} />
                                )}

                                {/* Map Placeholder */}
                                <div className="bg-gray-200 dark:bg-zinc-800 h-64 rounded-xl flex items-center justify-center text-gray-500 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                    <div className="z-10 text-center">
                                        <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p>Live Map View</p>
                                        <p className="text-xs">(Provider location updates will appear here)</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Chat requestId={parseInt(id)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RequestStatusPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>}>
            <RequestStatusContent />
        </Suspense>
    );
}
