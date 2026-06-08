# Silifton — VPS Deployment

Self-contained scripts to deploy the monorepo (NestJS backend + Next.js frontend) to a single Ubuntu / Debian VPS using **PM2** + **nginx**, and to auto-redeploy on every push to `main` via **GitHub Actions**.

## Files in this folder

| File | Purpose |
|---|---|
| `setup-vps.sh` | **One-time** VPS bootstrap: installs Node 22 LTS, git, build tools, PM2; clones the repo; wires PM2 into systemd so apps survive reboot. |
| `deploy.sh` | **Idempotent** deploy: `git fetch` → install → build → `pm2 reload`. Safe to re-run. Used by both the manual flow and the GitHub Action. |
| `ecosystem.config.js` | PM2 process map (`silifton-backend` on :7001, `silifton-frontend` on :7000). |
| `nginx.conf.template` | Reverse proxy: marketing at `silifton.com`, API at `api.silifton.com`. |

## Architecture on the VPS

```
              ┌──────────────────────────────┐
   :443 ─────►│ nginx (TLS via certbot)      │
              ├──────────────────────────────┤
              │ silifton.com     → 127.0.0.1:7000  (Next.js / next start)
              │ api.silifton.com → 127.0.0.1:7001  (NestJS  / node dist/main.js)
              └──────────────────────────────┘
                          │
                          ▼  (PM2 keeps both alive, restarts on crash, boots on reboot)
              ┌──────────────────────────────┐
              │ /var/www/silifton/             │  ← APP_DIR (configurable)
              │   ├ backend/   ← dist/main.js │
              │   └ frontend/  ← .next/       │
              └──────────────────────────────┘
                          │
                          ▼
              MongoDB Atlas · Cloudinary · Resend  (all external SaaS)
```

---

## First-time setup (~5 minutes)

Run on a fresh Ubuntu 22.04 / 24.04 (or Debian 12) VPS. SSH in as a sudo-capable user.

```bash
# 1. Grab the bootstrap script
curl -fsSL https://raw.githubusercontent.com/zamansheikh/silifton/main/deploy/setup-vps.sh -o setup-vps.sh

# 2. Run it (defaults: clones to /var/www/silifton, current user owns)
sudo bash setup-vps.sh

# Override defaults if you want:
APP_DIR=/srv/silifton REPO_URL=git@github.com:you/your-fork.git sudo -E bash setup-vps.sh
```

It installs everything, clones the repo, and prints the **two manual steps left**:

### Step 1 — backend env
```bash
sudo -u $USER cp /var/www/silifton/backend/.env.example /var/www/silifton/backend/.env
sudo -u $USER nano /var/www/silifton/backend/.env
```
Fill in:
- `MONGODB_URI` — your Atlas connection string (whitelist `0.0.0.0/0` in Atlas → Network Access, or your VPS IP)
- `ADMIN_PASSWORD` — strong password (seeds the first admin user)
- `JWT_SECRET` — long random string (generate: `openssl rand -hex 48`)
- `CLOUDINARY_URL` — `cloudinary://<key>:<secret>@<cloud_name>`
- `CORS_ORIGIN` — `https://silifton.com` (or whatever your frontend URL will be)
- `RESEND_API_KEY` + `CONTACT_EMAIL` — optional, only needed for contact-form emails

### Step 2 — frontend env
```bash
echo 'NEXT_PUBLIC_API_URL=https://api.silifton.com' | sudo -u $USER tee /var/www/silifton/frontend/.env.local
```

### Step 3 — first deploy
```bash
sudo -u $USER bash /var/www/silifton/deploy/deploy.sh
```

That pulls the latest code, installs both apps, builds them, and starts PM2. After ~30s:
```bash
pm2 status              # both apps "online"
curl localhost:7001/api/health    # {"status":"ok","service":"silifton-api",...}
curl -I localhost:7000            # 200 OK (Next.js)
```

---

## DNS — what to set in Cloudflare (or any DNS provider)

You need **two subdomains** pointing at the VPS — one for the marketing site, one for the API. Using a separate `api.` subdomain avoids the path conflict between Next.js's own `/api/*` routes (e.g. `/api/proxy/*`) and NestJS's `/api/*` controllers.

