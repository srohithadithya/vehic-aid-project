'use client';

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { LucideLayoutDashboard, LucideHistory, LucideUser } from "lucide-react";

export function Navbar() {
    const { t } = useLanguage();

    return (
        <header className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/logo.png" alt="VehicAid Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        VehicAid Partner
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-medium hover:text-green-400 transition">
                        <LucideLayoutDashboard size={16} />
                        <span>{t('nav.dashboard')}</span>
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

                <div className="flex items-center space-x-4">
                    <LanguageToggle />
                    <Link href="/login" className="text-sm font-medium hover:text-green-400 transition">Login</Link>
                </div>
            </div>
        </header>
    );
}
