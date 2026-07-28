import { API_BASE_URL } from "@/lib/constants/config";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/auth/admin-session";

export interface AdminSession {
  authenticated: boolean;
  role: string;
}

export interface AdminLoginResult {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  role: string;
}

export async function loginAdmin(adminKey: string): Promise<AdminLoginResult> {
  const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminKey }),
  });

  if (!response.ok) {
    throw new Error("Invalid admin credentials");
  }

  const data = (await response.json()) as AdminLoginResult;
  setAdminToken(data.accessToken);
  return data;
}

export async function fetchAdminSession(): Promise<AdminSession> {
  const response = await adminFetch("/api/admin/auth/me");
  if (!response.ok) {
    throw new Error("Admin session expired");
  }
  return response.json() as Promise<AdminSession>;
}

export function logoutAdmin(): void {
  clearAdminToken();
}

export async function adminFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
}
