import { NextResponse, type NextRequest } from "next/server";
import { getAdminToken } from "@/lib/auth-cookie";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";

/**
 * Authenticated proxy: forwards /api/proxy/<path> from the browser to the
 * backend at <BASE>/api/<path>, injecting the admin JWT from the httpOnly cookie.
 * Lets client components hit protected endpoints without ever seeing the token.
 *
 * Handles both JSON and multipart (file upload) requests — multipart bodies are
 * forwarded as a raw ReadableStream so the multipart boundary stays intact.
 */
async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { path } = await ctx.params;
  const url = new URL(req.url);
  const upstream = `${BASE}/api/${path.join("/")}${url.search}`;

  const headers: Record<string, string> = {
    authorization: `Bearer ${token}`,
  };
  const ct = req.headers.get("content-type");
  if (ct) headers["content-type"] = ct;

  // Cast to add `duplex` which Node's fetch requires when streaming a body.
  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    if (ct?.startsWith("multipart/form-data") || ct?.startsWith("application/octet-stream")) {
      // Stream binary bodies through unchanged — preserves multipart boundary.
      init.body = req.body as unknown as BodyInit;
      init.duplex = "half";
    } else {
      // JSON/text: buffer the body (small payloads, simpler).
      init.body = await req.text();
    }
  }

  const res = await fetch(upstream, init);
  const responseHeaders = new Headers();
  const upstreamCt = res.headers.get("content-type");
  if (upstreamCt) responseHeaders.set("content-type", upstreamCt);

  return new NextResponse(res.body, { status: res.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
