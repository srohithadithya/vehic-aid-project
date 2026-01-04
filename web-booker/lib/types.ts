
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
