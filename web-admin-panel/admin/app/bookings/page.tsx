'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import apiClient from '@/lib/api';
import { Search, MoreVertical, Wrench, MapPin } from 'lucide-react';
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BookingForm = dynamic(() => import('@/components/booking-form'), { ssr: false });

interface BookingData {
    id: number;
    customer: string;
    provider: string;
    service_type: string;
    status: string;
    location: string;
    created_at: string;
    description: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editBooking, setEditBooking] = useState<BookingData | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/services/admin/bookings/');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.service_type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'COMPLETED':
                return 'default'; // green-ish usually if customized, or default black
            case 'PENDING':
                return 'secondary'; // yellow-ish usually
            case 'IN_PROGRESS':
                return 'default'; // blue-ish usually
            case 'CANCELLED':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const handleAdd = () => {
        setEditBooking(null);
        setShowModal(true);
    };

    const handleEdit = (booking: BookingData) => {
        setEditBooking(booking);
        setShowModal(true);
    };

    const handleDelete = async (booking: BookingData) => {
        if (!window.confirm(`Delete booking for ${booking.customer}?`)) return;
        setSaving(true);
        try {
            await apiClient.delete(`/services/admin/bookings/${booking.id}/`);
            fetchBookings();
        } catch (err) {
            alert('Failed to delete booking.');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (data: any) => {
        setSaving(true);
        try {
            if (editBooking) {
                await apiClient.put(`/services/admin/bookings/${editBooking.id}/`, data);
            } else {
                await apiClient.post('/services/admin/bookings/', data);
            }
            setShowModal(false);
            fetchBookings();
        } catch (err) {
            alert('Failed to save booking.');
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
                    <h2 className="text-3xl font-bold tracking-tight">Service Requests</h2>
                    <p className="text-muted-foreground">Manage and track service bookings.</p>
                </div>
                <Button onClick={handleAdd} disabled={saving}>
                    Create Request
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search bookings..."
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
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading bookings...
                                </TableCell>
                            </TableRow>
                        ) : filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="mr-4 rounded-full bg-muted p-2">
                                                <Wrench className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{booking.service_type}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {booking.location}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{booking.customer}</TableCell>
                                    <TableCell>{booking.provider}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(booking.created_at).toLocaleDateString()}
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
                                                <DropdownMenuItem onClick={() => handleEdit(booking)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(booking)} className="text-destructive">Delete</DropdownMenuItem>
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
                        <BookingForm
                            initialData={editBooking || {}}
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
