
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    username: string;
    is_service_provider: boolean;
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
                    // Fetch profile or just set user from assumed token validity for MVP
                    // const response = await apiClient.get('/users/profile/');
                    // setUser(response.data.user);
                    // Mock user for now if API not fully ready with profile endpoint
                    setUser({ id: 1, username: 'Provider', is_service_provider: true });
                } catch (error) {
                    localStorage.removeItem('provider_access_token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await apiClient.post('/users/login/', credentials);
            const { access, refresh, user } = response.data;

            localStorage.setItem('provider_access_token', access);
            localStorage.setItem('provider_refresh_token', refresh);
            setUser(user);
            router.push('/jobs');
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
