const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://ai-toolbox-api-production.up.railway.app";

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  user: User;
}

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

function setToken(token: string): void {
  localStorage.setItem("token", token);
}

function clearToken(): void {
  localStorage.removeItem("token");
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.message || "Request failed");
  }

  return res.json();
}

export const authApi = {
  async register(data: RegisterData): Promise<TokenResponse> {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginData): Promise<TokenResponse> {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async me(): Promise<User> {
    return apiRequest("/api/auth/me");
  },

  logout(): void {
    clearToken();
  },

  getToken,
  setToken,
};
