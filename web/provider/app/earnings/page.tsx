// @ts-nocheck
'use client';


import { useState, useEffect } from 'react';
export const dynamic = 'force-dynamic';

import { motion } from "framer-motion";
// import { format } from "date-fns";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Download,
    Filter,
    MoreHorizontal,
    TrendingUp,
    CreditCard,
    DollarSign,
    Calendar,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl overflow-hidden",
        className
    )}>
        {children}
    </div>
);

const WalletCard = () => (
    <div className="relative h-56 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 group">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative p-6 h-full flex flex-col justify-between text-white border border-white/10 rounded-3xl">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                    <p className="text-xs font-medium text-white/60 uppercase tracking-widest">Current Balance</p>
                    <h2 className="text-3xl font-bold mt-1 tracking-tight">₹3,200.50</h2>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    {/* Chip Simulation */}
                    <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-yellow-200 to-yellow-500/80 border border-yellow-400 shadow-inner flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 border-[0.5px] border-black/20 rounded-[inherit]" />
                        <Activity className="w-8 h-8 text-black/10 rotate-90 scale-150" />
                    </div>
                    <div className="text-lg font-mono tracking-widest text-white/80">
                        •••• •••• •••• 4291
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-white/50 uppercase">Card Holder</p>
                        <p className="font-medium tracking-wide">ROHIT ADITHYA</p>
                    </div>
                    <div className="text-right">
                        <span className="italic font-bold text-xl opacity-80">VISA</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const StatCard = ({ title, value, trend, icon: Icon, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <GlassCard className="p-6 relative group hover:bg-white/10 transition-colors duration-300">
            <div className="absolute top-4 right-4 p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {trend && (
                <div className={cn(
                    "flex items-center mt-4 text-xs font-medium px-2 py-1 rounded-full w-fit",
                    trend > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                    {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
                    {Math.abs(trend)}% vs last week
                </div>
            )}
        </GlassCard>
    </motion.div>
);

const WeekChart = () => {
    const data = [45, 70, 35, 90, 60, 85, 100];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="h-64 flex items-end justify-between gap-4 mt-8 px-2">
            {data.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                    <div className="relative w-full h-48 flex items-end rounded-2xl bg-muted/20 overflow-hidden">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "backOut" }}
                            className="w-full bg-gradient-to-t from-primary/60 to-primary relative group-hover:from-primary group-hover:to-purple-400 transition-all duration-300"
                        >
                            <div className="absolute top-0 w-full h-[2px] bg-white/50" />
                        </motion.div>
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs py-1 px-2 rounded-lg shadow-lg font-bold border">
                            ₹{h * 100}
                        </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{days[i]}</span>
                </div>
            ))}
        </div>
    );
};

import { apiClient } from '../../lib/api';
// ... existing imports ...

