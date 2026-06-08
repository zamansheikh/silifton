const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export async function api<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { body = await res.text(); }
    throw new ApiError(res.status, `API ${path} → ${res.status}`, body);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public body: unknown) {
    super(message);
  }
}
