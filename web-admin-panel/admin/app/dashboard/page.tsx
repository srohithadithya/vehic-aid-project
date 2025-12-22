'use client';

import { useEffect, useState } from 'react';
import { Users, Wrench, DollarSign, TrendingUp, Clock, CheckCircle, Activity as ActivityIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
    total_users: number;
    total_customers: number;
    total_providers: number;
    total_bookings: number;
    pending_bookings: number;
    completed_bookings: number;
    total_revenue: number;
    active_providers: number;
}

interface Activity {
    id: number;
    type: string;
    description: string;
    customer: string;
    status: string;
    created_at: string;
}

const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042'];

// Mock data for visualizations (since backend historical aggregation is limited in MVP)
const revenueData = [
    { name: 'Jan', total: 4000 },
    { name: 'Feb', total: 3000 },
    { name: 'Mar', total: 2000 },
    { name: 'Apr', total: 2780 },
    { name: 'May', total: 1890 },
    { name: 'Jun', total: 2390 },
    { name: 'Jul', total: 3490 },
];

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                // Fetch dashboard stats from backend
                const statsResponse = await fetch(`${API_URL}/services/admin/dashboard-stats/`);
                if (!statsResponse.ok) throw new Error('Failed to fetch stats');
                const statsData = await statsResponse.json();

                // Map backend response structure to DashboardStats interface
                // The backend returns nested objects: bookings, providers, financials
                const flatStats = {
                    total_users: statsData.bookings.total + statsData.providers.total, // approx
                    total_customers: statsData.bookings.total, // using bookings as proxy for now or 0
                    total_providers: statsData.providers.total,
                    total_bookings: statsData.bookings.total,
                    pending_bookings: statsData.bookings.active,
                    completed_bookings: statsData.bookings.completed_today, // Showing today's completions
                    total_revenue: statsData.financials.total_revenue,
                    active_providers: statsData.providers.online
                };

                setStats(flatStats);
                setActivity(statsData.recent_activity || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Unable to connect to backend.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) return <div className="p-8 text-primary">Loading Command Center...</div>;

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats?.total_revenue.toLocaleString() || '0'}`,
            icon: DollarSign,
            description: 'Lifetime earnings',
            change: '+12.5%',
            color: 'text-emerald-400'
        },
        {
            title: 'Active Bookings',
            value: stats?.pending_bookings.toLocaleString() || '0',
            icon: Wrench,
            description: 'Currently in progress',
            change: '+2',
            color: 'text-blue-400'
        },
        {
            title: 'Online Providers',
            value: stats?.active_providers.toLocaleString() || '0',
            icon: Users,
            description: 'Ready for dispatch',
            change: 'Stable',
            color: 'text-purple-400'
        },
        {
            title: 'Total Bookings',
            value: stats?.total_bookings.toLocaleString() || '0',
            icon: TrendingUp,
            description: 'All time requests',
            change: '+5%',
            color: 'text-orange-400'
        },
    ];

    return (
        <motion.div
            className="p-8 space-y-8 min-h-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-between items-center bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Command Center
                    </h2>
                    <p className="text-muted-foreground mt-1">Real-time operational overview.</p>
                </div>
                <Button className="glass bg-primary/20 hover:bg-primary/40 text-primary-foreground border-primary/50">
                    <ActivityIcon className="mr-2 h-4 w-4" /> System Healthy
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => (
                    <motion.div key={card.title} variants={itemVariants}>
                        <Card className="glass-card overflow-hidden relative">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 ${card.color}`}>
                                <card.icon className="w-24 h-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-foreground">{card.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {card.description} <span className={`${card.color} ml-1`}>{card.change}</span>
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Visualizations */}
            <div className="grid gap-6 md:grid-cols-7">
                <motion.div className="col-span-4" variants={itemVariants}>
                    <Card className="glass-card h-full">
                        <CardHeader>
                            <CardTitle>Revenue Velocity</CardTitle>
                            <CardDescription>6 Month trend analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" stroke="#888888" />
                                        <YAxis stroke="#888888" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                            itemStyle={{ color: '#f3f4f6' }}
                                        />
                                        <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div className="col-span-3" variants={itemVariants}>
                    <Card className="glass-card h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Live stream of actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {activity.map((item, i) => (
                                    <div key={i} className="flex items-center space-x-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                                            {item.status === 'COMPLETED' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none text-foreground">{item.description}</p>
                                            <p className="text-xs text-muted-foreground">{item.customer}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(item.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                                {activity.length === 0 && <p className="text-sm text-muted-foreground">No recent activity</p>}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

