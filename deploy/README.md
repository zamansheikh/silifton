# Silifton — VPS deployment

Scripts to run the marketing site (Next.js) on a single Ubuntu / Debian VPS with
**PM2** + **nginx**, and to auto-redeploy on every push to `main` via GitHub Actions.

The site's API is **not** in this repo. It is the CRM API from `silifton-crm`
(PM2 process `silifton-crm-api`, port 7011, `https://crmapi.silifton.com`), which
also hosts the admin UI for site content at `https://crm.silifton.com/website`.

## Files

| File | Purpose |
|---|---|
| `setup-vps.sh` | One-time bootstrap: Node 22, git, PM2; clones the repo; PM2 on boot. |
| `deploy.sh` | Idempotent deploy: `git fetch` → `npm ci` → `next build` → `pm2 reload`. |
| `ecosystem.config.js` | PM2 process map (`silifton-frontend` on :7000). |
| `nginx.conf.template` | Reverse proxy: site at `silifton.com`, `api.silifton.com` aliased to the CRM API. |

## Architecture on the VPS

```
              ┌──────────────────────────────────────────────┐
   :443 ─────►│ nginx (TLS via certbot)                       │
              ├──────────────────────────────────────────────┤
              │ silifton.com      → 127.0.0.1:7000  this repo (next start)
              │ crmapi.silifton.com                            silifton-crm
              │ api.silifton.com  → 127.0.0.1:7011  (alias)   backend (PM2)
              │ crm.silifton.com  → 127.0.0.1:7010  silifton-crm frontend
              └──────────────────────────────────────────────┘
```

## First-time setup

```bash
curl -fsSL https://raw.githubusercontent.com/zamansheikh/silifton/main/deploy/setup-vps.sh -o setup-vps.sh
sudo bash setup-vps.sh                      # clones to /var/www/silifton

echo 'NEXT_PUBLIC_API_URL=https://crmapi.silifton.com' > /var/www/silifton/frontend/.env.local
echo 'NEXT_PUBLIC_SITE_URL=https://silifton.com'      >> /var/www/silifton/frontend/.env.local

bash /var/www/silifton/deploy/deploy.sh
```

`NEXT_PUBLIC_API_URL` is compiled into the Next build — change it and re-run
`deploy.sh`, a `pm2 restart` is not enough.

### nginx + TLS

```bash
sudo cp deploy/nginx.conf.template /etc/nginx/sites-available/silifton
sudo sed -i 's/silifton.example.com/silifton.com/g' /etc/nginx/sites-available/silifton
sudo ln -sf /etc/nginx/sites-available/silifton /etc/nginx/sites-enabled/silifton
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d silifton.com -d www.silifton.com -d api.silifton.com
```

The CRM API must allow the site's origins in its `CORS_ORIGIN`
(`silifton-crm/deploy/ecosystem.config.cjs` already lists `https://silifton.com`
and `https://www.silifton.com`).

## Auto-deploy on push

`.github/workflows/deploy.yml` SSHes into the VPS and runs `deploy.sh` on every push
to `main`. Add these repository secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
(private key), optional `VPS_SSH_PORT`.

## Day-2 ops

```bash
pm2 status                       # silifton-frontend (+ the CRM processes)
pm2 logs silifton-frontend
pm2 reload silifton-frontend     # zero-downtime restart
cd /var/www/silifton && git log --oneline -10 && git reset --hard <sha> && bash deploy/deploy.sh   # roll back
```

| Symptom | Likely cause |
|---|---|
| Site renders seed/placeholder content | `NEXT_PUBLIC_API_URL` wrong or CRM API down (`pm2 logs silifton-crm-api`). |
| Contact / careers form fails in the browser | CRM API `CORS_ORIGIN` does not include the site origin. |
| 502 from nginx | `silifton-frontend` crashed — `pm2 logs silifton-frontend`. |
