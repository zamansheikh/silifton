import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin sign in — Silifton",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next?.startsWith("/admin") ? sp.next : "/admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="hero-bg" style={{ position: "absolute", inset: 0 }}>
        <div className="hero-grid" />
        <div className="hero-glow-a" style={{ opacity: 0.25 }} />
      </div>

      <div className="panel" style={{ width: "100%", maxWidth: 420, padding: 36, position: "relative", zIndex: 1 }}>
        <Link href="/" className="brand" style={{ marginBottom: 24, justifyContent: "center" }}>
          <Image src="/logo.webp" alt="" width={28} height={28} />
          <span>Silifton</span>
        </Link>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="eyebrow" style={{ display: "inline-flex", justifyContent: "center" }}>
            <span className="dot" /> Admin sign in
          </div>
          <h1 className="h3" style={{ marginTop: 16, fontSize: 22 }}>
            Welcome back.
          </h1>
        </div>

        <LoginForm next={next} />

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "var(--fg-faint)" }} className="mono">
          Restricted area. All access is logged.
        </div>
      </div>
    </div>
  );
}
