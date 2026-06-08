/**
 * Thin client for the admin-proxied API. Every call goes through the
 * Next /api/proxy route which attaches the admin JWT cookie as a Bearer
 * token before forwarding to NestJS — so client components never need
 * to handle auth.
 */
const BASE = "/api/proxy";

export class AdminError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

async function adminFetch(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${BASE}/${path}`, { cache: "no-store", ...init });
  if (res.status === 204) return null;
  if (!res.ok) {
    let body: unknown = null;
    try { body = await res.json(); } catch { /* not json */ }
    const m = body as { message?: string | string[] } | null;
    const msg = m && m.message
      ? Array.isArray(m.message) ? m.message.join(", ") : m.message
      : `Request failed (${res.status})`;
    throw new AdminError(res.status, msg, body);
  }
  return res.json();
}

export const adminContent = {
  list<T>(c: string): Promise<T[]> {
    return adminFetch(`admin/content/${c}`) as Promise<T[]>;
  },
  create<T>(c: string, payload: Record<string, unknown>): Promise<T> {
    return adminFetch(`admin/content/${c}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }) as Promise<T>;
  },
  update<T>(c: string, id: string, patch: Record<string, unknown>): Promise<T> {
    return adminFetch(`admin/content/${c}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    }) as Promise<T>;
  },
  remove(c: string, id: string): Promise<void> {
    return adminFetch(`admin/content/${c}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }) as Promise<void>;
  },
};

export const adminInquiries = {
  list<T>(): Promise<T[]> {
    return adminFetch("inquiries") as Promise<T[]>;
  },
  update<T>(id: string, patch: Record<string, unknown>): Promise<T> {
    return adminFetch(`inquiries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    }) as Promise<T>;
  },
  remove(id: string): Promise<void> {
    return adminFetch(`inquiries/${encodeURIComponent(id)}`, { method: "DELETE" }) as Promise<void>;
  },
};

export const adminApplications = {
  list<T>(): Promise<T[]> {
    return adminFetch("applications") as Promise<T[]>;
  },
  update<T>(id: string, patch: Record<string, unknown>): Promise<T> {
    return adminFetch(`applications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    }) as Promise<T>;
  },
  remove(id: string): Promise<void> {
    return adminFetch(`applications/${encodeURIComponent(id)}`, { method: "DELETE" }) as Promise<void>;
  },
};

export const adminSettings = {
  list<T = Record<string, Record<string, unknown>>>(): Promise<T> {
    return adminFetch("admin/settings") as Promise<T>;
  },
  get<T = Record<string, unknown>>(key: string): Promise<T> {
    return adminFetch(`admin/settings/${encodeURIComponent(key)}`) as Promise<T>;
  },
  set<T = Record<string, unknown>>(key: string, value: Record<string, unknown>): Promise<T> {
    return adminFetch(`admin/settings/${encodeURIComponent(key)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    }) as Promise<T>;
  },
};
