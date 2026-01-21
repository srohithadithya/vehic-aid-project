// Auth Types
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: User;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: 'CUSTOMER' | 'PROVIDER';
  first_name?: string;
  last_name?: string;
}

export interface SignupResponse {
  user: User;
  tokens: AuthTokens;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: 'CUSTOMER' | 'PROVIDER';
  profile_picture?: string;
  is_verified: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  bio?: string;
  rating?: number;
  total_reviews?: number;
  verified_documents?: string[];
}

// Vehicle Types
export type VehicleType =
  | 'TWO_WHEELER'
  | 'THREE_WHEELER'
  | 'FOUR_WHEELER'
  | 'SUV'
  | 'VAN'
  | 'TRUCK';

export interface Vehicle {
  id: number;
  user_id: number;
  vehicle_type: VehicleType;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  color?: string;
  mileage?: number;
  last_service_date?: string;
  insurance_expiry?: string;
  is_default: boolean;
  created_at: string;
}

// Service Request Types
export type ServiceType =
  | 'TOWING'
  | 'MECHANIC'
  | 'FUEL'
  | 'BATTERY'
  | 'TIRE'
  | 'CLEANING'
  | 'ACCESSORIES'
  | 'INSURANCE'
  | 'VEHICLE_EXCHANGE'
  | 'PLACEMENT';

export type ServiceStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceRequest {
  id: number;
  customer_id: number;
  provider_id?: number;
  vehicle_id: number;
  service_type: ServiceType;
  description: string;
  status: ServiceStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimated_price: number;
  final_price?: number;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface ServiceQuote {
  service_type: ServiceType;
  base_price: number;
  distance_charge: number;
  total_estimated_price: number;
  currency: string;
}

// Job Types (Provider View)
export interface Job {
  id: number;
  service_request_id: number;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  service_type: ServiceType;
  description: string;
  status: ServiceStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimated_earnings: number;
  estimated_duration_minutes: number;
  distance_km: number;
  customer_rating?: number;
  created_at: string;
}

// Provider Types
export interface Provider extends User {
  service_types: ServiceType[];
  years_of_experience: number;
  average_rating: number;
  total_jobs_completed: number;
  total_earnings: number;
  is_available: boolean;
  current_location?: {
    latitude: number;
    longitude: number;
  };
}

// Subscription Types
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ELITE';

export interface Subscription {
  id: number;
  plan_name: SubscriptionPlan;
  price: number;
  validity_days: number;
  description: string;
  features: string[];
  discount_percentage: number;
  priority_support: boolean;
  free_towing_km?: number;
  vehicle_exchange_available: boolean;
  active_for_user?: boolean;
  starts_at?: string;
  expires_at?: string;
}

// Wallet Types
export interface Wallet {
  balance: number;
  currency: string;
  last_updated: string;
}

export interface Transaction {
  id: number;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  reference_id: string;
  created_at: string;
}

// Chat Types
export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  text: string;
  image_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Chat {
  id: number;
  participant_1_id: number;
  participant_2_id: number;
  last_message?: ChatMessage;
  unread_count: number;
  created_at: string;
}

// Invoice Types
export interface Invoice {
  id: number;
  service_request_id: number;
  customer_id: number;
  provider_id: number;
  service_charge: number;
  distance_charge: number;
  spare_parts_charge: number;
  platform_fee: number;
  tax: number;
  total_amount: number;
  payment_method: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  created_at: string;
}

// Error Response
export interface ErrorResponse {
  detail?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
