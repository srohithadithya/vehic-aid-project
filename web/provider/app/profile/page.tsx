'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { apiClient } from '@/lib/api';
import {
    User, Mail, Phone, Truck, Shield, Star,
    Edit, Save, Award, MapPin, Calendar, CreditCard
} from 'lucide-react';
import { clsx } from "clsx";
import AuthGuard from '@/components/AuthGuard';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: "Loading...",
        title: "Provider",
        id: "---",
        email: "---",
        phone: "---",
        vehicle: "---",
        plate: "---",
        joined: "---",
        rating: 0,
        jobs: 0,
        bankAccount: "---",
        bankIfsc: "---"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get('/users/profile/');
                const u = response.data; // Response is the user object directly
                setUserData({
                    name: u.full_name,
                    title: u.service_types && u.service_types.length > 0 ? `${u.service_types[0].replace('_', ' ')} Expert` : "Authorized Provider",
                    id: u.provider_id || `PRO-${u.id.toString().padStart(6, '0')}`,
                    email: u.email,
                    phone: u.phone,
                    vehicle: u.is_provider ? "Service Vehicle" : "N/A",
                    plate: u.vehicles && u.vehicles.length > 0 ? u.vehicles[0] : "Verified",
                    joined: "Jan 2024",
                    rating: u.average_rating || 5.0,
                    jobs: u.jobs_completed || 0,
                    serverTime: u.server_time,
                    bankAccount: u.bank_account || "Pending",
                    bankIfsc: u.bank_ifsc || "Pending"
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

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
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Email Address</label>
                                        {(userData as any).serverTime && (
                                            <span className="text-[10px] text-green-500/60 font-mono">
                                                SYNCED: {new Date((userData as any).serverTime).toLocaleTimeString()}
                                            </span>
                                        )}
                                    </div>
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
                        </div>

                        {/* Banking Info */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 md:col-span-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" /> Banking & Payout Settings
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-bold ml-1">Account Number</label>
                                    <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-lg tracking-wider">
                                        {userData.bankAccount.replace(/.(?=.{4})/g, '•')}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-bold ml-1">IFSC Code</label>
                                    <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5 font-mono">
                                        {userData.bankIfsc}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                * Your payouts are automatically settled daily to this account via Razorpay X.
                            </p>
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
