import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin-token";

/** Read the JWT from the request cookie (server-only). */
export async function getAdminToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value;
}

/** Bearer header for upstream backend calls, when a session exists. */
export async function adminAuthHeader(): Promise<Record<string, string>> {
  const token = await getAdminToken();
  return token ? { authorization: `Bearer ${token}` } : {};
}
