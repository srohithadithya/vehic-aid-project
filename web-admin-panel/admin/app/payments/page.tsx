'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import apiClient from '@/lib/api';
import { Search, MoreVertical, CreditCard } from 'lucide-react';
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

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Payments & Transactions</h2>
                    <p className="text-muted-foreground">Monitor revenue and payment statuses.</p>
                </div>
                <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-sm font-medium text-primary">Total Revenue</div>
                        <div className="text-2xl font-bold text-primary">
                            ₹{payments.reduce((acc, curr) => acc + (curr.status === 'SUCCESS' ? curr.amount : 0), 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Button onClick={handleAdd} disabled={saving}>
                    Add Payment
                </Button>
            </div>

            <div className="flex items-center gap-4">
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

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading payments...
                                </TableCell>
                            </TableRow>
                        ) : filteredPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-xs">
                                        {payment.transaction_id || 'N/A'}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {payment.user}
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        ₹{payment.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <CreditCard className="h-4 w-4" />
                                            {payment.payment_method}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(payment.status)}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.transaction_id)}>
                                                    Copy Transaction ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEdit(payment)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(payment)} className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                        <PaymentForm
                            initialData={editPayment || {}}
                            onSubmit={handleSave}
                            onCancel={handleCancel}
                            loading={saving}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
