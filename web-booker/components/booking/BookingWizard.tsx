'use client';

import { useBooking } from '@/context/BookingContext';
import { AnimatePresence } from 'framer-motion';
import StepService from './StepService';
import StepLocation from './StepLocation';
import StepVehicle from './StepVehicle'; // Added this import
import StepConfirm from './StepConfirm';

export default function BookingWizard() {
    const { state } = useBooking();

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 md:px-0">
            {/* Progress Indicator */}
            <div className="mb-8 flex items-center justify-center space-x-2">
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`h-2.5 rounded-full transition-all duration-300 ${step <= state.step ? 'w-12 bg-primary' : 'w-4 bg-muted'
                            }`}
                    />
                ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {state.step === 1 && <StepService key="step1" />}
                    {state.step === 2 && <StepVehicle key="step2" />}
                    {state.step === 3 && <StepLocation key="step3" />}
                    {state.step === 4 && <StepConfirm key="step4" />}
                </AnimatePresence>
            </div>
        </div>
    );
}
