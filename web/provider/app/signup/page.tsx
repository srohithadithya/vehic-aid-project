'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ShieldCheck, User, Truck, FileText, ArrowRight, ArrowLeft, CheckCircle, Upload, Loader2,
    Fuel, GraduationCap, Wrench, Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export default function ProviderSignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: '', // FUEL, MECHANIC, TOW, STUDENT
        vehiclePlate: '',
        licenseNumber: '',
        kycDoc: null,
        mechanicCert: null,
        driverLicense: null
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    };

    const roles = [
        { id: 'TOW', label: 'Tow Truck Driver', icon: Car, color: 'text-orange-400', border: 'border-orange-500/50' },
        { id: 'MECHANIC', label: 'Pro Mechanic', icon: Wrench, color: 'text-blue-400', border: 'border-blue-500/50' },
        { id: 'FUEL', label: 'Fuel Delivery', icon: Fuel, color: 'text-yellow-400', border: 'border-yellow-500/50' },
        { id: 'STUDENT', label: 'Student Partner', icon: GraduationCap, color: 'text-green-400', border: 'border-green-500/50' },
    ];

    const renderStepIndicator = () => (
        <div className="flex justify-center items-center space-x-4 mb-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                    <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                        step >= i
                            ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                            : 'bg-white/5 border-white/20 text-gray-500'
                    )}>
                        {step > i ? <CheckCircle className="w-5 h-5" /> : i}
                    </div>
                    {i < 3 && (
                        <div className={clsx(
                            "w-12 h-1 mx-2 rounded-full",
                            step > i ? 'bg-gradient-to-r from-purple-600 to-purple-800' : 'bg-white/10'
                        )} />
                    )}
                </div>
            ))}
        </div>
    );

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-black/80 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Application Received!</h2>
                    <p className="text-gray-300 mb-8">
                        Your profile is under verification. Once approved (approx. 24hrs), you will receive your <span className="text-purple-400 font-bold">Unique Provider ID</span> via email/SMS to access the mission control.
                    </p>
                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                        <p className="text-xs text-gray-500 uppercase font-mono mb-1">Application Ref</p>
                        <p className="text-xl font-mono text-white tracking-widest">PRO-{Math.floor(100000 + Math.random() * 900000)}</p>
                    </div>
                    <Link href="/login" className="block w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">
                        Return to Portal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-10">
            <div className="w-full max-w-3xl relative">
                {/* Background FX */}
                <div className="absolute inset-x-0 top-10 bottom-10 bg-gradient-to-br from-purple-600/10 via-blue-500/5 to-transparent rounded-3xl blur-3xl -z-10"></div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
                            <img src="/logo.png" alt="VehicAid Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Partner Registration
                        </h2>
                        <p className="text-gray-400 mt-2">Join the elite fleet of VehicAid responders.</p>
                    </div>

                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Personal & Role */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <User className="text-purple-400" /> Identity & Role
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {roles.map((role) => (
                                            <div
                                                key={role.id}
                                                onClick={() => setFormData({ ...formData, role: role.id })}
                                                className={clsx(
                                                    "cursor-pointer border rounded-2xl p-4 transition-all hover:bg-white/5",
                                                    formData.role === role.id
                                                        ? `bg-white/10 ${role.border} ring-1 ring-inset`
                                                        : "border-white/10 bg-transparent"
                                                )}
                                            >
                                                <role.icon className={clsx("w-8 h-8 mb-2", role.color)} />
                                                <div className="font-semibold text-white text-sm">{role.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Full Legal Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Mobile Number"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <input
                                        required
                                        type="password"
                                        placeholder="Create Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </motion.div>
                            )}

                            {/* STEP 2: Vehicle Details */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Truck className="text-green-400" /> Vehicle Information
                                    </h3>

                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-200 text-sm flex gap-3">
                                        <Truck className="w-5 h-5 shrink-0" />
                                        <p>Ensure your vehicle meets the safety standards for your selected role ({formData.role || 'Partner'}).</p>
                                    </div>

                                    <input
                                        required
                                        type="text"
                                        placeholder="Vehicle Registration Number (e.g. KA-01-AB-1234)"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none uppercase tracking-wider text-lg"
                                        value={formData.vehiclePlate}
                                        onChange={e => setFormData({ ...formData, vehiclePlate: e.target.value })}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Vehicle Model"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Color"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Documents & Verification */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <FileText className="text-blue-400" /> KYC & Certification
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="border border-dashed border-white/20 rounded-xl p-6 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">KYC Document</p>
                                                    <p className="text-sm text-gray-500">Aadhar / PAN Card</p>
                                                </div>
                                            </div>
                                            <Upload className="w-5 h-5 text-gray-600 group-hover:text-white" />
                                        </div>

                                        <div className="border border-dashed border-white/20 rounded-xl p-6 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-400">
                                                    <Truck className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">Driving License</p>
                                                    <p className="text-sm text-gray-500">Commercial / Private DL</p>
                                                </div>
                                            </div>
                                            <Upload className="w-5 h-5 text-gray-600 group-hover:text-white" />
                                        </div>

                                        {formData.role === 'MECHANIC' && (
                                            <div className="border border-dashed border-white/20 rounded-xl p-6 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer animate-in fade-in slide-in-from-bottom-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-400">
                                                        <Wrench className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">Mechanic Certificate</p>
                                                        <p className="text-sm text-gray-500">Local Provider / Trade Cert</p>
                                                    </div>
                                                </div>
                                                <Upload className="w-5 h-5 text-gray-600 group-hover:text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-xs text-gray-500 text-center px-4">
                                        By submitting, you agree to background verification. False information may lead to blacklisting.
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-4 mt-10">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    Next Step <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Submit Application"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
