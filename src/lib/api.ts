const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL must be set");
}

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
  email_verified: boolean;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  user: User;
}

export interface TaskItem {
  id: string;
  tool_type: string;
  status: string;
  credits_cost: number;
  created_at: string;
  completed_at: string | null;
}

interface TaskListResult {
  tasks: TaskItem[];
  total: number;
}

export interface TransactionItem {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

interface TransactionListResult {
  transactions: TransactionItem[];
  total: number;
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

// -- Auth API --
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiRequest("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiRequest("/api/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
  },

  async updateProfile(name?: string, email?: string): Promise<User> {
    return apiRequest("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ name, email }),
    });
  },

  async sendVerification(): Promise<{ message: string }> {
    return apiRequest("/api/auth/send-verification", {
      method: "POST",
    });
  },

  async verifyEmail(token: string): Promise<{ message: string; email: string }> {
    return apiRequest(`/api/auth/verify-email?token=${token}`);
  },

  async getTasks(page = 1, size = 20): Promise<TaskListResult> {
    return apiRequest(`/api/auth/me/tasks?page=${page}&size=${size}`);
  },

  async getTransactions(page = 1, size = 20): Promise<TransactionListResult> {
    return apiRequest(`/api/auth/me/transactions?page=${page}&size=${size}`);
  },

  logout(): void {
    clearToken();
  },

  getToken,
  setToken,
};

// -- Tools API --

interface UploadResult {
  task_id: string;
  output_file_url: string;
  result_content?: string | null;
  credits_used: number;
}

async function uploadFile(
  toolId: string,
  file: File,
  prompt?: string,
  mask?: Blob,
): Promise<UploadResult> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);
  if (prompt) formData.append("prompt", prompt);
  if (mask) formData.append("mask", mask, "mask.png");

  const res = await fetch(`${API_BASE}/api/upload/${toolId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || err.message || "Upload failed");
  }

  return res.json();
}

// Payment API
interface CheckoutResult {
  checkout_url: string;
  session_id: string;
}

async function createCheckoutSession(priceId: string): Promise<CheckoutResult> {
  return apiRequest("/api/payments/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ price_id: priceId }),
  });
}

export const toolsApi = {
  uploadFile,
  createCheckoutSession,
  API_BASE,
};
