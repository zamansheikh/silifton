"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/auth-cookie";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";

export type LoginState = {
  error?: string;
  ok?: true;
  redirectTo?: string;
};

/**
 * Sign in flow:
 *  1. Validate credentials against the backend.
 *  2. Set the admin-token cookie on the response.
 *  3. Return { ok, redirectTo } so the client component can do a hard
 *     `window.location.assign()` — this guarantees the freshly-set
 *     httpOnly cookie is included in the next request. Doing the redirect
 *     inside the server action has been flaky in Next 16: the Set-Cookie
 *     header is sometimes not applied before the redirected GET fires,
 *     which causes /admin/layout's /api/auth/me probe to 401 and bounce
 *     the user back to /login.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { error: "Could not reach the API. Is the backend running?" };
  }

  if (!res.ok) {
    return {
      error: res.status === 401 ? "Invalid email or password." : `Login failed (${res.status})`,
    };
  }

  const body = (await res.json()) as { token: string; expiresIn?: string };
  const store = await cookies();
  store.set(ADMIN_COOKIE, body.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return {
    ok: true,
    redirectTo: next.startsWith("/admin") ? next : "/admin",
  };
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/login");
}
