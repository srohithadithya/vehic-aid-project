'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Wrench, DollarSign, Settings, LogOut, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Wrench, label: 'Bookings', href: '/bookings' },
    { icon: DollarSign, label: 'Payments', href: '/payments' },
    { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="pb-12 w-64 min-h-screen hidden md:block relative">
            {/* Glass Background Panel */}
            <div className="fixed inset-y-0 w-64 glass border-r-0 z-10 transition-all duration-300">
                <div className="space-y-4 py-6">
                    <div className="px-3 py-2">
                        <div className="flex items-center gap-3 mb-6 px-4">
                            <Image
                                src="/logo.png"
                                alt="Vehic-Aid Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                Vehic-Aid
                            </h2>
                        </div>
                        <div className="space-y-2">
                            {sidebarItems.map((item) => (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className={`w-full justify-start transition-all duration-200 ${pathname.startsWith(item.href)
                                        ? 'bg-primary/20 text-primary hover:bg-primary/30 border-r-2 border-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                        }`}
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
