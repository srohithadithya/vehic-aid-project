import axios from 'axios';
import { Alert } from 'react-native';

// NOTE: Use the host machine's IP (10.0.2.2 for Android Emulator) for development.
const BASE_URL = 'http://10.0.2.2:8000/api/v1/'; 

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
   // 10 second timeout for requests
});
export default apiInstance;

// --- API Interceptor (Authentication and Error Handling) ---
apiInstance.interceptors.request.use(async (config) => {
  // In a real app, JWT is retrieved from secure storage after provider logs in.
  const token = 'MOCK_PROVIDER_JWT_TOKEN'; // Replace with actual AsyncStorage/SecureStore retrieval
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    
    if (status === 401 || status === 403) {
      Alert.alert('Session Expired', 'Your authentication token is invalid. Please log in.');
      // Add logic to navigate to LoginScreen
    } else if (status === 404) {
      Alert.alert('Resource Not Found', 'The requested endpoint does not exist.');
    }
    return Promise.reject(error);
  }
);


// --- 1. DATA CONTRACTS (Matching Django Models) ---

export interface JobDetails {
    id: number;
    latitude: number;
    longitude: number;
    customer_name: string;
    vehicle_plate: string;
    service_type: string;
    priority: 'HIGH' | 'URGENT' | 'MEDIUM';
    distance_km: number;
}

export interface SettlementRecord {
    id: number;
    settlement_date: string;
    total_provider_payout_amount: number;
    transaction_count: number;
    status: string; // e.g., PROCESSED
}

// --- 2. CORE API FUNCTIONS ---

/**
 * Fetches the queue of new and pending jobs for the provider. (Used by JobQueueScreen)
 */
export async function getJobQueue(): Promise<JobDetails[]> {
    try {
        const response = await apiInstance.get('services/jobs/queue/');
        return response as unknown as JobDetails[]; 
    } catch (error) {
        throw new Error("Failed to fetch job queue.");
    }
}

/**
 * Submits the dynamic pricing quote for customer approval. (Used by DynamicQuoteScreen)
 */
export async function submitDynamicQuote(payload: object): Promise<any> {
    try {
        const response = await apiInstance.post('services/quote/submit/', payload);
        return response;
    } catch (error) {
        throw new Error("Failed to submit quote.");
    }
}

/**
 * Updates the provider's real-time availability status and location.
 */
export async function updateProviderStatus(isAvailable: boolean, lat: number, lng: number): Promise<any> {
    try {
        // Assume apiClient is imported and working
        await apiClient.post('users/provider/update-location/', { 
            is_available: isAvailable, 
            latitude: lat, 
            longitude: lng 
        });
        return { success: true };
    } catch (error) {
        console.error("API Error updating availability:", error);
        throw new Error("Failed to update status/location."); // This generates the error you are seeing
    }
}

/**
 * Retrieves the provider's payout history and current due amount. (Used by EarningsScreen)
 */
export async function getEarningsHistory(): Promise<{ total_due: number, history: SettlementRecord[] }> {
    try {
        const response = await apiInstance.get('payments/earnings/history/');
        return response as unknown as { total_due: number, history: SettlementRecord[] };
    } catch (error) {
        throw new Error("Failed to fetch earnings history.");
    }
}