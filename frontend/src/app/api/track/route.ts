import { NextResponse, type NextRequest } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";

/**
 * Public analytics beacon. Forwards anonymous /api/track from the browser to
 * the backend at <BASE>/api/analytics/track, preserving the visitor's IP and
 * user-agent so the backend can bucketize uniques without cookies.
 *
 * No auth required.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const fwd =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "";
  const ua = req.headers.get("user-agent") ?? "";
  const host = req.headers.get("host") ?? "";

  const res = await fetch(`${BASE}/api/analytics/track`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": ua,
      ...(fwd ? { "x-forwarded-for": fwd } : {}),
      host,
    },
    body,
    cache: "no-store",
  }).catch(() => null);

  // Tracker fire-and-forget: always reply 204 so the beacon doesn't block.
  return new NextResponse(null, { status: res?.status === 204 ? 204 : 204 });
}
