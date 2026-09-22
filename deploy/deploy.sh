#!/usr/bin/env bash
#
# Silifton deploy script.
#
# Idempotent — safe to re-run. What it does:
#   1. cd into the repo, fetch + reset to origin/main
#   2. Install deps in frontend/
#   3. Build the frontend (next build → .next/)
#   4. Reload PM2 (zero-downtime) or start it if this is the first run
#
# The API lives in the silifton-crm repo (deployed separately) — this script
# only builds and serves the public Next.js site.
#   5. Persist the PM2 process list so it survives reboots
#
# Run as the user that owns the repo (NOT root). Example:
#   bash /var/www/silifton/deploy/deploy.sh
#
# Override the repo location via APP_DIR or BRANCH:
#   APP_DIR=/srv/silifton BRANCH=staging bash deploy.sh

set -euo pipefail

# ---- config ------------------------------------------------------------
APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
BRANCH="${BRANCH:-main}"
LOG_DIR="${LOG_DIR:-/var/log/silifton}"

green() { printf "\033[32m%s\033[0m\n" "$*"; }
blue()  { printf "\033[34m▸ %s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m⚠  %s\033[0m\n" "$*"; }
red()   { printf "\033[31m✗  %s\033[0m\n" "$*" >&2; }

trap 'red "Deploy failed on line $LINENO (exit $?)"' ERR

# ---- sanity checks -----------------------------------------------------
if [[ ! -d "$APP_DIR/.git" ]]; then
  red "APP_DIR ($APP_DIR) is not a git repo. Did setup-vps.sh complete?"
  exit 1
fi

for cmd in node npm git pm2; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    red "Missing command: $cmd. Run deploy/setup-vps.sh first."
    exit 1
  fi
done

# ---- log directory (owned by deploy user, not root) --------------------
if [[ ! -d "$LOG_DIR" ]]; then
  blue "Creating log directory $LOG_DIR"
  if ! mkdir -p "$LOG_DIR" 2>/dev/null; then
    sudo mkdir -p "$LOG_DIR"
    sudo chown -R "$USER:$USER" "$LOG_DIR"
  fi
fi

cd "$APP_DIR"
blue "Deploying Silifton"
echo "    repo:   $APP_DIR"
echo "    branch: $BRANCH"
echo "    node:   $(node -v)"
echo "    npm:    $(npm -v)"
echo "    pm2:    $(pm2 -v)"
echo ""

# ---- 1. pull --------------------------------------------------------------
blue "Pull latest from origin/$BRANCH"
git fetch --quiet origin "$BRANCH"
git reset --hard "origin/$BRANCH" --quiet
git submodule update --init --recursive --quiet 2>/dev/null || true
echo "    HEAD = $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

# ---- 2. env file warning (don't fail; it may come from CI/CD secrets) ----
if [[ ! -f "$APP_DIR/frontend/.env.local" ]]; then
  yellow "frontend/.env.local is missing — NEXT_PUBLIC_API_URL should point at the CRM API."
fi

# ---- 3. frontend ---------------------------------------------------------
blue "Frontend: install + build"
cd "$APP_DIR/frontend"
npm ci --include=dev --no-audit --no-fund
npm run build
echo "    ✓ .next/ built ($(date -r .next '+%Y-%m-%d %H:%M:%S'))"

# ---- 4. PM2 reload (or start) -------------------------------------------
cd "$APP_DIR"
ECOSYSTEM="$APP_DIR/deploy/ecosystem.config.js"

# The old NestJS API process is gone; make sure a stale one isn't left running.
if pm2 describe silifton-backend >/dev/null 2>&1; then
  yellow "Removing retired silifton-backend PM2 process (API now served by silifton-crm-api)"
  pm2 delete silifton-backend >/dev/null 2>&1 || true
fi

if pm2 describe silifton-frontend >/dev/null 2>&1; then
  blue "PM2 reload (zero-downtime)"
  pm2 reload "$ECOSYSTEM" --update-env
else
  blue "PM2 first start"
  pm2 start "$ECOSYSTEM"
fi

pm2 save --silent
echo ""
green "✓ Deploy complete."
pm2 status
echo ""
echo "Logs:    pm2 logs"
echo "Status:  pm2 status"
echo "Restart: pm2 reload all"
