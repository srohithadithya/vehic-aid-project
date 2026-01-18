'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Car, MapPin, Wrench, Fuel, Truck, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

interface Vehicle {
    id: number;
    license_plate: string;
    make: string;
    model: string;
}

import { LocationPicker } from '@/components/LocationPicker';

const SERVICE_TYPES = [
    { id: 'TOWING', label: 'Towing Service', icon: Truck, description: 'Includes 5km tow. Then ₹20/km.', price: 'Starts @ ₹199' },
    { id: 'MECHANIC', label: 'On-site Mechanic', icon: Wrench, description: 'Includes 5km arrival. Then ₹15/km.', price: 'Starts @ ₹79' },
    { id: 'FUEL', label: 'Fuel Delivery', icon: Fuel, description: 'Includes 5km arrival. Then ₹15/km.', price: 'Starts @ ₹49' },
    { id: 'LOCKOUT', label: 'Lockout Service', icon: AlertTriangle, description: 'Includes 5km arrival. Then ₹15/km.', price: 'Starts @ ₹149' },
];

export default function BookServicePage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState<{ lat: number, lng: number, address: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await apiClient.get('/vehicles/');
            setVehicles(response.data);
            if (response.data.length > 0) {
                setSelectedVehicle(response.data[0].id); // Default to first vehicle
            }
        } catch (error) {
            console.error('Failed to fetch vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle || !selectedService || !location) {
            alert("Please select a vehicle, service, and location.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await apiClient.post('/request/', {
                vehicle_id: selectedVehicle,
                service_type: selectedService,
                customer_notes: `${notes} [Loc: ${location.address}]`,
                latitude: location.lat,
                longitude: location.lng
            });

            // Redirect to status page
            router.push(`/request/${response.data.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to submit request. Please try again.");
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request Assistance</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Tell us what happened and where you are.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Vehicle Selection */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Car className="w-5 h-5 mr-2 text-blue-500" /> Select Vehicle
                        </h2>

                        {vehicles.length === 0 ? (
                            <div className="text-center py-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <p className="text-sm text-gray-500 mb-2">No vehicles found.</p>
                                <button type="button" className="text-blue-600 text-sm font-medium">Add a vehicle first</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {vehicles.map(v => (
                                    <div
                                        key={v.id}
                                        onClick={() => setSelectedVehicle(v.id)}
                                        className={clsx(
                                            "cursor-pointer rounded-lg border p-4 transition-all",
                                            selectedVehicle === v.id
                                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600"
                                                : "border-gray-200 dark:border-zinc-700 hover:border-blue-400"
                                        )}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-gray-200">{v.make} {v.model}</div>
                                        <div className="text-sm text-gray-500">{v.license_plate}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Service Type Selection */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Wrench className="w-5 h-5 mr-2 text-blue-500" /> Service Type
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {SERVICE_TYPES.map((service) => {
                                const Icon = service.icon;
                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        className={clsx(
                                            "cursor-pointer rounded-lg border p-4 flex items-start space-x-4 transition-all",
                                            selectedService === service.id
                                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600"
                                                : "border-gray-200 dark:border-zinc-700 hover:border-blue-400"
                                        )}
                                    >
                                        <div className={clsx("p-2 rounded-lg", selectedService === service.id ? "bg-blue-200 dark:bg-blue-800" : "bg-gray-100 dark:bg-zinc-800")}>
                                            <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-200">{service.label}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                                            <p className="text-xs font-semibold text-green-600 mt-1">{service.price}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Location Selection - Interactive Map */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Location & Notes
                        </h2>

                        <div className="mb-4">
                            <LocationPicker
                                onLocationSelect={(lat, lng, address) => {
                                    setLocation({ lat, lng, address });
                                    // Auto-append address to notes if empty
                                    if (!notes) setNotes(`At: ${address || 'Selected Location'}`);
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes</label>
                            <textarea
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                                placeholder="Describe the issue (e.g., flat tire on rear left, engine smoking...)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"

                        disabled={submitting || !selectedVehicle || !selectedService || !location}
                        className="w-full rounded-lg bg-blue-600 px-3.5 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {submitting ? 'Submitting Request...' : 'Send Help Request'}
                    </button>

                </form>
            </div>
        </div>
    );
}
