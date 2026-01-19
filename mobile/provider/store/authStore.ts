import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/token/', { username, password });
            const { access, refresh } = response.data;
            await SecureStore.setItemAsync('token', access);
            await SecureStore.setItemAsync('refresh', refresh);
            set({ token: access });
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    logout: async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refresh');
        set({ user: null, token: null });
    },
    checkAuth: async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                set({ token });
            }
        } catch (e) {
            console.error(e);
        } finally {
            set({ isLoading: false });
        }
    },
}));
