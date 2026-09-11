'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Car } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        license_plate: '',
        fuel_type: 'PETROL',
        vehicle_type: 'FOUR_WHEELER'
    });

    const vehicleTypes = [
        { value: 'TWO_WHEELER', label: 'Two Wheeler', icon: '🏍️', desc: 'Bike/Scooter' },
        { value: 'THREE_WHEELER', label: 'Three Wheeler', icon: '🛺', desc: 'Auto Rickshaw' },
        { value: 'FOUR_WHEELER', label: 'Four Wheeler', icon: '🚗', desc: 'Car/Sedan' },
        { value: 'SUV', label: 'SUV', icon: '🚙', desc: 'Sport Utility Vehicle' },
        { value: 'VAN', label: 'Van', icon: '🚐', desc: 'Minivan/Cargo' },
        { value: 'TRUCK', label: 'Truck', icon: '🚛', desc: 'Commercial Vehicle' },
    ];

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await apiClient.get('/services/vehicles/');
            setVehicles(response.data);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    };

    const saveVehicle = async () => {
        try {
            await apiClient.post('/services/vehicles/', formData);
            setShowForm(false);
            setFormData({ make: '', model: '', license_plate: '', fuel_type: 'PETROL', vehicle_type: 'FOUR_WHEELER' });
            fetchVehicles();
        } catch (error) {
            console.error('Failed to save vehicle:', error);
        }
    };

    const deleteVehicle = async (id: number) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            await apiClient.delete(`/services/vehicles/${id}/`);
            fetchVehicles();
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
        }
    };

    const getVehicleIcon = (type: string) => {
        const vehicle = vehicleTypes.find(v => v.value === type);
        return vehicle?.icon || '🚗';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Vehicles</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                </Button>
            </div>

            {/* Add Vehicle Form */}
            {showForm && (
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Vehicle</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {vehicleTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, vehicle_type: type.value })}
                                        className={`p-4 border-2 rounded-lg transition-all ${formData.vehicle_type === type.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{type.icon}</div>
                                        <div className="text-sm font-semibold">{type.label}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{type.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Make</label>
                            <input
                                type="text"
                                value={formData.make}
                                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                placeholder="e.g., Toyota"
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Model</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                placeholder="e.g., Camry"
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">License Plate</label>
                            <input
                                type="text"
                                value={formData.license_plate}
                                onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                                placeholder="e.g., MH01AB1234"
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Fuel Type</label>
                            <select
                                value={formData.fuel_type}
                                onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            >
                                <option value="PETROL">Petrol</option>
                                <option value="DIESEL">Diesel</option>
                                <option value="EV">Electric Vehicle</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button onClick={saveVehicle}>Save Vehicle</Button>
                        <Button onClick={() => setShowForm(false)} variant="outline">Cancel</Button>
                    </div>
                </Card>
            )}

            {/* Vehicles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle: any) => (
                    <Card key={vehicle.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Car className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{vehicle.make} {vehicle.model}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{getVehicleIcon(vehicle.vehicle_type)} {vehicle.vehicle_type?.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteVehicle(vehicle.id)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">License Plate:</span>
                                <span className="font-medium">{vehicle.license_plate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Fuel:</span>
                                <span className="font-medium">{vehicle.fuel_type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Service History:</span>
                                <span className="font-medium text-blue-600">{vehicle.service_count || 0} services</span>
                            </div>
                        </div>

                        <Button className="w-full mt-4" variant="outline">
                            View Service History
                        </Button>
                    </Card>
                ))}
            </div>

            {vehicles.length === 0 && !showForm && (
                <Card className="p-12 text-center">
                    <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No vehicles added yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Add your first vehicle to get started with VehicAid services
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Vehicle
                    </Button>
                </Card>
            )}
        </div>
    );
}
