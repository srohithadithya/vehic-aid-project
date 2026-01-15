'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, ArrowLeft, Lock, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';

interface Placement {
    id: number;
    status: string;
    destination_address: string;
    price: string;
    created_at: string;
}

export default function VehiclePlacementPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [placements, setPlacements] = useState<Placement[]>([]);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [destination, setDestination] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [placementRes, subRes] = await Promise.all([
                apiClient.get('/services/vehicle-placement/'),
                apiClient.get('/services/subscriptions/active/')
            ]);
            setPlacements(placementRes.data.results || placementRes.data || []);
            const sub = subRes.data;
            setHasSubscription(sub && sub.plan && sub.plan.name !== 'FREE');
        } catch (error) {
            console.log('Placement fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!destination) return;

        setSubmitting(true);
        try {
            await apiClient.post('/services/vehicle-placement/', {
                destination_address: destination
            });
            alert('Vehicle placement requested! A provider will contact you with pricing.');
            setDestination('');
            fetchData();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Could not request placement.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            case 'REQUESTED': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Hero Section */}
                <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                    <CardHeader className="text-center pb-2">
                        <Truck className="h-12 w-12 mx-auto mb-4" />
                        <CardTitle className="text-2xl">Vehicle Placement</CardTitle>
                        <CardDescription className="text-green-100">
                            After service is complete, we can move your vehicle to any location
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-green-50">
                        Home, office, or a preferred garage - you choose the destination.
                        Pricing is dynamic based on distance.
                    </CardContent>
                </Card>

                {/* Subscription Check */}
                {!loading && !hasSubscription && (
                    <Card className="mb-8 border-dashed">
                        <CardContent className="text-center py-8">
                            <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Subscription Required</h3>
                            <p className="text-gray-500 mb-4">
                                Vehicle placement requires a Standard or Premium subscription.
                            </p>
                            <Button onClick={() => router.push('/subscription')}>
                                View Plans
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Request Form */}
                {hasSubscription && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Request Placement</CardTitle>
                            <CardDescription>
                                Enter the destination where you want your vehicle moved
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="destination">Destination Address</Label>
                                    <div className="flex gap-2">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-2" />
                                        <Input
                                            id="destination"
                                            placeholder="e.g., Home, Office, or full address"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    💡 Pricing will be determined by the provider based on distance
                                </p>
                                <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting ? 'Requesting...' : 'Request Placement'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Placement History */}
                <h2 className="text-xl font-bold mb-4">Placement History</h2>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : placements.length === 0 ? (
                    <Card className="text-center py-8">
                        <CardContent>
                            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">No placements yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {placements.map((pl) => (
                            <Card key={pl.id}>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">Placement #{pl.id}</span>
                                        <Badge className={getStatusColor(pl.status)}>
                                            {pl.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Destination: {pl.destination_address}
                                    </p>
                                    <p className="text-sm font-medium mt-2">
                                        Price: ₹{pl.price}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
