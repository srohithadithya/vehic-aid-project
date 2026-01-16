
export interface User {
    id: number;
    username: string;
    email: string;
    phone_number: string;
    is_service_booker: boolean;
    is_service_provider: boolean;
}

export interface ServiceBookerProfile {
    user: User;
    preferred_language: string;
    phone_number: string;
}

export interface Vehicle {
    id: number;
    license_plate: string;
    make: string;
    model: string;
    fuel_type: 'PETROL' | 'DIESEL' | 'EV';
    insurance_expiry?: string;
    puc_expiry?: string;
}

export interface IoTDevice {
    device_id: string;
    is_active: boolean;
    last_known_latitude: number | null;
    last_known_longitude: number | null;
    last_battery_level: number | null;
    last_signal_time: string;
}

export interface ServiceRequest {
    id: number;
    service_type: string;
    status: 'PENDING_DISPATCH' | 'DISPATCHED' | 'ARRIVED' | 'SERVICE_IN_PROGRESS' | 'QUOTE_PENDING' | 'COMPLETED' | 'CANCELLED';
    priority: string;
    created_at: string;
    customer_notes?: string;
    dynamic_total?: number;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

export type ServiceType = 'basic_tow' | 'flatbed_tow' | 'mechanic' | 'fuel_delivery' | 'battery_jump' | 'lockout' | 'tire_change' | 'TOWING' | 'FUEL' | 'JUMPSTART' | 'LOCKOUT' | 'FLAT_TYRE';

export interface LocationState {
    pickup: string;
    dropoff?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    address?: string;
}

export interface VehicleState {
    id?: number;
    make: string;
    model: string;
    licensePlate: string;
    year?: string;
    color?: string;
}

export interface ContactState {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
}

export interface BookingState {
    step: number;
    serviceType: ServiceType | null;
    location: LocationState;
    vehicle: VehicleState | null;
    contact: ContactState;
}

export type Action =
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'SET_SERVICE'; payload: ServiceType }
    | { type: 'SET_LOCATION'; payload: Partial<LocationState> }
    | { type: 'SET_VEHICLE'; payload: Partial<VehicleState> }
    | { type: 'SET_CONTACT'; payload: Partial<ContactState> }
    | { type: 'RESET' };

export interface ChatMessage {
    id: number;
    request: number;
    sender: number;
    sender_name: string;
    message: string;
    is_read: boolean;
    is_me: boolean;
    created_at: string;
}

export interface ProviderJob extends ServiceRequest {
    booker_name: string;
    booker_phone: string;
    vehicle_details: string;
    latitude: number;
    longitude: number;
}
