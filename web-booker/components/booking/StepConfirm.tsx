'use client';

import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, User, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StepConfirm() {
    const { state, dispatch } = useBooking();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // 1. Create Vehicle
            let vehicleId = state.vehicle?.id;
            if (!vehicleId && state.vehicle) {
                // If we collected new vehicle info in StepVehicle
                const vehicleRes = await apiClient.post('/services/vehicles/', {
                    license_plate: state.vehicle.licensePlate,
                    make: state.vehicle.make,
                    model: state.vehicle.model,
                    fuel_type: 'PETROL' // Defaulting for now as we didn't add dropdown
                });
                vehicleId = vehicleRes.data.id;
            }

            // 2. Create Service Request
            const requestRes = await apiClient.post('/services/request/', {
                vehicle_id: vehicleId,
                service_type: state.serviceType?.toUpperCase(), // Backend expects uppercase
                latitude: state.location.coordinates?.lat || 19.0760, // Fallback dummy
                longitude: state.location.coordinates?.lng || 72.8777,
                customer_notes: `Pickup: ${state.location.pickup}. Dropoff: ${state.location.dropoff || 'N/A'}. Contact: ${state.contact.name} (${state.contact.phone})`
            });

            // Success
            dispatch({ type: 'RESET' });
            router.push(`/request/${requestRes.data.id}`);

        } catch (error) {
            console.error("Booking failed:", error);
            alert("Failed to create booking. Please ensure you are logged in.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const isValid = state.contact.name && state.contact.phone;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-xl mx-auto"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold">Review & Confirm</h2>
                <p className="text-muted-foreground mt-2">Almost done. Please review your details.</p>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="bg-primary/5 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-primary">Service</p>
                            <p className="text-lg font-bold capitalize">{state.serviceType?.replace('_', ' ')}</p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-1">
                            <p className="text-sm text-muted-foreground">Pickup Location</p>
                            <p className="font-medium">{state.location.pickup}</p>
                        </div>
                        {state.location.dropoff && (
                            <div className="grid grid-cols-1 gap-1">
                                <p className="text-sm text-muted-foreground">Dropoff Location</p>
                                <p className="font-medium">{state.location.dropoff}</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <h4 className="font-medium">Contact Details</h4>
                        <div className="space-y-3">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Your Name"
                                    className="pl-9"
                                    value={state.contact.name}
                                    onChange={(e) => dispatch({ type: 'SET_CONTACT', payload: { name: e.target.value } })}
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Phone Number"
                                    className="pl-9"
                                    type="tel"
                                    value={state.contact.phone}
                                    onChange={(e) => dispatch({ type: 'SET_CONTACT', payload: { phone: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={handleBack}>
                    Back
                </Button>
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90"
                >
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Booking"}
                </Button>
            </div>
        </motion.div>
    );
}
