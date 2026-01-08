'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LucideActivity, LucideBot, LucideUser, LucideLayoutDashboard } from "lucide-react";

export function Navbar() {
    const { t } = useLanguage();
    const { user, logout } = useAuth();

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
                        <div className="flex items-center space-x-3">
                            <LucideUser className="text-muted-foreground" size={20} />
                            <Button variant="ghost" size="sm" onClick={() => logout()}>Log Out</Button>
                        </div>
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
