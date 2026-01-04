
'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Map, Wallet } from 'lucide-react';

export default function ProviderHome() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="VehicAid Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              VehicAid Partner
            </span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:text-green-400 transition">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition">
              Join Network
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Drive. Help. <span className="text-green-500">Earn.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Join India's premium roadside assistance network. Get instant payouts, flexible hours, and IoT-enabled dispatch.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link href="/login" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition text-lg">
            Start Driving
          </Link>
          <Link href="/about" className="px-8 py-4 bg-gray-900 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition text-lg">
            Learn More
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-green-500">
              <Wallet />
            </div>
            <h3 className="text-xl font-bold mb-2">Daily Settlements</h3>
            <p className="text-gray-400">Payments are processed automatically every 24 hours. No waiting for weeks.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-green-500">
              <Map />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Dispatch</h3>
            <p className="text-gray-400">IoT-enabled location tracking ensures you get jobs that are actually nearby.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-green-500">
              <ShieldCheck />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Trust</h3>
            <p className="text-gray-400">Build your reputation with our rating system and get access to premium jobs.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
