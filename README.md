# Silifton

Senior engineering studio — marketing site + admin console.

## Monorepo layout

```
.
├── frontend/         Next.js 16 (App Router) marketing + admin UI
├── backend/          NestJS 11 REST API
│   ├── src/main.ts     Local dev entrypoint (listens on a port)
│   └── api/index.ts    Vercel serverless entrypoint
└── design-system/    Source design (HTML/JSX prototype) — reference only
```

## Quick start (local)

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env          # fill in MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET, CLOUDINARY_URL
npm install
npm run start:dev             # → http://localhost:7001

# Terminal 2 — frontend
cd frontend
cp .env.local.example .env.local 2>/dev/null || true
npm install
npm run dev                   # → http://localhost:7000
```

Default admin credentials: whatever you put in `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The user is seeded on first boot.

## Stack

- **Frontend** — Next.js 16, React 19, TypeScript 5.7, Tailwind CSS v4, lucide-react
- **Backend** — NestJS 11, Mongoose 8 (MongoDB Atlas), bcryptjs + jsonwebtoken for auth, Cloudinary for image uploads, Resend for email

---

## Deploying to Vercel

This monorepo deploys as **two separate Vercel projects**, both pointing at the same GitHub repo. Each project sets a different *Root Directory*.

### 1. Backend project

| Setting | Value |
|---|---|
| Framework Preset | **Other** (don't pick Next.js) |
| Root Directory | `backend` |
| Build Command | leave empty (Vercel will use the function entry directly) |
| Install Command | `npm install` |
| Output Directory | leave empty |
| Node.js Version | 22.x |

Environment variables to add in **Project → Settings → Environment Variables**:

```
MONGODB_URI=mongodb+srv://...
MONGODB_DB=silifton
ADMIN_EMAIL=admin@silifton.com
ADMIN_PASSWORD=...                  # used once to seed the admin user
ADMIN_NAME=Admin
JWT_SECRET=<48+ random bytes>       # node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_EXPIRES_IN=7d
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>
CLOUDINARY_FOLDER=silifton
UPLOAD_MAX_BYTES=10485760
RESEND_API_KEY=re_...               # optional
CONTACT_EMAIL=                      # optional
CORS_ORIGIN=https://your-frontend.vercel.app
```

Note `CORS_ORIGIN` must list the deployed frontend origin (no trailing slash). Multiple origins: comma-separated.

`backend/vercel.json` rewrites every request to `api/index.ts`, which boots the NestJS app once per cold start and caches the Express handler.

After deploy, the API is at `https://<backend-project>.vercel.app/api/health`.

### 2. Frontend project

| Setting | Value |
|---|---|
| Framework Preset | **Next.js** (auto-detected) |
| Root Directory | `frontend` |
| Build Command | (default) `next build` |
| Install Command | (default) `npm install` |

Environment variables:

```
NEXT_PUBLIC_API_URL=https://<backend-project>.vercel.app
```

That's the **only** required env on the frontend — everything else (admin auth, image uploads, content reads) calls through to the backend.

### 3. Smoke test

After both deploys finish:
1. `curl https://<backend>.vercel.app/api/health` → `{"status":"ok",...}`
2. Visit `https://<frontend>.vercel.app/` — marketing site renders, services/portfolio/team load from the backend
3. Sign in at `https://<frontend>.vercel.app/login` with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
4. Land on `/admin` — the seeded admin user exists in MongoDB (created on the backend's first cold start)

### Notes

- The backend's Mongoose connection is reused across warm invocations thanks to the `cachedHandler` in [api/index.ts](backend/api/index.ts). Cold starts will take 1–3s (connecting to Atlas).
- For higher throughput, deploy the backend to **Railway / Render / Fly.io** instead — they keep a long-running process, eliminating cold starts and connection churn. The frontend doesn't care where the backend lives, only what URL it's at.
- The MongoDB Atlas cluster must allow connections from Vercel's IP range. Easiest: in Atlas → Network Access → Add IP → `0.0.0.0/0` (open) for testing, then restrict later via [Vercel's NAT egress IP](https://vercel.com/docs/security/secure-backend-access/static-ips).
