// ServiceBookerApp/src/services/authService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import apiClient from './apiClient';

const ACCESS_TOKEN_KEY = 'userAccessToken';
const REFRESH_TOKEN_KEY = 'userRefreshToken';

export const getAccessToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const logout = async () => {
    try {
        // Clear tokens immediately
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        
        // Optional: Invalidate token on the server side (Django logout endpoint)
        // await apiClient.post('users/token/blacklist/', { refresh: await AsyncStorage.getItem(REFRESH_TOKEN_KEY) });
        
    } catch (e) {
        console.error("Error during logout:", e);
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    const token = await getAccessToken();
    return !!token;
};

// Placeholder for JWT refresh logic (not required for basic setup but vital for production)
export const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
        throw new Error("No refresh token available.");
    }
    
    // API call to the JWT refresh endpoint
    const response = await apiClient.post('users/token/refresh/', { refresh: refreshToken });
    await setTokens(response.data.access, refreshToken);
    return response.data.access;
};