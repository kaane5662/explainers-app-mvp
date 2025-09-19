// hooks/useUser.ts
'use client';

import { IUser } from '@/interfaces';
import axios from 'axios';
import { router, usePathname } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useUser() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  // Fetch user from API or local storage
  const fetchUser = useCallback(async () => {
    try {
      console.log('fetching user from callback');
      console.log('Current pathname:', pathname);

      // Skip auth check on auth pages
      const isAuthPage =
        pathname?.includes('/auth') || pathname === '/login' || pathname === '/signup';
      if (isAuthPage) {
        console.log('On auth page, skipping user fetch');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Get JWT token from storage
      const token = await AsyncStorage.getItem('jwt_token');
      console.log('JWT token exists:', !!token);

      // Prepare request headers
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Sending JWT token with request');
      } else {
        console.log('No JWT token found, user not authenticated');
        console.log('Current pathname:', pathname);
        console.log('Redirecting to /auth-landing');
        // If no token, immediately redirect to auth
        setLoading(false);
        return router.replace('/auth-landing');
      }

      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        withCredentials: true,
        headers,
      });
      console.log('user hook status', res.status);
      if (res.status !== 200) throw new Error(`Failed to fetch user: ${res.statusText}`);
      const data = res.data as IUser;
      if (user?.isOnboarding && pathname !== '/onboarding') {
        router.replace('/onboarding');
      }
      setUser(data);
      console.log(data);
    } catch (err: any) {
      if (
        err.response?.status === 404 ||
        err.response?.status === 403 ||
        err.response?.status === 401
      ) {
        console.log('API error, status:', err.response?.status);
        console.log('Current pathname:', pathname);
        console.log('Clearing token and redirecting to /auth-landing');
        // Clear invalid token
        await AsyncStorage.removeItem('jwt_token');
        return router.replace('/auth-landing');
      }
      setError(err.message || 'Unknown error');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Runs on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Logout function to clear all auth data
  const logout = useCallback(async () => {
    try {
      // Clear JWT token
      await AsyncStorage.removeItem('jwt_token');
      // Clear user state
      setUser(null);
      setError(null);
      // Redirect to auth landing
      router.replace('/auth-landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    setUser, // allows manual updates
    logout, // clear all auth data
  };
}
