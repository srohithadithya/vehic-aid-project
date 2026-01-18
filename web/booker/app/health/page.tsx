'use client';

import { useState, useEffect } from 'react';
// import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { apiClient } from '@/lib/api';
import { LucideZap, LucideSignal, LucideCpu, LucideAlertTriangle, LucideCheckCircle2, LucideActivity } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HealthPage() {
    const { t } = useLanguage();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [device, setDevice] = useState<any>(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/iot/status/');
                setDevice(response.data);
            } catch (error) {
                console.error("Failed to fetch IoT status", error);
            } finally {
                setDataLoading(false);
            }
        };
        // Only fetch if user loaded
        if (user) {
            fetchData();
        }
    }, [user]);

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
    );

    if (!user) {
        router.push('/auth/login?redirect=/health');
        return null;
    }

    const healthStatus = device?.battery && device.battery > 30 ? 'HEALTHY' : 'ATTENTION';

    return (
        <main className="min-h-screen bg-background">
            {/* Navbar handled in layout */}

            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <LucideActivity className="text-primary" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{t('health.title')}</h1>
                            <p className="text-muted-foreground">{t('health.status')}</p>
                        </div>
                    </div>

                    {dataLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : device ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Main Card */}
                            <div className="bg-card border rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <LucideCpu size={120} />
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold ring-1 ${healthStatus === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
                                        }`}>
                                        SYSTEM {healthStatus}
                                    </div>
                                    <LucideCpu className="text-primary" size={24} />
                                </div>

                                <div className="mb-8">
                                    <div className="text-7xl font-black mb-2">98%</div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Reliability Score</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                                    <div className="flex items-center space-x-3">
                                        <LucideZap size={20} className="text-amber-500" />
                                        <div>
                                            <div className="text-xl font-bold">{device.battery}%</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">Battery</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <LucideSignal size={20} className="text-blue-500" />
                                        <div>
                                            <div className="text-xl font-bold">{device.is_active ? 'Strong' : 'Offline'}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">
                                                {device.last_signal ? new Date(device.last_signal).toLocaleString() : 'No Signal'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Diagnostics */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold mb-4">Diagnostics Feed</h3>

                                <div className="bg-card border rounded-2xl p-5 flex items-center space-x-4">
                                    <LucideCheckCircle2 className="text-emerald-500" size={20} />
                                    <div>
                                        <p className="font-semibold">IoT Sync Status</p>
                                        <p className="text-xs text-muted-foreground">Connected and heartbeat received</p>
                                    </div>
                                </div>

                                <div className="bg-card border rounded-2xl p-5 flex items-center space-x-4">
                                    <LucideCheckCircle2 className="text-emerald-500" size={20} />
                                    <div>
                                        <p className="font-semibold">Predictive Engine</p>
                                        <p className="text-xs text-muted-foreground">No critical failures predicted</p>
                                    </div>
                                </div>

                                {device.battery < 20 && (
                                    <div className="bg-destructive/10 border-destructive/20 border rounded-2xl p-5 flex items-center space-x-4">
                                        <LucideAlertTriangle className="text-destructive" size={20} />
                                        <div>
                                            <p className="font-semibold text-destructive">Battery Critical</p>
                                            <p className="text-xs text-destructive/80">Please recharge your IoT module soon.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card border rounded-3xl p-12 text-center">
                            <LucideCpu className="mx-auto text-muted-foreground mb-4" size={48} />
                            <h2 className="text-xl font-bold">No IoT Device Paired</h2>
                            <p className="text-muted-foreground mt-2">Pair your device in settings to see your vehicle health dashboard.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