### Records

In Cloudflare → DNS → Records, add three `A` records pointing at your VPS's public IP:

| Type | Name | Content | Proxy status |
|---|---|---|---|
| `A` | `@`   (= apex `silifton.com`)     | `203.0.113.10` (your VPS IP) | see below |
| `A` | `www` (= `www.silifton.com`)      | `203.0.113.10`               | see below |
| `A` | `api` (= `api.silifton.com`)      | `203.0.113.10`               | see below |

After these resolve (usually within a minute on Cloudflare), the frontend lives at `https://silifton.com` and the backend at `https://api.silifton.com`.

Update `frontend/.env.local` on the VPS to match:
```
NEXT_PUBLIC_API_URL=https://api.silifton.com
```

…and `backend/.env`:
```
CORS_ORIGIN=https://silifton.com,https://www.silifton.com
```

Then `bash deploy/deploy.sh` (because `NEXT_PUBLIC_API_URL` is baked into the Next build, you need a rebuild — not just a `pm2 restart`).

### Proxy mode (the orange/grey cloud toggle)

Two viable setups; pick one:

**Option A — DNS-only (grey cloud) + Let's Encrypt on the VPS** ← simplest, recommended first
- Toggle the cloud icon to **grey/DNS-only** for all three records.
- Run `certbot --nginx` on the VPS (instructions in the next section). It uses HTTP-01 challenge, which works because Cloudflare isn't intercepting :80.
- You give up Cloudflare's DDoS protection and caching but get standard end-to-end TLS with zero config.

**Option B — Cloudflare-proxied (orange cloud) + Cloudflare Origin Certificate** ← cacheable + DDoS-shielded
- Leave the cloud icon **orange/proxied** for all three records.
- In Cloudflare → SSL/TLS → Overview, set encryption mode to **"Full (strict)"**.
- In SSL/TLS → Origin Server → **Create Certificate** → accept defaults (15-year validity, hostnames `*.silifton.com, silifton.com`).
- Save the cert as `/etc/nginx/ssl/silifton.com.crt` and the key as `/etc/nginx/ssl/silifton.com.key` on the VPS.
- In `nginx.conf.template` change the `listen 80` blocks to `listen 443 ssl http2` and reference those files (`ssl_certificate`, `ssl_certificate_key`). Add a 301 redirect from :80 to :443.
- `certbot` is no longer needed — Cloudflare handles the public TLS, the origin cert encrypts traffic between Cloudflare and your VPS.

If you don't know which to pick, start with Option A. You can move to B later without changing the apps.

### Heads-up about Cloudflare proxy + uploads

If you use Option B and upload large images via the admin, Cloudflare's free plan caps request bodies at **100 MB**. We cap at 10 MB anyway (`UPLOAD_MAX_BYTES`), so this is fine — but worth knowing.

---

## nginx + SSL (optional, recommended)

If you want clean URLs and HTTPS instead of `http://your-ip:7000`:

```bash
# 1. Install nginx + certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 2. Copy and customize the template
sudo cp /var/www/silifton/deploy/nginx.conf.template /etc/nginx/sites-available/silifton
sudo sed -i 's/silifton.example.com/YOUR-DOMAIN.com/g' /etc/nginx/sites-available/silifton
sudo ln -sf /etc/nginx/sites-available/silifton /etc/nginx/sites-enabled/silifton
sudo nginx -t && sudo systemctl reload nginx

# 3. Issue Let's Encrypt certs (DNS must point at the VPS first)
sudo certbot --nginx -d YOUR-DOMAIN.com -d www.YOUR-DOMAIN.com -d api.YOUR-DOMAIN.com
```

DNS records you need before running certbot:
- `A  YOUR-DOMAIN.com           → <vps-ip>`
- `A  www.YOUR-DOMAIN.com       → <vps-ip>`
- `A  api.YOUR-DOMAIN.com       → <vps-ip>`

certbot will rewrite your nginx config in place to add the HTTPS server blocks and redirect HTTP → HTTPS. After it finishes, update `backend/.env` so `CORS_ORIGIN` matches the new HTTPS frontend URL, then `pm2 reload silifton-backend`.

