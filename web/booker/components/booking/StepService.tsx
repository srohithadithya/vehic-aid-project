'use client';

import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Car, Wrench, Fuel, Battery, Lock, Disc } from 'lucide-react';
import { ServiceType } from '@/lib/types';
import { cn } from '@/lib/utils';

const services: { id: ServiceType; title: string; icon: React.ComponentType<{ className?: string }>; desc: string; price: string }[] = [
    { id: 'basic_tow', title: 'Basic Towing', icon: Car, desc: 'Standard towing. Includes 5km distance.', price: '₹199 + ₹20/km (after 5km)' },
    { id: 'flatbed_tow', title: 'Flatbed Towing', icon: Car, desc: 'Safe for AWD/Luxury. Includes 5km distance.', price: '₹349 + ₹25/km (after 5km)' },
    { id: 'mechanic', title: 'Mobile Mechanic', icon: Wrench, desc: 'Minor repairs. Includes 5km dedicated travel.', price: '₹79 + ₹15/km (after 5km)' },
    { id: 'fuel_delivery', title: 'Fuel Delivery', icon: Fuel, desc: 'Delivery fee. Includes 5km dedicated travel.', price: '₹49 + ₹15/km (after 5km)' },
    { id: 'battery_jump', title: 'Battery Jump', icon: Battery, desc: 'Jump start. Includes 5km dedicated travel.', price: '₹119 + ₹15/km (after 5km)' },
    { id: 'lockout', title: 'Lockout Service', icon: Lock, desc: 'Unlock service. Includes 5km dedicated travel.', price: '₹149 + ₹15/km (after 5km)' },
    { id: 'tire_change', title: 'Tire Change', icon: Disc, desc: 'Stepney change. Includes 5km dedicated travel.', price: '₹99 + ₹15/km (after 5km)' },
];

export default function StepService() {
    const { state, dispatch } = useBooking();

    const handleSelect = (id: ServiceType) => {
        dispatch({ type: 'SET_SERVICE', payload: id });
    };

    const handleNext = () => {
        if (state.serviceType) {
            dispatch({ type: 'NEXT_STEP' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                    Select Your Service
                </h2>
                <p className="text-muted-foreground mt-2">Choose the assistance you need right now.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card
                            className={cn(
                                "cursor-pointer transition-all border-2 hover:border-primary/50 h-full",
                                state.serviceType === service.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-transparent bg-muted/50"
                            )}
                            onClick={() => handleSelect(service.id)}
                        >
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className={cn(
                                    "p-4 rounded-full bg-background shadow-sm",
                                    state.serviceType === service.id ? "text-primary" : "text-muted-foreground"
                                )}>
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                                </div>
                                <div className="mt-auto pt-2">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-background border">
                                        Starts at {service.price}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-end pt-6">
                <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!state.serviceType}
                    className="w-full md:w-auto"
                >
                    Continue to Location
                </Button>
            </div>
        </motion.div>
    );
}
