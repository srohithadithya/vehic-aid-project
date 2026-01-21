import { apiClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  UserProfile,
  ServiceRequest,
  ServiceQuote,
  Vehicle,
  Subscription,
  Job,
  Wallet,
} from './types';

// Auth Endpoints
export const authEndpoints = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>('/auth/login/', data),
  signup: (data: SignupRequest) => apiClient.post<SignupResponse>('/auth/register/', data),
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ access: string }>('/auth/token/refresh/', { refresh: refreshToken }),
  logout: () => apiClient.post('/auth/logout/'),
};

// User Endpoints
export const userEndpoints = {
  getProfile: () => apiClient.get<UserProfile>('/users/profile/'),
  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.put<UserProfile>('/users/profile/', data),
  updatePassword: (data: { old_password: string; new_password: string }) =>
    apiClient.post('/users/profile/change-password/', data),
};

// Vehicle Endpoints
export const vehicleEndpoints = {
  listVehicles: () => apiClient.get<Vehicle[]>('/vehicles/'),
  createVehicle: (data: Partial<Vehicle>) => apiClient.post<Vehicle>('/vehicles/', data),
  updateVehicle: (id: number, data: Partial<Vehicle>) =>
    apiClient.put<Vehicle>(`/vehicles/${id}/`, data),
  deleteVehicle: (id: number) => apiClient.delete(`/vehicles/${id}/`),
};

// Service Request Endpoints
export const serviceEndpoints = {
  listRequests: (status?: string) =>
    apiClient.get<ServiceRequest[]>('/services/request/', { params: { status } }),
  createRequest: (data: Partial<ServiceRequest>) =>
    apiClient.post<ServiceRequest>('/services/request/', data),
  getRequest: (id: number) => apiClient.get<ServiceRequest>(`/services/request/${id}/`),
  updateRequest: (id: number, data: Partial<ServiceRequest>) =>
    apiClient.patch<ServiceRequest>(`/services/request/${id}/`, data),
  cancelRequest: (id: number) => apiClient.post(`/services/request/${id}/cancel/`),
  getQuote: (data: {
    service_type: string;
    location_lat: number;
    location_lon: number;
    distance?: number;
  }) => apiClient.post<ServiceQuote>('/services/quote/', data),
};

// Provider Job Endpoints
export const jobEndpoints = {
  listAvailableJobs: () => apiClient.get<Job[]>('/services/provider/jobs/available/'),
  getJob: (id: number) => apiClient.get<Job>(`/services/provider/jobs/${id}/`),
  acceptJob: (id: number) => apiClient.post(`/services/provider/jobs/${id}/accept/`),
  rejectJob: (id: number) => apiClient.post(`/services/provider/jobs/${id}/reject/`),
  completeJob: (id: number, data: { completion_notes?: string; rating?: number }) =>
    apiClient.post(`/services/provider/jobs/${id}/complete/`, data),
  updateJobStatus: (id: number, status: string) =>
    apiClient.patch(`/services/provider/jobs/${id}/`, { status }),
  updateLocation: (data: { latitude: number; longitude: number; accuracy?: number }) =>
    apiClient.post('/services/provider/location-update/', data),
};

// Subscription Endpoints
export const subscriptionEndpoints = {
  listPlans: () => apiClient.get<Subscription[]>('/services/subscriptions/plans/'),
  getCurrentSubscription: () =>
    apiClient.get<Subscription>('/services/subscriptions/current/'),
  subscribe: (planId: number, paymentMethodId?: string) =>
    apiClient.post('/services/subscriptions/', { plan_id: planId, payment_method_id: paymentMethodId }),
  cancelSubscription: () => apiClient.post('/services/subscriptions/cancel/'),
};

// Wallet Endpoints
export const walletEndpoints = {
  getWallet: () => apiClient.get<Wallet>('/payments/wallet/'),
  addBalance: (amount: number, paymentMethodId?: string) =>
    apiClient.post('/payments/wallet/add/', { amount, payment_method_id: paymentMethodId }),
  withdraw: (amount: number, bankAccountId: number) =>
    apiClient.post('/payments/wallet/withdraw/', { amount, bank_account_id: bankAccountId }),
  getTransactionHistory: (limit: number = 20) =>
    apiClient.get('/payments/wallet/transactions/', { params: { limit } }),
};

// Chat Endpoints
export const chatEndpoints = {
  sendMessage: (chatId: number, message: string) =>
    apiClient.post(`/chat/${chatId}/messages/`, { text: message }),
  getMessages: (chatId: number, limit: number = 50) =>
    apiClient.get(`/chat/${chatId}/messages/`, { params: { limit } }),
  createChat: (userId: number) => apiClient.post('/chat/', { participant_id: userId }),
  listChats: () => apiClient.get('/chat/'),
};

// Earnings Endpoints (Provider)
export const earningsEndpoints = {
  getEarnings: (period: 'today' | 'week' | 'month' = 'today') =>
    apiClient.get('/services/provider/earnings/', { params: { period } }),
  getEarningsHistory: (limit: number = 50) =>
    apiClient.get('/services/provider/earnings/history/', { params: { limit } }),
  requestPayout: (amount: number, bankAccountId: number) =>
    apiClient.post('/services/provider/payout/', { amount, bank_account_id: bankAccountId }),
  getPayoutHistory: () => apiClient.get('/services/provider/payout/history/'),
};

// Ratings & Reviews
export const ratingEndpoints = {
  rateService: (serviceId: number, rating: number, review?: string) =>
    apiClient.post(`/services/request/${serviceId}/rate/`, { rating, review }),
  listRatings: (userId: number) => apiClient.get(`/users/${userId}/ratings/`),
};

export default apiClient;
