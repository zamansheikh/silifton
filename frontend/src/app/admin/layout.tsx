import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminAuthHeader } from "@/lib/auth-cookie";

export const metadata = {
  title: "Admin · Silifton",
  robots: { index: false, follow: false },
};

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";

type Me = { id: string; name: string; email: string; role: string; initials?: string };

async function fetchMe(): Promise<Me | null> {
  try {
    const headers = await adminAuthHeader();
    if (!headers.authorization) return null;
    const res = await fetch(`${BASE}/api/auth/me`, { headers, cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Me;
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await fetchMe();
  if (!me) {
    redirect("/login");
  }

  const initials =
    me.initials ??
    me.name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <AdminShell user={{ name: me.name, email: me.email, initials }}>
      {children}
    </AdminShell>
  );
}
