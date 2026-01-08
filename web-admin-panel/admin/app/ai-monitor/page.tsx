'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { Bot, Sparkles, TrendingUp, ThumbsUp, MessageSquare, Brain, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AIStats {
    total_sessions: number;
    auto_booking_rate: number;
    triage_accuracy: number;
    triage_data: any[];
    load_data: any[];
}

export default function AIMonitorPage() {
    const [stats, setStats] = useState<AIStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/services/admin/ai-stats/');
                setStats(res.data);
            } catch (err) {
                console.error("AI Stats fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-primary">Loading Neural Networks...</div>;
    if (!stats) return <div className="p-8 text-destructive">Failed to load AI systems.</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-2xl">
                        <Bot className="text-primary" size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">AI Insights Monitor</h2>
                        <p className="text-muted-foreground">Conversational triage analytics and machine learning health.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        <Sparkles size={12} className="mr-1" /> Model: vehicaid-triage-v2
                    </Badge>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Daily AI Sessions</CardTitle>
                        <MessageSquare className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_sessions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">+18% from yesterday</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Auto-Booking Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.auto_booking_rate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Users following AI suggestions</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Triage Accuracy</CardTitle>
                        <ThumbsUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.triage_accuracy}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Validated by human dispatchers</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Triage Accuracy Chart */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain size={18} className="text-purple-400" />
                            Accuracy by Category
                        </CardTitle>
                        <CardDescription>How well the AI classifies specific issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.triage_data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="#888888" />
                                    <YAxis stroke="#888888" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                        itemStyle={{ color: '#f3f4f6' }}
                                    />
                                    <Bar dataKey="accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Session Load Chart */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity size={18} className="text-blue-400" />
                            AI Request Load
                        </CardTitle>
                        <CardDescription>Real-time assistant usage over 24h</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.load_data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="time" stroke="#888888" />
                                    <YAxis stroke="#888888" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                        itemStyle={{ color: '#f3f4f6' }}
                                    />
                                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

