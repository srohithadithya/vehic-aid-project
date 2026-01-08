
import axios from 'axios';

// Create an Axios instance with default configuration
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('provider_access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('provider_access_token');
                // DEMO FIX: Do not log out if we are in demo mode
                if (token === 'demo-access-token-verified') {
                    console.warn('API 401 suppressed in Demo Mode');
                    return Promise.reject(error);
                }

                localStorage.removeItem('provider_access_token');
                localStorage.removeItem('provider_refresh_token');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);
