"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  credits: number;
  email_verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
  updateUser: (updates: Partial<User> | ((prev: User) => Partial<User>)) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authApi.getToken();
    if (token) {
      authApi.me()
        .then(setUser)
        .catch(() => authApi.logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const refresh = async () => {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      authApi.logout();
      setUser(null);
    }
  };

  const updateUser = (updates: Partial<User> | ((prev: User) => Partial<User>)) => {
    setUser((prev) => {
      if (!prev) return null;
      const patch = typeof updates === "function" ? updates(prev) : updates;
      return { ...prev, ...patch };
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
