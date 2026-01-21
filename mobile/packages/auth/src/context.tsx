import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User } from '@vehic-aid/api';
import { storageService } from '@vehic-aid/storage';
import { apiClient, authEndpoints } from '@vehic-aid/api';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    username: string;
    email: string;
    password: string;
    phone_number: string;
    role: 'CUSTOMER' | 'PROVIDER';
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedTokens = await storageService.getTokens();
        const savedUser = await storageService.getUser();

        if (savedTokens && savedUser) {
          apiClient.setTokens(savedTokens.access, savedTokens.refresh);
          setUser(savedUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authEndpoints.login({ email, password });
        const { user, tokens } = response;

        // Save to storage
        await storageService.setTokens(tokens);
        await storageService.setUser(user);

        // Set API client tokens
        apiClient.setTokens(tokens.access, tokens.refresh);

        setUser(user);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || 'Login failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authEndpoints.signup(data);
        const { user, tokens } = response;

        // Save to storage
        await storageService.setTokens(tokens);
        await storageService.setUser(user);

        // Set API client tokens
        apiClient.setTokens(tokens.access, tokens.refresh);

        setUser(user);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || 'Signup failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authEndpoints.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // Clear local state regardless of API call result
      await storageService.clearTokens();
      await storageService.clearUser();
      apiClient.clearTokens();
      setUser(null);
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
