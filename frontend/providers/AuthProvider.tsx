"use client";
import { UserPreview } from "@/types";
import axios from "@/utils/axiosInstance";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<
  { user: UserPreview | null; loading: boolean } | undefined
>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPreview | null>(null);
  const [loading, setLoading] = useState(true);

  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`/auth/me`);

        if (res.status === 401) throw new Error("Not authenticated");

        const userData = await res.data as UserPreview;
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  return useContext(AuthContext);
}
