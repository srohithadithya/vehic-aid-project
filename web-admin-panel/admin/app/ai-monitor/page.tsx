'use client';

import { Bot, Sparkles, TrendingUp, ThumbsUp, MessageSquare, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const triageData = [
    { name: 'Mechanical', count: 450, accuracy: 94 },
    { name: 'Towing', count: 320, accuracy: 98 },
    { name: 'Battery', count: 280, accuracy: 92 },
    { name: 'Fuel', count: 120, accuracy: 100 },
];

const loadData = [
    { time: '08:00', requests: 12 },
    { time: '10:00', requests: 45 },
    { time: '12:00', requests: 68 },
    { time: '14:00', requests: 52 },
    { time: '16:00', requests: 89 },
    { time: '18:00', requests: 74 },
    { time: '20:00', requests: 31 },
];

export default function AIMonitorPage() {
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
                        <div className="text-3xl font-bold">1,284</div>
                        <p className="text-xs text-muted-foreground mt-1">+18% from yesterday</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Auto-Booking Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">64.2%</div>
                        <p className="text-xs text-muted-foreground mt-1">Users following AI suggestions</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Triage Accuracy</CardTitle>
                        <ThumbsUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">96.8%</div>
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
                                <BarChart data={triageData}>
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
                                <LineChart data={loadData}>
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

function Activity({ size, className }: { size: number, className: string }) {
    return <TrendingUp size={size} className={className} />;
}

import { Badge } from '@/components/ui/badge';
