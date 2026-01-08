'use client';

import Link from 'next/link';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function ProviderHome() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

        <div className="text-center mb-16 max-w-2xl">
          <div className="mx-auto w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-50 rounded-full"></div>
            <img src="/logo.png" alt="VehicAid" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Partner Portal
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Secure access for fleet operators and service professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
          {/* Login Card */}
          <Link href="/login" className="group relative bg-white/5 border border-white/10 hover:bg-white/10 rounded-3xl p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-400">
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Existing Partner</h2>
            <p className="text-gray-400">Access your mission control dashboard.</p>
            <div className="mt-8 px-6 py-2 rounded-full border border-purple-500/30 text-purple-300 text-sm font-medium group-hover:bg-purple-500 group-hover:text-white transition-colors">
              Login Now
            </div>
          </Link>

          {/* Signup Card */}
          <Link href="/signup" className="group relative bg-white/5 border border-white/10 hover:bg-white/10 rounded-3xl p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10 flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-green-400">
              <UserPlus className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">New Registration</h2>
            <p className="text-gray-400">Join the fleet. Determine your own schedule.</p>
            <div className="mt-8 px-6 py-2 rounded-full border border-green-500/30 text-green-300 text-sm font-medium group-hover:bg-green-500 group-hover:text-black transition-colors">
              Apply to Join
            </div>
          </Link>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">VehicAid Systems v2.4.0 • Secure Connection</p>
        </div>

      </main>
    </div>
  );
}
