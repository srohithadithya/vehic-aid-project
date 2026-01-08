'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import {
    User, Mail, Phone, Truck, Shield, Star,
    Edit, Save, Award, MapPin, Calendar, CreditCard
} from 'lucide-react';
import { clsx } from "clsx";
import AuthGuard from '@/components/AuthGuard';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: "Rohith Adithya",
        title: "Senior Recovery Specialist",
        id: "PRO-882190",
        email: "provider@vehicaid.com",
        phone: "+91 98765 43210",
        vehicle: "Tata Xenon Retrieval Unit",
        plate: "KA-01-EQ-9988",
        joined: "Jan 2024",
        rating: 4.9,
        jobs: 142
    });

    const handleSave = () => {
        setIsEditing(false);
        // API Call to save would go here
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-black text-white">
                <Navbar />

                <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto pt-24 space-y-8">

                    {/* Digital ID Card Section */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 overflow-hidden">

                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="relative shrink-0">
                                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-800 to-black border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
                                        <User className="w-16 h-16 text-gray-400" />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full border-4 border-black">
                                        VERIFIED
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
                                            <p className="text-purple-400 font-medium flex items-center justify-center md:justify-start gap-2">
                                                {userData.title} <Shield className="w-4 h-4" />
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end">
                                            <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">Provider ID</div>
                                            <div className="font-mono text-xl text-white tracking-widest">{userData.id}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold">{userData.rating}</span>
                                            <span className="text-gray-500 text-sm">Rating</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
                                            <Award className="w-4 h-4 text-orange-500" />
                                            <span className="font-bold">{userData.jobs}</span>
                                            <span className="text-gray-500 text-sm">Missions</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span className="text-gray-500 text-sm">Joined {userData.joined}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Contact Info</h3>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className={clsx(
                                        "p-2 rounded-xl transition-colors",
                                        isEditing ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10"
                                    )}
                                >
                                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold ml-1">Email Address</label>
                                    <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <input
                                            disabled={!isEditing}
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className="bg-transparent text-white w-full outline-none disabled:text-gray-400"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold ml-1">Phone Number</label>
                                    <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <input
                                            disabled={!isEditing}
                                            value={userData.phone}
                                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                            className="bg-transparent text-white w-full outline-none disabled:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                            <h3 className="text-xl font-bold text-white">Vehicle & Docs</h3>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-white/10 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                        <Truck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{userData.vehicle}</p>
                                        <p className="text-gray-500 text-sm font-mono mt-1">{userData.plate}</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-white/10 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-900/20 flex items-center justify-center shrink-0 border border-green-500/20">
                                        <CreditCard className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Driving License</p>
                                        <p className="text-green-400 text-xs font-bold mt-1 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> VERIFIED
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
                                + Add Another Vehicle
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </AuthGuard>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
    )
}
