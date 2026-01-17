'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Clock, Star, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        completedJobs: 0,
        avgRating: 0,
        avgResponseTime: 0,
        weeklyEarnings: [],
        topServices: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/providers/analytics/`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Analytics & Performance</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Earnings</p>
                            <p className="text-3xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
                            <p className="text-xs opacity-75 mt-1">+12% from last month</p>
                        </div>
                        <DollarSign className="w-12 h-12 opacity-50" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Completed Jobs</p>
                            <p className="text-3xl font-bold">{stats.completedJobs}</p>
                            <p className="text-xs opacity-75 mt-1">+8% from last month</p>
                        </div>
                        <Calendar className="w-12 h-12 opacity-50" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Average Rating</p>
                            <p className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</p>
                            <p className="text-xs opacity-75 mt-1">⭐⭐⭐⭐⭐</p>
                        </div>
                        <Star className="w-12 h-12 opacity-50" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Avg Response Time</p>
                            <p className="text-3xl font-bold">{stats.avgResponseTime} min</p>
                            <p className="text-xs opacity-75 mt-1">-5% from last month</p>
                        </div>
                        <Clock className="w-12 h-12 opacity-50" />
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Earnings Chart */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Weekly Earnings</h2>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                            <div key={day} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                                    style={{ height: `${Math.random() * 100}%` }}
                                />
                                <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">{day}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Top Services */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Top Services</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Towing', count: 45, percentage: 35 },
                            { name: 'Flat Tire', count: 38, percentage: 30 },
                            { name: 'Battery Jump', count: 25, percentage: 20 },
                            { name: 'Fuel Delivery', count: 19, percentage: 15 },
                        ].map((service) => (
                            <div key={service.name}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{service.name}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {service.count} jobs
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${service.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">98%</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Acceptance Rate</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600">95%</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Completion Rate</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600">4.8</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Customer Satisfaction</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
