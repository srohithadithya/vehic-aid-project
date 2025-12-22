import axios from 'axios';

// 10.0.2.2 is the special alias to your host loopback interface (127.0.0.1)
// on the Android Emulator.
export const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error("API Error:", error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);
