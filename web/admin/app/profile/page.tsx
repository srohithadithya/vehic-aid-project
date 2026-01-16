'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, Key } from 'lucide-react';

export default function ProfilePage() {
    const handleLogout = () => {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        window.location.href = '/login';
    };

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Profile</h1>
                <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <h2 className="mt-4 text-xl font-bold">Admin User</h2>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2">Super Admin</span>

                        <div className="w-full mt-6 space-y-2">
                            <Button className="w-full" variant="outline">Change Avatar</Button>
                            <Button
                                onClick={handleLogout}
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                variant="ghost"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" /> Username
                                </label>
                                <Input defaultValue="admin" readOnly />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" /> Email Address
                                </label>
                                <Input defaultValue="admin@vehicaid.com" />
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and security settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Key className="w-4 h-4 text-gray-500" /> New Password
                                </label>
                                <Input type="password" placeholder="Enter new password" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-500" /> Confirm Password
                                </label>
                                <Input type="password" placeholder="Confirm new password" />
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-end">
                            <Button variant="secondary">Update Password</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
