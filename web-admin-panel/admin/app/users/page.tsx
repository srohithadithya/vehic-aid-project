'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import apiClient from '@/lib/api';
import { Search, MoreVertical, User, Phone } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const UserForm = dynamic(() => import('@/components/user-form'), { ssr: false });

interface UserData {
    id: number;
    username: string;
    email: string;
    role: string;
    phone_number: string;
    is_active: boolean;
    date_joined: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<UserData | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/services/admin/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone_number?.includes(searchTerm);

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (role) {
            case 'ADMIN': return 'default';
            case 'PROVIDER': return 'secondary';
            case 'CUSTOMER': return 'outline';
            default: return 'secondary';
        }
    };

    const handleAdd = () => {
        setEditUser(null);
        setShowModal(true);
    };

    const handleEdit = (user: UserData) => {
        setEditUser(user);
        setShowModal(true);
    };

    const handleDelete = async (user: UserData) => {
        if (!window.confirm(`Delete user ${user.username}?`)) return;
        setSaving(true);
        try {
            await apiClient.delete(`/services/admin/users/${user.id}/`);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user.');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (data: any) => {
        setSaving(true);
        try {
            if (editUser) {
                await apiClient.put(`/services/admin/users/${editUser.id}/`, data);
            } else {
                await apiClient.post('/services/admin/users/', data);
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            alert('Failed to save user.');
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
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage users, roles, and permissions.</p>
                </div>
                <Button onClick={handleAdd} disabled={saving}>
                    Add New User
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        <SelectItem value="CUSTOMER">Customers</SelectItem>
                        <SelectItem value="PROVIDER">Providers</SelectItem>
                        <SelectItem value="ADMIN">Admins</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            {user.phone_number}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_active ? "default" : "destructive"}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(user.date_joined).toLocaleDateString()}
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
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                                    Copy Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(user)} className="text-destructive">Delete</DropdownMenuItem>
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
                        <UserForm
                            initialData={editUser || {}}
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
