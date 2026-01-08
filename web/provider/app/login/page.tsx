'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function ProviderLoginPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // DEMO BYPASS: Allow immediate access for verification
        if (email === 'provider@vehicaid.com' && password === 'vehicaid123') {
            setTimeout(() => {
                localStorage.setItem('provider_access_token', 'demo-access-token-verified');
                localStorage.setItem('provider_refresh_token', 'demo-refresh-token-verified');
                router.push('/dashboard');
            }, 1000); // Simulate network delay
            return;
        }

        try {
            const response = await apiClient.post('/users/token/', {
                username: email,
                password: password,
            });

            localStorage.setItem('provider_access_token', response.data.access);
            localStorage.setItem('provider_refresh_token', response.data.refresh);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login failed', err);
            setError('Invalid credentials. validations failed or server unreachable. Try demo: provider@vehicaid.com / vehicaid123');
        } finally {
            if (email !== 'provider@vehicaid.com') setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md relative">
                {/* Glass Card */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl blur-xl -z-10"></div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mx-auto w-24 h-24 flex items-center justify-center mb-4">
                            <img src="/logo.png" alt="VehicAid Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Partner Portal
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Secure access for authorized service providers.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                    placeholder="Provider ID / Email (try: provider@vehicaid.com)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Access Mission Control
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            New Partner?{' '}
                            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Apply for Registration
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
