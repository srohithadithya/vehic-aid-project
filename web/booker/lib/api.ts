// @ts-nocheck
import axios from 'axios';

// Create an Axios instance with default configuration
export const apiClient = axios.create({
    baseURL: (typeof window === 'undefined' ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:8001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
apiClient.interceptors.request.use(
    (config) => {
        // Check if we are in the browser
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('customer_access_token');
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

// Response interceptor to handle errors (e.g., token expiration)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('customer_access_token');
                localStorage.removeItem('customer_refresh_token');
                // Dynamic redirect based on current path (handles GH Pages vs Local)
                const basePath = window.location.pathname.startsWith('/vehic-aid-project/booker')
                    ? '/vehic-aid-project/booker'
                    : '';

                if (!window.location.pathname.includes('/login')) {
                    window.location.href = `${basePath}/login`;
                }
            }
        }
        return Promise.reject(error);
    }
);
