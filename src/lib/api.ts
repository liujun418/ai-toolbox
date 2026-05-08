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
  credits_used: number;
}

async function uploadFile(toolId: string, file: File): Promise<UploadResult> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);

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

async function uploadFileWithPrompt(
  toolId: string,
  file: File,
  prompt?: string,
): Promise<UploadResult> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);
  if (prompt) formData.append("prompt", prompt);

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

// PDF to Word: file upload with page-based credit
async function uploadPdfToWord(file: File): Promise<UploadResult> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload/pdf-to-word`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Conversion failed" }));
    throw new Error(err.detail || err.message || "PDF conversion failed");
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
  uploadFileWithPrompt,
  uploadPdfToWord,
  createCheckoutSession,
  API_BASE,
};
