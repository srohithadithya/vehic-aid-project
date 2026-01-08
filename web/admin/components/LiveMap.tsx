'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Location {
    lat: number;
    lng: number;
}

interface VehicleMarker {
    id: string;
    location: Location;
    type: 'TOW' | 'MECHANIC' | 'FUEL' | 'LOCKOUT';
    status: 'AVAILABLE' | 'BUSY';
}

interface LiveMapProps {
    vehicles?: VehicleMarker[];
    center?: Location;
    zoom?: number;
}

const DEFAULT_CENTER = { lat: 19.0760, lng: 72.8777 }; // Mumbai
const DEFAULT_ZOOM = 12;

export default function LiveMap({
    vehicles = [],
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM
}: LiveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);

    // 1. Initialize and Load Google Maps
    useEffect(() => {
        const initMap = () => {
            if (!mapRef.current) return;

            const mapInstance = new google.maps.Map(mapRef.current, {
                center: center,
                zoom: zoom,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                    },
                ],
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
            });

            setMap(mapInstance);
        };

        const loadGoogleMaps = () => {
            if (window.google?.maps) {
                initMap();
                return;
            }

            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || ''}`;
            script.async = true;
            script.defer = true;
            script.onload = initMap;
            document.head.appendChild(script);
        };

        loadGoogleMaps();
    }, [center, zoom]);


    // 3. Update Markers when vehicles change
    useEffect(() => {
        if (!map) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add new markers
        vehicles.forEach(vehicle => {
            const markerColor = vehicle.status === 'AVAILABLE' ? 'green' : 'red';
            // Simple symbol marker for now
            const marker = new google.maps.Marker({
                position: vehicle.location,
                map: map,
                title: `${vehicle.type} - ${vehicle.status}`,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: markerColor,
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: 'white',
                },
            });
            markersRef.current.push(marker);
        });

    }, [map, vehicles]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <div ref={mapRef} className="w-full h-full min-h-[400px] bg-gray-100" />

            {/* Overlay for Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100 max-w-xs"
            >
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Live Fleet Status</h3>
                <div className="flex gap-4 text-xs text-gray-600">
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        Available: {vehicles.filter(v => v.status === 'AVAILABLE').length}
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                        Busy: {vehicles.filter(v => v.status === 'BUSY').length}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
