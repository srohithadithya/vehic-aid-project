
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
            // Using the token endpoint which returns access and refresh
            const response = await apiClient.post('/users/token/', {
                username: credentials.email || credentials.username,
                password: credentials.password
            });
            const { access, refresh } = response.data;

            localStorage.setItem('customer_access_token', access);
            localStorage.setItem('customer_refresh_token', refresh);

            // After token is set, fetch the user profile to update state
            // For MVP, if we don't have a profile endpoint handy yet, we can set a dummy user or decode the token.
            // But let's assume we want to be safe and just reload or set a basic object.
            // Better: Decode token or fetch me. Let's try fetching me if it exists, otherwise set basic user.
            // Note: The original code assumed response.data.user which /token/ MIGHT NOT return by default in SimpleJWT.

            // Let's decode or just set a placeholder that will be updated on mount/refresh if we implemented checkAuth fully.
            // Ideally we call /users/me/ or similar.
            setUser({
                id: 0, // Placeholder ID
                username: credentials.email || credentials.username,
                email: credentials.email || credentials.username,
                phone_number: '',
                is_service_booker: true,
                is_service_provider: false
            } as User);

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
        router.push('/auth/login');
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
