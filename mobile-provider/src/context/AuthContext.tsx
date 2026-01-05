import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { User, LoginResponse } from '../types';
import { useRouter } from 'expo-router';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                if (token) {
                    const response = await apiClient.get('/users/profile/');
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await apiClient.post<LoginResponse>('/users/login/', credentials);
            const { access, refresh, user } = response.data;

            await AsyncStorage.setItem('access_token', access);
            await AsyncStorage.setItem('refresh_token', refresh);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error("Login failed", error?.response?.data || error.message);
            throw error;
        }
    };

    const logout = async () => {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        setUser(null);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
