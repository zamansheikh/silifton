import type { NextConfig } from "next";

// Content is managed from the CRM (crm.silifton.com → Website). The old
// in-site admin was retired; keep its URLs working by redirecting there.
const CRM_URL = (process.env.NEXT_PUBLIC_CRM_URL ?? "https://crm.silifton.com").replace(/\/$/, "");

const config: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7011",
  },
  async redirects() {
    return [
      { source: "/admin", destination: `${CRM_URL}/website`, permanent: false },
      { source: "/admin/:path*", destination: `${CRM_URL}/website`, permanent: false },
      { source: "/login", destination: `${CRM_URL}/login`, permanent: false },
    ];
  },
};

export default config;
