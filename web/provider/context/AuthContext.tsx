
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    username?: string;
    full_name?: string;
    email?: string;
    is_service_provider?: boolean;
    provider_id?: string;
}

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
            const token = localStorage.getItem('provider_access_token');
            if (token) {
                try {
                    const response = await apiClient.get('/users/profile/');
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('provider_access_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await apiClient.post('/users/token/', credentials);
            const { access, refresh } = response.data;

            localStorage.setItem('provider_access_token', access);
            localStorage.setItem('provider_refresh_token', refresh);

            const profileRes = await apiClient.get('/users/profile/');
            setUser(profileRes.data);

            router.push('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('provider_access_token');
        localStorage.removeItem('provider_refresh_token');
        setUser(null);
        router.push('/login');
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
