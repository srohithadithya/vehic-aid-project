'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-background flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03] select-none pointer-events-none">
                    <h1 className="text-[10rem] font-bold rotate-12 whitespace-nowrap">VehicAid</h1>
                </div>
            </div>

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    {/* Brand Logo only */}
                    <div className="inline-flex items-center justify-center space-x-2 mb-6">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                            VehicAid
                        </span>
                    </div>
                </div>

                {children}

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} VehicAid. Connect securely, drive safely.</p>
                </div>
            </motion.div>
        </div>
    );
}