---

## Auto-deploy on every `git push`

The workflow at `.github/workflows/deploy.yml` triggers on push to `main` and SSHes into the VPS to run `deploy.sh`. To enable it:

### 1. Create an SSH key pair on the VPS

```bash
# On the VPS, as the user that owns the repo:
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ''
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy     # copy this PRIVATE key to GitHub secrets
```

### 2. Add GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**. Add:

| Secret | Value |
|---|---|
| `VPS_HOST` | VPS IP or hostname (e.g. `203.0.113.10` or `silifton.com`) |
| `VPS_USER` | the SSH user that owns the repo (e.g. `ubuntu`, `deploy`, your username) |
| `VPS_SSH_KEY` | full contents of `~/.ssh/github_deploy` (the **private** key, with the header/footer lines) |
| `VPS_SSH_PORT` | optional; defaults to 22 |

> The deploy path is hardcoded to `/var/www/silifton` in `.github/workflows/deploy.yml` (the `APP_DIR` env). If you bootstrapped the VPS to a different path, edit that one line.

### 3. Push

```bash
git commit -am "feat: ship something cool"
git push origin main
```

Within ~60 seconds the GitHub Action runs, the VPS pulls the new code, rebuilds both apps, and `pm2 reload` swaps the processes with zero downtime. Watch progress at **GitHub → Actions tab**.

### What the workflow ignores

Edits to `*.md`, `design-system/**`, `logo/**`, and `.gitignore` skip the deploy (no point rebuilding for a typo fix in a README). Adjust `paths-ignore` in `deploy.yml` if you want stricter filtering.

### Manual re-trigger

GitHub → Actions → **"Deploy to VPS"** → **Run workflow** → `main`. Useful for redeploying after editing a secret.

---

## Day-2 ops

```bash
pm2 status                       # show both apps
pm2 logs                         # tail logs from both
pm2 logs silifton-backend         # just backend
pm2 reload all                   # zero-downtime restart
pm2 restart silifton-frontend     # hard restart one
pm2 monit                        # live dashboard
```

PM2 logs land in `/var/log/silifton/{backend,frontend}.{out,err}.log` (rotated by PM2 itself when they grow).

### Rolling back

```bash
cd /var/www/silifton
git log --oneline -10           # find the commit you want
git reset --hard <sha>
bash deploy/deploy.sh           # rebuild + reload
```

### Updating env vars

Edit `backend/.env` or `frontend/.env.local`, then:
```bash
pm2 restart silifton-backend     # NestJS reads env at boot
pm2 restart silifton-frontend    # Next.js bakes some envs into build — if you changed NEXT_PUBLIC_*, you also need to `bash deploy.sh` to rebuild
```

### Troubleshooting

| Symptom | Likely cause |
|---|---|
| `pm2 status` shows app "errored" looping | check `pm2 logs <name> --lines 100`; usually missing env var or Atlas IP not allowlisted |
| Frontend returns 502 | `pm2 status` — frontend process probably crashed; check `pm2 logs silifton-frontend` |
| CORS errors in browser | `backend/.env` `CORS_ORIGIN` must list your frontend's full origin (`https://silifton.com`); restart backend after editing |
| Login works but `/admin` flashes back to `/login` | the JWT cookie was set with `secure: true` but you're on HTTP. Use HTTPS (certbot) or set `NODE_ENV=development` |
| GitHub Action fails on `Permission denied (publickey)` | the `VPS_SSH_KEY` secret is wrong, or you forgot to append the public key to `~/.ssh/authorized_keys` on the VPS |

---

## Alternatives

| If you want… | …consider |
|---|---|
| **Zero VPS management** | Deploy frontend to Vercel (see root `README.md`) and backend to **Railway** / **Render** / **Fly.io** |
| **Containers** | Add a `Dockerfile` per app and a root `docker-compose.yml`; the deploy.sh logic maps almost 1:1 to a `docker compose up -d --build` |
| **Multiple environments** (staging + prod) | Two PM2 ecosystems on different ports, two nginx server blocks, two GitHub workflows (one per branch) |
