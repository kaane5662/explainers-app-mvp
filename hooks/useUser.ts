// hooks/useUser.ts
"use client";

import { IUser } from "@/interfaces";
import axios from "axios";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";


export function useUser() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user from API or local storage
  const fetchUser = useCallback(async () => {
    try {
        console.log("fetching user from callback")
      setLoading(true);
      setError(null);

      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`, { withCredentials: true });
      console.log("user hook status", res.status)
      if (res.status !== 200) throw new Error(`Failed to fetch user: ${res.statusText}`);
      
      const data = res.data as IUser;
      setUser(data);
    } catch (err: any) {
        if(err.response.status == 404){
            return router.replace("/auth-landing")
        }
      setError(err.message || "Unknown error");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Runs on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    setUser, // allows manual updates
  };
}