'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, FileText, Download } from 'lucide-react';
import Link from 'next/link';

export default function ServiceHistoryPage() {
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all'); // all, completed, cancelled

    const fetchHistory = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/service-requests/?status=${filter}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.ok) {
                const data = await response.json();
                setHistory(data.results || []);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    }, [filter]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const getStatusColor = (status: string) => {
        const colors: any = {
            'COMPLETED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800',
            'IN_PROGRESS': 'bg-blue-100 text-blue-800',
            'PENDING': 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Service History</h1>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        size="sm"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilter('completed')}
                        size="sm"
                    >
                        Completed
                    </Button>
                    <Button
                        variant={filter === 'cancelled' ? 'default' : 'outline'}
                        onClick={() => setFilter('cancelled')}
                        size="sm"
                    >
                        Cancelled
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <p className="text-sm opacity-90">Total Services</p>
                    <p className="text-3xl font-bold">{history.length}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <p className="text-sm opacity-90">Total Spent</p>
                    <p className="text-3xl font-bold">₹12,450</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <p className="text-sm opacity-90">Avg Rating Given</p>
                    <p className="text-3xl font-bold">4.5 ⭐</p>
                </Card>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {history.map((service: any) => (
                    <Card key={service.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold">Request #{service.id}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                        {service.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(service.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span>{service.service_type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{service.location || 'Location not specified'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        <span>₹{service.total_amount || 'N/A'}</span>
                                    </div>
                                </div>

                                {service.provider && (
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm font-medium">Provider: {service.provider.name}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Rating: {service.provider_rating || 'Not rated'} ⭐
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Link href={`/request/${service.id}`}>
                                    <Button variant="outline" size="sm" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                                {service.invoice_id && (
                                    <Link href={`/invoice/${service.invoice_id}`}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Download className="w-4 h-4 mr-2" />
                                            Invoice
                                        </Button>
                                    </Link>
                                )}
                                {service.status === 'COMPLETED' && !service.provider_rating && (
                                    <Button size="sm" className="w-full">
                                        Rate Service
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {history.length === 0 && (
                <Card className="p-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No service history</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Your service requests will appear here
                    </p>
                    <Link href="/book">
                        <Button>Book Your First Service</Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}
