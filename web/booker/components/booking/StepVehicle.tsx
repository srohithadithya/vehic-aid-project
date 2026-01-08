'use client';

import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Car, ChevronRight, ChevronLeft } from 'lucide-react';

export default function StepVehicle() {
    const { state, dispatch } = useBooking();

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({
            type: 'SET_VEHICLE',
            payload: { [name]: value }
        });
    };

    const vehicle = state.vehicle || { make: '', model: '', licensePlate: '' };
    const isValid = vehicle.make && vehicle.model && vehicle.licensePlate;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                    Vehicle Details
                </h2>
                <p className="text-muted-foreground mt-2">Tell us about the vehicle needing service.</p>
            </div>

            <Card className="border-primary/20 shadow-lg">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-primary mb-4">
                        <Car className="w-5 h-5" />
                        <span className="font-semibold">Vehicle Information</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="make">Make</Label>
                            <Input
                                id="make"
                                name="make"
                                placeholder="e.g. Toyota"
                                value={vehicle.make}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                name="model"
                                placeholder="e.g. Camry"
                                value={vehicle.model}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="licensePlate">License Plate</Label>
                            <Input
                                id="licensePlate"
                                name="licensePlate"
                                placeholder="e.g. MH-12-AB-1234"
                                value={vehicle.licensePlate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
                <Button variant="ghost" onClick={handleBack} className="flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!isValid}
                    className="flex items-center"
                >
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
}
