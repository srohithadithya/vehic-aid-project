
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Wrench, Truck, CreditCard, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const steps = [
    { id: 1, title: 'Location', icon: MapPin },
    { id: 2, title: 'Service', icon: Wrench },
    { id: 3, title: 'Vehicle', icon: Truck },
    { id: 4, title: 'Review', icon: CreditCard },
];

export default function ServiceRequestWizard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        serviceType: searchParams.get('type') || 'TOWING',
        vehicleId: '',
        latitude: 12.9716, // Default to Bangalore for MVP
        longitude: 77.5946,
        notes: '',
    });

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await apiClient.post('/services/request/', {
                service_type: formData.serviceType,
                latitude: formData.latitude,
                longitude: formData.longitude,
                customer_notes: formData.notes,
                // vehicle_id: formData.vehicleId 
                // For MVP we might need to create a vehicle first or pick one. 
                // Omitting complexity for this snippet.
            });
            // Show success state
            router.push('/dashboard');
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to book service. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-primary -z-10 transform -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isActive = step.id <= currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center bg-neutral-50 px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>{step.title}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Wizard Content */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex flex-col"
                >
                    <div className="flex-1">
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Where are you stuck?</h2>
                                <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center text-gray-400">
                                        <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                        <p>Map Integration Placeholder</p>
                                        <p className="text-xs mt-1">Lat: {formData.latitude}, Lng: {formData.longitude}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">What service do you need?</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {['TOWING', 'FUEL', 'JUMPSTART', 'LOCKOUT'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData({ ...formData, serviceType: type })}
                                            className={`p-4 rounded-xl border-2 text-left transition ${formData.serviceType === type ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <span className="font-bold block mb-1">{type}</span>
                                            <span className="text-xs text-gray-500">Standard rates apply</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Which vehicle?</h2>
                                <div className="p-4 border rounded-xl bg-gray-50 text-gray-500 text-center">
                                    No vehicles saved. Using "Unknown Vehicle".
                                </div>
                                <textarea
                                    placeholder="Add notes for the provider (landmarks, vehicle color...)"
                                    className="w-full p-4 border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                                    rows={4}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>
                        )}
                        {currentStep === 4 && (
                            <div className="space-y-6 text-center">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-2xl font-bold">Ready to Request?</h2>
                                <p className="text-gray-500">
                                    A provider will be assigned immediately.
                                    Estimated arrival: <span className="text-gray-900 font-bold">15-20 mins</span>
                                </p>

                                <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Service</span>
                                        <span className="font-medium">{formData.serviceType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Location</span>
                                        <span className="font-medium">{formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t mt-8">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${currentStep === 1 ? 'opacity-0' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <ChevronLeft size={20} /> Back
                        </button>

                        {currentStep === steps.length ? (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-bold shadow-lg hover:bg-primary/90 transition transform active:scale-95 disabled:opacity-70"
                            >
                                {loading ? 'Confirming...' : 'Confirm Request'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg font-bold shadow-lg hover:bg-black transition transform active:scale-95"
                            >
                                Next <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
