import { API_BASE } from "./config";

export async function api<T>(path: string, init: RequestInit = {}) {
  const token = globalThis.__APP_TOKEN__;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}