'use client';

import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

export default function StepLocation() {
    const { state, dispatch } = useBooking();

    const handleNext = () => {
        if (state.location.pickup) {
            dispatch({ type: 'NEXT_STEP' });
        }
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-xl mx-auto"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold">Where are you?</h2>
                <p className="text-muted-foreground mt-2">Enter your pickup location so we can reach you.</p>
            </div>

            <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="123 Main St, City..."
                            className="pl-9"
                            value={state.location.pickup}
                            onChange={(e) => dispatch({ type: 'SET_LOCATION', payload: { pickup: e.target.value } })}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => alert("Geolocation mocked: Coordinates set.")}>
                        <Navigation className="w-3 h-3 mr-2" />
                        Use Current Location
                    </Button>
                </div>

                {(state.serviceType === 'basic_tow' || state.serviceType === 'flatbed_tow') && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Drop-off Destination</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Mechanic, Home, etc..."
                                className="pl-9"
                                value={state.location.dropoff || ''}
                                onChange={(e) => dispatch({ type: 'SET_LOCATION', payload: { dropoff: e.target.value } })}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!state.location.pickup}
                >
                    Review Booking
                </Button>
            </div>
        </motion.div>
    );
}
