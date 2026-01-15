'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Job {
    id: number;
    amount: string;
    status: string;
    created_at: string;
}

interface WeeklyStat {
    day: string;
    amount: number;
}

interface StatsState {
    total_earnings: number;
    weekly_breakdown: WeeklyStat[];
    payouts: Job[];
}

export default function EarningsPage() {
    const [stats, setStats] = useState<StatsState>({ total_earnings: 0, weekly_breakdown: [], payouts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                // Fetch real stats from backend
                const response = await apiClient.get('/services/provider/jobs/');
                // Calculate local stats from job history
                const jobs: Job[] = response.data.filter((j: Job) => j.status === 'COMPLETED');
                const total = jobs.reduce((sum: number, j: Job) => sum + (parseFloat(j.amount) || 0), 0);

                // Group by day for the last 7 days
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0];
                });

                const breakdown: WeeklyStat[] = last7Days.map(dateStr => {
                    const dayJobs = jobs.filter(j => j.created_at.startsWith(dateStr));
                    const dayTotal = dayJobs.reduce((sum, j) => sum + (parseFloat(j.amount) || 0), 0);
                    const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
                    return { day: dayName, amount: dayTotal };
                });

                setStats({
                    total_earnings: total,
                    weekly_breakdown: breakdown,
                    payouts: jobs.slice(0, 5) // Last 5 completed jobs
                });
            } catch (e) {
                console.error("Failed to fetch earnings", e);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    const maxAmount = stats.weekly_breakdown.length > 0
        ? Math.max(...stats.weekly_breakdown.map(d => d.amount)) || 1
        : 1;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Earnings</h2>
                    <p className="text-muted-foreground">Track your revenue and payouts</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-primary-foreground/70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.total_earnings.toLocaleString()}</div>
                        <p className="text-xs text-primary-foreground/70 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Placeholder Cards for Future Stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.payouts.length}</div>
                        <p className="text-xs text-muted-foreground">in current period</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Weekly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-end justify-between px-4 gap-2">
                            {stats.weekly_breakdown.map((item, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 group">
                                    <div
                                        className="w-full bg-primary/20 rounded-t-md hover:bg-primary/40 transition-all relative group-hover:shadow-lg"
                                        style={{ height: `${Math.max((item.amount / maxAmount) * 100, 5)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ₹{item.amount}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground mt-2 font-medium">{item.day}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Payouts</CardTitle>
                        <CardDescription>
                            Latest completed services
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.payouts.map((job, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                            <ArrowUpRight className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">Service Payment</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-green-600">
                                        +₹{job.amount || 0}
                                    </div>
                                </div>
                            ))}
                            {stats.payouts.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent payouts found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
