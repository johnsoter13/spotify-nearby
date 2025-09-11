import { getToken } from "../lib/auth";

import { API_BASE } from "./config";

/**
 * Generic fetch wrapper that automatically attaches the stored JWT token.
 */
export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API error ${res.status}: ${text || res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}