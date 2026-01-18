'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Wrench, IndianRupee, Settings, LogOut, TrendingUp, Activity, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useLanguage } from '@/context/LanguageContext';

export function AdminSidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const sidebarItems = [
        { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard' },
        { icon: Users, label: t('nav.users'), href: '/users' },
        { icon: Wrench, label: t('nav.bookings'), href: '/bookings' },
        { icon: IndianRupee, label: t('nav.payments'), href: '/payments' },
        { icon: Activity, label: t('nav.iot'), href: '/iot-fleet' },
        { icon: Bot, label: t('nav.ai'), href: '/ai-monitor' },
        { icon: TrendingUp, label: t('nav.analytics'), href: '/analytics' },
    ];

    return (
        <div className="pb-12 w-64 min-h-screen hidden md:block relative">
            {/* Sidebar Background */}
            <div className="fixed inset-y-0 w-64 bg-slate-900 border-r border-slate-800 z-10 transition-all duration-300">
                <div className="space-y-4 py-6">
                    <div className="px-3 py-2">
                        <div className="flex items-center gap-3 mb-6 px-6">
                            <div className="relative h-10 w-10">
                                <Image
                                    src="/logo.png"
                                    alt="Vehic-Aid Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Vehic-Aid
                            </h2>
                        </div>
                        <div className="space-y-1">
                            {sidebarItems.map((item) => (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className={`w-full justify-start transition-all duration-200 ${pathname.startsWith(item.href)
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
