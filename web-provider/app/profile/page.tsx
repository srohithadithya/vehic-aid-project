'use client';

import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { LucideUser, LucideShield, LucideGlobe, LucideLogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { t, language, setLanguage } = useLanguage();
    const { user, logout } = useAuth();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto max-w-4xl px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                            <LucideUser size={48} className="text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user?.username || 'Partner'}</h1>
                            <div className="flex items-center justify-center space-x-2 text-green-500 mt-1">
                                <LucideShield size={16} />
                                <span className="text-sm font-bold uppercase tracking-widest">Verified Partner</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-400">
                                <LucideGlobe size={18} />
                                Settings
                            </h2>

                            <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                                <div>
                                    <p className="font-semibold">Interface Language</p>
                                    <p className="text-xs text-muted-foreground">{language === 'en' ? 'Currently using English' : 'अभी हिन्दी का उपयोग कर रहे हैं'}</p>
                                </div>
                                <button
                                    onClick={toggleLanguage}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition"
                                >
                                    Switch to {language === 'en' ? 'हिन्दी' : 'English'}
                                </button>
                            </div>
                        </section>

                        <button
                            onClick={() => logout()}
                            className="w-full p-6 flex items-center justify-center space-x-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500/20 transition-all font-bold"
                        >
                            <LucideLogOut size={20} />
                            <span>Go Offline & Logout</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
