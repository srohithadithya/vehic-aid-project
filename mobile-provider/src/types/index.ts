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
    service_request: {
        id: number;
        service_type: string;
        customer_name: string;
        pickup_location: string;
        status: ServiceStatus;
        latitude: number;
        longitude: number;
    };
    status: 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
}
