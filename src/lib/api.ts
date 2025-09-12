import { API_BASE } from "./config";
import { clearToken, getToken, saveToken } from "../lib/auth";
import { logout } from "./session";

/**
 * Internal helper to refresh the app token
 */
async function refreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include", // important if backend uses httpOnly cookies
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data?.token) {
      await saveToken(data.token);
      return data.token;
    }
    return null;
  } catch (e) {
    console.error("Refresh token failed:", e);
    return null;
  }
}

/**
 * Generic fetch wrapper that automatically attaches the stored JWT token.
 */
export async function api<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  let token = await getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    // Try refreshing token
    token = await refreshToken();

    if (token) {
      // Retry original request once
      return api<T>(path, init, false);
    } else {
      // No valid refresh, clear and throw
      await logout();   // 👈 redirects user out of the app
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API error ${res.status}: ${text || res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}

