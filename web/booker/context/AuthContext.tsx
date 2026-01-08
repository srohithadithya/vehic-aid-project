
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { User, LoginResponse } from '../lib/types';
import { useRouter } from 'next/navigation';

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
            const token = localStorage.getItem('customer_access_token');
            if (token) {
                try {
                    // Ideally verify token or fetch user profile from an endpoint like /api/v1/users/me/
                    // For MVP, we might decode or just persist basic user info. 
                    // Let's assume we fetch profile:
                    const response = await apiClient.get('/users/profile/'); // Adjust endpoint as needed
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('customer_access_token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await apiClient.post<LoginResponse>('/users/login/', credentials);
            const { access, refresh, user } = response.data;

            localStorage.setItem('customer_access_token', access);
            localStorage.setItem('customer_refresh_token', refresh);
            setUser(user);
            router.push('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('customer_access_token');
        localStorage.removeItem('customer_refresh_token');
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
