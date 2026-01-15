'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LucideActivity, LucideBot, User, LucideLayoutDashboard, Bell, CreditCard, Settings, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/logo.png" alt="VehicAid Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                        VehicAid
                    </span>
                </Link>

                <nav className="hidden lg:flex items-center space-x-8">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.book')}</Link>
                    <Link href="/health" className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors">
                        <LucideActivity size={16} />
                        <span>{t('nav.health')}</span>
                    </Link>
                    <Link href="/support" className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors">
                        <LucideBot size={16} />
                        <span>{t('nav.support')}</span>
                    </Link>
                    <Link href="/subscription" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.sub')}</Link>
                    <Link href="/dashboard" className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors">
                        <LucideLayoutDashboard size={16} />
                        <span>{t('nav.dashboard')}</span>
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <LanguageToggle />
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold ring-2 ring-primary/20">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/settings')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/billing')}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => logout()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm">Log In</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
