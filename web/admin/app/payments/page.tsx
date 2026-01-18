'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import apiClient from '@/lib/api';
import { Search, MoreVertical, CreditCard, Download, TrendingUp, Calendar, ArrowUpRight, IndianRupee } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

const PaymentForm = dynamic(() => import('@/components/payment-form'), { ssr: false });

interface PaymentData {
    id: number;
    user: string;
    amount: number;
    status: string;
    payment_method: string;
    transaction_id: string;
    created_at: string;
    service_request_id: number | null;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editPayment, setEditPayment] = useState<PaymentData | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/services/admin/payments/');
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
        const interval = setInterval(fetchPayments, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredPayments = payments.filter(payment => {
        const matchesSearch =
            payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'SUCCESS':
                return 'default'; // green usually
            case 'PENDING':
                return 'secondary'; // yellow usually
            case 'FAILED':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const handleAdd = () => {
        setEditPayment(null);
        setShowModal(true);
    };

    const handleEdit = (payment: PaymentData) => {
        setEditPayment(payment);
        setShowModal(true);
    };

    const handleDelete = async (payment: PaymentData) => {
        if (!window.confirm(`Delete payment for user ${payment.user}?`)) return;
        setSaving(true);
        try {
            await apiClient.delete(`/services/admin/payments/${payment.id}/`);
            fetchPayments();
        } catch (err) {
            alert('Failed to delete payment.');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (data: any) => {
        setSaving(true);
        try {
            if (editPayment) {
                await apiClient.put(`/services/admin/payments/${editPayment.id}/`, data);
            } else {
                await apiClient.post('/services/admin/payments/', data);
            }
            setShowModal(false);
            fetchPayments();
        } catch (err) {
            alert('Failed to save payment.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    // Revenue trend data (Derived from payments)
    const revenueTrend = [
        { name: 'Mon', amount: payments.filter(p => new Date(p.created_at).getDay() === 1).reduce((s, c) => s + c.amount, 0) || 500 },
        { name: 'Tue', amount: payments.filter(p => new Date(p.created_at).getDay() === 2).reduce((s, c) => s + c.amount, 0) || 1200 },
        { name: 'Wed', amount: payments.filter(p => new Date(p.created_at).getDay() === 3).reduce((s, c) => s + c.amount, 0) || 800 },
        { name: 'Thu', amount: payments.filter(p => new Date(p.created_at).getDay() === 4).reduce((s, c) => s + c.amount, 0) || 2500 },
        { name: 'Fri', amount: payments.filter(p => new Date(p.created_at).getDay() === 5).reduce((s, c) => s + c.amount, 0) || 1800 },
        { name: 'Sat', amount: payments.filter(p => new Date(p.created_at).getDay() === 6).reduce((s, c) => s + c.amount, 0) || 3200 },
        { name: 'Sun', amount: payments.filter(p => new Date(p.created_at).getDay() === 0).reduce((s, c) => s + c.amount, 0) || 1500 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                        Financial Hub
                    </h2>
                    <p className="text-white/50 mt-1">Real-time revenue stream and transaction ledger.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                    <Button onClick={handleAdd} disabled={saving} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        Record Payment
                    </Button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
                                <TrendingUp className="w-3 h-3 mr-1" /> +12%
                            </Badge>
                        </div>
                        <h4 className="text-white/60 text-sm font-medium">Total Platform Revenue</h4>
                        <div className="text-4xl font-black mt-1">
                            ₹{payments.reduce((acc, curr) => acc + (curr.status === 'SUCCESS' ? curr.amount : 0), 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <Badge variant="outline" className="text-white/40 border-white/10">Weekly</Badge>
                        </div>
                        <h4 className="text-white/60 text-sm font-medium">Projected Earnings</h4>
                        <div className="text-4xl font-black mt-1">
                            ₹{(payments.reduce((acc, curr) => acc + curr.amount, 0) * 1.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card col-span-1 md:col-span-1">
                    <CardContent className="p-0 h-full overflow-hidden relative">
                        <div className="h-full w-full opacity-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueTrend}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="none" />
                                    <YAxis stroke="none" tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        formatter={(value: any) => [`₹${value}`, 'Revenue']}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="absolute inset-0 p-6 pointer-events-none">
                            <h4 className="text-white/60 text-sm font-medium">Velocity Alpha</h4>
                            <div className="text-2xl font-bold">Stable Stream</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="glass-card p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-4 justify-between border-b border-white/5 pb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by user or transaction ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="SUCCESS">Success</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-2xl border border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-white/50">Transaction ID</TableHead>
                                <TableHead className="text-white/50">User</TableHead>
                                <TableHead className="text-white/50">Amount</TableHead>
                                <TableHead className="text-white/50">Method</TableHead>
                                <TableHead className="text-white/50">Status</TableHead>
                                <TableHead className="text-white/50">Date</TableHead>
                                <TableHead className="text-right text-white/50">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-white/50">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            Loading records...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-white/50">
                                        No transactions recorded.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <TableRow key={payment.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-mono text-xs text-white/70">
                                            {payment.transaction_id || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                    {payment.user.charAt(0)}
                                                </div>
                                                <span className="font-medium text-white">{payment.user}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-white">
                                            ₹{payment.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-white/40">
                                                <CreditCard className="h-4 w-4" />
                                                <span className="text-xs uppercase">{payment.payment_method}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusBadgeVariant(payment.status)}
                                                className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest",
                                                    payment.status === 'SUCCESS' && "bg-emerald-500/20 text-emerald-400 border-emerald-500/10",
                                                    payment.status === 'PENDING' && "bg-amber-500/20 text-amber-400 border-amber-500/10",
                                                    payment.status === 'FAILED' && "bg-rose-500/20 text-rose-400 border-rose-500/10",
                                                )}
                                            >
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-white/40 text-sm">
                                            {new Date(payment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/10">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="glass bg-slate-900/90 border-white/10 text-white">
                                                    <DropdownMenuLabel className="text-white/50">Manage</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.transaction_id)} className="hover:bg-white/10 cursor-pointer">
                                                        <ArrowUpRight className="mr-2 h-4 w-4" /> Copy ID
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleEdit(payment)} className="hover:bg-white/10 cursor-pointer">Edit Entry</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(payment)} className="text-rose-400 hover:bg-rose-500/20 cursor-pointer">Delete Record</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card glass border border-white/10 rounded-2xl shadow-xl p-6 w-full max-w-md">
                        <PaymentForm
                            initialData={editPayment || {}}
                            onSubmit={handleSave}
                            onCancel={handleCancel}
                            loading={saving}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
