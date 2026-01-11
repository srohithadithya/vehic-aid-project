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

export interface JobAssignment {
    id: number;
    service_type: string;
    status: ServiceStatus;
    priority: string;
    latitude: number;
    longitude: number;
    customer_notes: string;
    booker_name: string;
    booker_phone: string;
    vehicle_details: string;
    created_at: string;
}
