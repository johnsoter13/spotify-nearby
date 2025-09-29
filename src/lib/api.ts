// src/api/api.ts
import { API_BASE } from "./config";
import { getToken, saveToken } from "../lib/auth";
import { logout } from "./session";

/**
 * Single-flight refresh promise so concurrent 401s don't spam /auth/refresh.
 */
let refreshInFlight: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const current = await getToken(); // may be expired; we still send it
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: current ? { Authorization: `Bearer ${current}` } : {},
  });

  if (!res.ok) return null;

  const data = await safeJson(res);
  if (data?.token) {
    await saveToken(data.token);
    return data.token;
  }
  return null;
}

async function ensureFreshToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      // allow next refresh after this one settles
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function withAuthHeaders(init: RequestInit, token: string | null): RequestInit {
  return {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // keep for cookie-based flows too
  };
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

/**
 * Universal API call: attaches JWT, refreshes on 401, retries once.
 */
export async function api<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  let token = await getToken();

  // First attempt
  let res = await fetch(`${API_BASE}${path}`, withAuthHeaders(init, token));

  // If unauthorized, try refresh + retry once
  if (res.status === 401 && retry) {
    const newToken = await ensureFreshToken();
    if (!newToken) {
      await logout();
      throw new Error("Unauthorized: refresh failed");
    }
    res = await fetch(`${API_BASE}${path}`, withAuthHeaders(init, newToken));
  }

  if (!res.ok) {
    const data = await safeJson(res);
    const msg = typeof data?.error === "string"
      ? data.error
      : data?.message || res.statusText;
    throw new Error(`API ${res.status}: ${msg}`);
  }

  return (await safeJson(res)) as T;
}
