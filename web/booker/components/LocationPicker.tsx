'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    initialLat?: number;
    initialLng?: number;
}

declare global {
    interface Window {
        google: any;
    }
}

export function LocationPicker({ onLocationSelect, initialLat = 19.0760, initialLng = 72.8777 }: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentAddress, setCurrentAddress] = useState('');
    const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);

    useEffect(() => {
        loadGoogleMaps();
    }, []);

    const loadGoogleMaps = () => {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
            initializeMap();
            return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Replace with your API key
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initializeMap();
        script.onerror = () => {
            console.error('Failed to load Google Maps');
            setLoading(false);
        };
        document.head.appendChild(script);
    };

    const initializeMap = () => {
        if (!mapRef.current) return;

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: initialLat, lng: initialLng },
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        const markerInstance = new window.google.maps.Marker({
            position: { lat: initialLat, lng: initialLng },
            map: mapInstance,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
        });

        // Add click listener to map
        mapInstance.addListener('click', (e: any) => {
            updateMarkerPosition(e.latLng, markerInstance, mapInstance);
        });

        // Add drag listener to marker
        markerInstance.addListener('dragend', (e: any) => {
            updateMarkerPosition(e.latLng, markerInstance, mapInstance);
        });

        setMap(mapInstance);
        setMarker(markerInstance);
        setLoading(false);

        // Get initial address
        getAddressFromLatLng(initialLat, initialLng);
    };

    const updateMarkerPosition = (latLng: any, markerInstance: any, mapInstance: any) => {
        const lat = latLng.lat();
        const lng = latLng.lng();

        markerInstance.setPosition(latLng);
        mapInstance.panTo(latLng);

        getAddressFromLatLng(lat, lng);
    };

    const getAddressFromLatLng = async (lat: number, lng: number) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
                { location: { lat, lng } },
                (results: any[], status: string) => {
                    if (status === 'OK' && results[0]) {
                        const address = results[0].formatted_address;
                        setCurrentAddress(address);
                        onLocationSelect(lat, lng, address);
                    } else {
                        setCurrentAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                    }
                }
            );
        } catch (error) {
            console.error('Geocoding error:', error);
            setCurrentAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setUsingCurrentLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const latLng = new window.google.maps.LatLng(lat, lng);

                if (marker && map) {
                    marker.setPosition(latLng);
                    map.panTo(latLng);
                    map.setZoom(16);
                    getAddressFromLatLng(lat, lng);
                }
                setUsingCurrentLocation(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your current location. Please select manually on the map.');
                setUsingCurrentLocation(false);
            }
        );
    };

    return (
        <div className="space-y-4">
            {/* Map Container */}
            <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 z-10">
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
                        </div>
                    </div>
                )}
                <div ref={mapRef} className="w-full h-[400px]" />
            </div>

            {/* Address Display & Controls */}
            <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Selected Location</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                            {currentAddress || 'Click on the map to select a location'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={usingCurrentLocation || loading}
                    className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {usingCurrentLocation ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Getting location...
                        </>
                    ) : (
                        <>
                            <MapPin className="w-4 h-4 mr-2" />
                            Use My Current Location
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Drag the marker or click on the map to adjust your location
                </p>
            </div>
        </div>
    );
}
