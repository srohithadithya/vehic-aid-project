export interface User {
    id: number;
    username: string;
    email: string;
    phone_number: string;
    is_service_booker: boolean;
    is_service_provider: boolean;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

export type ServiceStatus = 'PENDING_DISPATCH' | 'DISPATCHED' | 'ARRIVED' | 'SERVICE_IN_PROGRESS' | 'QUOTE_PENDING' | 'COMPLETED' | 'CANCELLED';

export interface ServiceRequest {
    id: number;
    service_type: string;
    status: ServiceStatus;
    priority: string;
    created_at: string;
    customer_notes?: string;
    dynamic_total?: number;
    provider_location?: {
        latitude: number;
        longitude: number;
    };
}
export type ServiceType = 'basic_tow' | 'flatbed_tow' | 'mechanic' | 'fuel_delivery' | 'battery_jump' | 'lockout' | 'tire_change' | 'TOWING' | 'FUEL' | 'JUMPSTART' | 'LOCKOUT' | 'FLAT_TYRE';

export interface LocationState {
    pickup: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface VehicleState {
    id?: number;
    make: string;
    model: string;
    licensePlate: string;
    fuelType?: string;
}

export interface BookingState {
    step: number;
    serviceType: ServiceType | null;
    location: LocationState;
    vehicle: VehicleState | null;
}

export type Action =
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'SET_SERVICE'; payload: ServiceType }
    | { type: 'SET_LOCATION'; payload: Partial<LocationState> }
    | { type: 'SET_VEHICLE'; payload: Partial<VehicleState> }
    | { type: 'RESET' };

export interface IoTDevice {
    device_id: string;
    is_active: boolean;
    battery: number;
    latitude: number | null;
    longitude: number | null;
    last_signal: string;
}
