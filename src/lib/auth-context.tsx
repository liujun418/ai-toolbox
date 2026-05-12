"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  email_verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
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

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