export default function EarningsPage() {
    const [stats, setStats] = useState({
        current_balance: 0,
        todays_earnings: 0,
        pending_payouts: 0,
        weekly_chart: { values: [0, 0, 0, 0, 0, 0, 0], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        recent_transactions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await apiClient.get('/payments/dashboard/provider/');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch earnings data", error);
                // Fallback to zero values or keep simple loading state logic
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const transactions = stats.recent_transactions || [];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Blooms */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto p-6 lg:p-10 max-w-7xl space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Financial Overview
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">Track your earnings, payouts, and performance.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex gap-3"
                    >
                        <Button variant="outline" className="rounded-xl h-12 px-6 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all">
                            <Download className="w-4 h-4 mr-2" /> Export Report
                        </Button>
                        <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                            <Wallet className="w-4 h-4 mr-2" /> Withdraw Funds
                        </Button>
                    </motion.div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Wallet & Monthly Chart */}
                    <div className="space-y-8 lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="relative h-56 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 group">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800" />
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

                                <div className="relative p-6 h-full flex flex-col justify-between text-white border border-white/10 rounded-3xl">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                            <Wallet className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-white/60 uppercase tracking-widest">Current Balance</p>
                                            <h2 className="text-3xl font-bold mt-1 tracking-tight">
                                                {loading ? "..." : `₹${stats.current_balance.toLocaleString()}`}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            {/* Chip Simulation */}
                                            <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-yellow-200 to-yellow-500/80 border border-yellow-400 shadow-inner flex items-center justify-center overflow-hidden relative">
                                                <div className="absolute inset-0 border-[0.5px] border-black/20 rounded-[inherit]" />
                                                <Activity className="w-8 h-8 text-black/10 rotate-90 scale-150" />
                                            </div>
                                            <div className="text-lg font-mono tracking-widest text-white/80">
                                                •••• •••• •••• 4291
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] text-white/50 uppercase">Card Holder</p>
                                                <p className="font-medium tracking-wide">ROHIT ADITHYA</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="italic font-bold text-xl opacity-80">VISA</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg">Quick Transfer</h3>
                                <CreditCard className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Transfer to linked bank account ending in **88</p>
                                <Button className="w-full rounded-xl" variant="secondary">Transfer to Account</Button>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Right Column: Stats & Big Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatCard
                                delay={0.3}
                                title="Today's Earnings"
                                value={loading ? "..." : `₹${stats.todays_earnings.toLocaleString()}`}
                                trend={12}
                                icon={DollarSign}
                            />
                            <StatCard
                                delay={0.4}
                                title="Pending Payouts"
                                value={loading ? "..." : `₹${stats.pending_payouts.toLocaleString()}`}
                                icon={Activity}
                            />
                        </div>

                        {/* Revenue Chart Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <GlassCard className="p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">Revenue Analytics</h3>
                                        <p className="text-sm text-muted-foreground">Weekly performance overview</p>
                                    </div>
                                    <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
                                        {['Week', 'Month', 'Year'].map((t) => (
                                            <button key={t} className={cn("px-3 py-1 text-sm rounded-md transition-all font-medium", t === 'Week' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Inlined WeekChart to access stats.weekly_chart data easily */}
                                <div className="h-64 flex items-end justify-between gap-4 mt-8 px-2">
                                    {stats.weekly_chart.values.map((h: any, i: any) => {
                                        const maxVal = Math.max(...(stats.weekly_chart.values as number[])) || 100;
                                        const percentage = (h / maxVal) * 100;
                                        return (
                                            <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                                <div className="relative w-full h-48 flex items-end rounded-2xl bg-muted/20 overflow-hidden">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${percentage}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1, ease: "backOut" }}
                                                        className="w-full bg-gradient-to-t from-primary/60 to-primary relative group-hover:from-primary group-hover:to-purple-400 transition-all duration-300"
                                                    >
                                                        <div className="absolute top-0 w-full h-[2px] bg-white/50" />
                                                    </motion.div>
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs py-1 px-2 rounded-lg shadow-lg font-bold border">
                                                        ₹{h}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                                    {/* @ts-ignore */}
                                                    {stats.weekly_chart.labels[i]}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>

                {/* Transactions Table */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Recent Transactions</h3>
                            <Button variant="ghost" size="icon">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Transaction ID</th>
                                        <th className="px-6 py-4 font-semibold">Service / Description</th>
                                        <th className="px-6 py-4 font-semibold">Date & Time</th>
                                        <th className="px-6 py-4 font-semibold">Type</th>
                                        <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {transactions.map((tx, i) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + (i * 0.05) }}
                                            className="hover:bg-white/5 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4 font-mono text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                                {tx.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{tx.service}</div>
                                                <div className="text-xs text-muted-foreground">{tx.customer} • {tx.method}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Intl.DateTimeFormat('en-US', {
                                                    month: 'short', day: 'numeric',
                                                    hour: 'numeric', minute: 'numeric', hour12: true
                                                }).format(new Date(tx.date))}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                    tx.type === 'Withdrawal'
                                                        ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                        : tx.type === 'Bonus'
                                                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                )}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={cn(
                                                "px-6 py-4 text-right font-bold text-base",
                                                tx.amount > 0 ? "text-emerald-500" : "text-foreground"
                                            )}>
                                                {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-500 p-1 rounded-full">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5" />
                                                    <span className="text-xs font-medium">Paid</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </motion.div>

                <div className="text-center text-sm text-muted-foreground pb-8">
                    <p>Secure payments processed by Razorpay. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
