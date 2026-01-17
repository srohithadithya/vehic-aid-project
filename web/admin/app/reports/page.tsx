'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const reports = [
        { id: 'revenue', name: 'Revenue Report', icon: TrendingUp, color: 'bg-green-500' },
        { id: 'bookings', name: 'Bookings Report', icon: Calendar, color: 'bg-blue-500' },
        { id: 'providers', name: 'Provider Performance', icon: FileText, color: 'bg-purple-500' },
        { id: 'customers', name: 'Customer Analytics', icon: FileText, color: 'bg-orange-500' },
    ];

    const exportReport = async (reportId: string, format: 'csv' | 'pdf' | 'excel') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/export/?format=${format}&start=${dateRange.start}&end=${dateRange.end}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${reportId}_report.${format}`;
                a.click();
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            </div>

            {/* Date Range Filter */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Date Range</h2>
                <div className="flex gap-4">
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                    <span className="self-center">to</span>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                </div>
            </Card>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report) => (
                    <Card key={report.id} className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`${report.color} p-3 rounded-lg`}>
                                <report.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">{report.name}</h3>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => exportReport(report.id, 'csv')}
                                disabled={loading}
                                variant="outline"
                                size="sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                CSV
                            </Button>
                            <Button
                                onClick={() => exportReport(report.id, 'pdf')}
                                disabled={loading}
                                variant="outline"
                                size="sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                            </Button>
                            <Button
                                onClick={() => exportReport(report.id, 'excel')}
                                disabled={loading}
                                variant="outline"
                                size="sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Excel
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Stats */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                        <p className="text-sm opacity-90">Total Revenue</p>
                        <p className="text-2xl font-bold">₹1,24,500</p>
                        <p className="text-xs opacity-75">+12% from last month</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
                        <p className="text-sm opacity-90">Total Bookings</p>
                        <p className="text-2xl font-bold">1,234</p>
                        <p className="text-xs opacity-75">+8% from last month</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                        <p className="text-sm opacity-90">Active Providers</p>
                        <p className="text-2xl font-bold">156</p>
                        <p className="text-xs opacity-75">+5% from last month</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                        <p className="text-sm opacity-90">Active Customers</p>
                        <p className="text-2xl font-bold">2,345</p>
                        <p className="text-xs opacity-75">+15% from last month</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
