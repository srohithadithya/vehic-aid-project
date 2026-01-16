'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { Bot, Sparkles, TrendingUp, ThumbsUp, MessageSquare, Brain, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

interface AIStats {
    total_sessions: number;
    auto_booking_rate: number;
    triage_accuracy: number;
    triage_data: any[];
    load_data: any[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

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
        <motion.div
            className="p-8 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/50 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        <div className="relative p-4 bg-primary/20 rounded-3xl border border-primary/30">
                            <Bot className="text-primary" size={40} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Neural Analytics
                        </h2>
                        <p className="text-white/50 text-lg font-medium">Monitoring the artificial intelligence heartbeat.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
                        <Sparkles size={14} className="mr-2 animate-pulse" /> Model: TRIAGE-V3P
                    </Badge>
                </div>
            </div>

            {/* Neural Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <motion.div variants={itemVariants}>
                    <Card className="glass-card group overflow-hidden border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold text-white/60">Interaction Flux</CardTitle>
                            <MessageSquare className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-white">{stats.total_sessions.toLocaleString()}</div>
                            <div className="flex items-center mt-2 text-xs font-bold text-emerald-400">
                                <TrendingUp className="w-3 h-3 mr-1" /> CORE-ENGAGEMENT UP 18%
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="glass-card group overflow-hidden border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold text-white/60">Cognitive Conversion</CardTitle>
                            <TrendingUp className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-white">{stats.auto_booking_rate}%</div>
                            <div className="mt-2 text-[10px] text-white/40 uppercase tracking-widest font-black">Autonomous Dispatch Frequency</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="glass-card group overflow-hidden border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold text-white/60">Triage Precision</CardTitle>
                            <ThumbsUp className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-white">{stats.triage_accuracy}%</div>
                            <div className="mt-2 text-[10px] text-white/40 uppercase tracking-widest font-black">Synthetic vs Human Delta: 0.2%</div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <motion.div variants={itemVariants}>
                    <Card className="glass-card border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg font-bold">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Brain size={20} className="text-purple-400" />
                                </div>
                                Category Classification
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.triage_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                        />
                                        <Bar dataKey="accuracy" fill="#10b981" radius={[8, 8, 8, 8]} barSize={40}>
                                            {stats.triage_data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="glass-card border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg font-bold">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Activity size={20} className="text-blue-400" />
                                </div>
                                Synaptic Request Load
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.load_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="requests"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

