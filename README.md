# Silifton

Public marketing site for Silifton — a senior engineering studio.

## Repo layout

```
.
├── frontend/         Next.js 16 (App Router) marketing site
├── deploy/           PM2 + nginx deploy scripts for the VPS
└── design-system/    Source design (HTML/JSX prototype) — reference only
```

There is no backend in this repo any more. All site content (services, portfolio,
blog, testimonials, team, careers, site copy/SEO), the contact and careers forms,
and the first-party analytics are served by the **CRM API** in the
[`silifton-crm`](https://github.com/zamansheikh/silifton-crm) repo, and edited from
the CRM's **Website** section at `https://crm.silifton.com/website` with the same
login as the rest of the CRM.

The old `/admin` and `/login` pages on this site redirect there.

## Quick start (local)

```bash
cd frontend
cp .env.example .env.local     # point NEXT_PUBLIC_API_URL at a running CRM API
npm install
npm run dev                    # → http://localhost:7000
```

To run the API locally, start `silifton-crm/backend` (`npm run dev`, port 7011) and
set `NEXT_PUBLIC_API_URL=http://localhost:7011`. Without an API the site still renders
from the bundled seed content in `frontend/src/lib/seed.ts`.

## Stack

- Next.js 16, React 19, TypeScript 5.7, Tailwind CSS v4, lucide-react

## Configuration

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | CRM API base URL (production: `https://crmapi.silifton.com`). Baked in at build time. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for SEO (default `https://silifton.com`). |
| `NEXT_PUBLIC_CRM_URL` | Where `/admin` and `/login` redirect (default `https://crm.silifton.com`). |

## API endpoints the site uses

All on the CRM API, unauthenticated:

| Endpoint | Used by |
|---|---|
| `GET /api/content/<collection>` | services, portfolio, posts, team, testimonials, careers |
| `GET /api/settings` | hero / about / footer / social / seo copy |
| `POST /api/inquiries` | contact form |
| `POST /api/applications` | careers application form |
| `POST /api/analytics/track` | page-view beacon (forwarded by `/api/track`) |

## Deploying

See [`deploy/README.md`](deploy/README.md). Short version, on the VPS:

```bash
cd /var/www/silifton && bash deploy/deploy.sh
```
