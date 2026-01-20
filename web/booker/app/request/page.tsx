
'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Wrench, Truck, CreditCard, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const steps = [
    { id: 1, title: 'Service', icon: Wrench },
    { id: 2, title: 'Vehicle', icon: Truck },
    { id: 3, title: 'Location', icon: MapPin },
    { id: 4, title: 'Review', icon: CreditCard },
];

const PRICING_MAP: Record<string, Record<string, number>> = {
    'TWO_WHEELER': { 'TOWING': 199, 'FUEL': 49, 'JUMPSTART': 149, 'LOCKOUT': 149, 'MECHANIC': 99 },
    'THREE_WHEELER': { 'TOWING': 249, 'FUEL': 49, 'JUMPSTART': 199, 'LOCKOUT': 199, 'MECHANIC': 149 },
    'FOUR_WHEELER': { 'TOWING': 249, 'FUEL': 49, 'JUMPSTART': 249, 'LOCKOUT': 299, 'MECHANIC': 349 },
    'SUV': { 'TOWING': 299, 'FUEL': 49, 'JUMPSTART': 249, 'LOCKOUT': 299, 'MECHANIC': 349 },
    'VAN': { 'TOWING': 349, 'FUEL': 49, 'JUMPSTART': 299, 'LOCKOUT': 299, 'MECHANIC': 399 },
    'TRUCK': { 'TOWING': 499, 'FUEL': 69, 'JUMPSTART': 349, 'LOCKOUT': 299, 'MECHANIC': 399 },
};

function ServiceRequestWizardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [vehicles, setVehicles] = useState([]);

    const [formData, setFormData] = useState({
        serviceType: searchParams.get('type') || 'TOWING',
        vehicleId: '',
        latitude: 12.9716, // Default to Bangalore for MVP
        longitude: 77.5946,
        notes: '',
    });

    React.useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await apiClient.get('/services/vehicles/');
                setVehicles(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, vehicleId: response.data[0].id }));
                }
            } catch (error) {
                console.error("Failed to fetch vehicles", error);
            }
        };
        if (user) fetchVehicles();
    }, [user]);

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
                vehicle_id: formData.vehicleId,
            });
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
                                <div className="text-center mb-6">
                                    <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Select Service</h2>
                                    <p className="text-gray-500 mt-2">Choose the assistance you need today.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {['TOWING', 'FUEL', 'JUMPSTART', 'LOCKOUT', 'MECHANIC'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData({ ...formData, serviceType: type })}
                                            className={`p-4 rounded-xl border-2 text-left transition ${formData.serviceType === type ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold block text-lg">{type}</span>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-gray-400 block uppercase">Starts at</span>
                                                    <span className="text-sm font-bold text-primary">₹{PRICING_MAP['TWO_WHEELER'][type] || 99}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 block leading-tight">Base charge for standard assistance.</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold">Select Vehicle for <span className="text-primary">{formData.serviceType}</span></h2>
                                    <p className="text-gray-500 text-sm">Prices are calculated based on vehicle type.</p>
                                </div>
                                {vehicles.length > 0 ? (
                                    <div className="grid gap-3">
                                        {vehicles.map((v: any) => {
                                            const price = PRICING_MAP[v.vehicle_type]?.[formData.serviceType] || 'Variable';
                                            return (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setFormData({ ...formData, vehicleId: v.id })}
                                                    className={`p-4 rounded-xl border-2 text-left transition flex justify-between items-center ${formData.vehicleId === v.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'}`}
                                                >
                                                    <div>
                                                        <span className="font-bold text-lg block">{v.make} {v.model}</span>
                                                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 font-medium border border-gray-200">{v.vehicle_type.replace('_', ' ')}</span>
                                                        <p className="text-[10px] text-gray-400 mt-1">{v.license_plate}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-lg font-black text-primary">₹{price}</span>
                                                        <span className="block text-[10px] text-gray-400">Base Charge</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 border rounded-xl bg-gray-50 text-gray-500 text-center">
                                        No vehicles found. Please add a vehicle in Settings.
                                    </div>
                                )}
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Where are you stuck?</h2>
                                <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center text-gray-400">
                                        <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                        <p>Map Integration Placeholder</p>
                                        <p className="text-xs mt-1">Lat: {formData.latitude}, Lng: {formData.longitude}</p>
                                    </div>
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
                                    Initial Service Charge: <span className="text-primary font-black text-xl">₹{(() => {
                                        const v: any = vehicles.find((v: any) => v.id === formData.vehicleId);
                                        return PRICING_MAP[v?.vehicle_type]?.[formData.serviceType] || 0;
                                    })()}</span>
                                </p>
                                <p className="text-xs text-gray-400">* Final fare may include spare parts and distance charges.</p>
                            </div>
                        )}
                    </div>

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

export default function ServiceRequestWizard() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ServiceRequestWizardContent />
        </Suspense>
    );
}
