'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { LucideLayoutDashboard, LucideHistory, LucideUser, LucideIndianRupee } from "lucide-react";

export function Navbar() {
    const { t } = useLanguage();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for token presence
        const checkAuth = () => {
            const token = localStorage.getItem('provider_access_token');
            setIsLoggedIn(!!token);
        };

        checkAuth();
        // Add event listener for customized storage events even within same window if using that pattern, 
        // or just rely on mount check. For better UX, we can poll or use a custom event.
        // For now, mount check is sufficient for page navigations.
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('provider_access_token');
        localStorage.removeItem('provider_refresh_token');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    return (
        <header className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/logo.png" alt="VehicAid Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        VehicAid Partner
                    </span>
                </Link>

                {isLoggedIn && (
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-medium hover:text-green-400 transition">
                            <LucideLayoutDashboard size={16} />
                            <span>{t('nav.dashboard')}</span>
                        </Link>
                        <Link href="/earnings" className="flex items-center space-x-2 text-sm font-medium hover:text-green-400 transition">
                            <LucideIndianRupee size={16} />
                            <span>Earnings</span>
                        </Link>
                        <Link href="/history" className="flex items-center space-x-2 text-sm font-medium hover:text-green-400 transition">
                            <LucideHistory size={16} />
                            <span>{t('nav.history')}</span>
                        </Link>
                        <Link href="/profile" className="flex items-center space-x-2 text-sm font-medium hover:text-green-400 transition">
                            <LucideUser size={16} />
                            <span>{t('nav.profile')}</span>
                        </Link>
                    </nav>
                )}

                <div className="flex items-center space-x-4">
                    <LanguageToggle />
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/login" className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
