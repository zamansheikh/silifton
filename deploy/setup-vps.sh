#!/usr/bin/env bash
#
# One-time Silifton VPS bootstrap (Ubuntu / Debian).
#
# Installs Node 22 LTS, git, build essentials, and PM2.
# Clones the repo (if APP_DIR doesn't already exist) and configures PM2
# to start on boot. Idempotent — re-running just refreshes things.
#
# Usage:
#   sudo bash setup-vps.sh
#
# Override defaults:
#   APP_DIR=/srv/silifton REPO_URL=git@github.com:you/repo.git \
#     RUN_USER=deploy sudo -E bash setup-vps.sh

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/silifton}"
REPO_URL="${REPO_URL:-https://github.com/zamansheikh/silifton.git}"
BRANCH="${BRANCH:-main}"
NODE_MAJOR="${NODE_MAJOR:-22}"
RUN_USER="${RUN_USER:-${SUDO_USER:-$USER}}"
RUN_HOME="$(getent passwd "$RUN_USER" | cut -d: -f6)"
LOG_DIR="/var/log/silifton"

green() { printf "\033[32m%s\033[0m\n" "$*"; }
blue()  { printf "\033[34m▸ %s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m⚠  %s\033[0m\n" "$*"; }
red()   { printf "\033[31m✗  %s\033[0m\n" "$*" >&2; }

if [[ "$EUID" -ne 0 ]]; then
  red "Run as root (or with sudo)."
  exit 1
fi

blue "Silifton VPS setup"
echo "    APP_DIR:  $APP_DIR"
echo "    REPO_URL: $REPO_URL"
echo "    BRANCH:   $BRANCH"
echo "    USER:     $RUN_USER ($RUN_HOME)"
echo "    NODE:     v$NODE_MAJOR LTS"
echo ""

# ---- 1. system packages -------------------------------------------------
blue "Updating apt and installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git build-essential ca-certificates gnupg

# ---- 2. Node.js via NodeSource -----------------------------------------
INSTALLED_NODE_MAJOR=""
if command -v node >/dev/null 2>&1; then
  INSTALLED_NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
fi
if [[ "$INSTALLED_NODE_MAJOR" != "$NODE_MAJOR" ]]; then
  blue "Installing Node.js $NODE_MAJOR LTS via NodeSource"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y -qq nodejs
else
  echo "    Node already at v$INSTALLED_NODE_MAJOR — skipping"
fi
echo "    node $(node -v), npm $(npm -v)"

# ---- 3. PM2 -------------------------------------------------------------
if ! command -v pm2 >/dev/null 2>&1; then
  blue "Installing PM2 globally"
  npm install -g pm2 --silent
else
  echo "    PM2 already installed ($(pm2 -v))"
fi

# ---- 4. Folders ---------------------------------------------------------
blue "Creating directories"
mkdir -p "$(dirname "$APP_DIR")"
mkdir -p "$LOG_DIR"
chown -R "$RUN_USER:$RUN_USER" "$LOG_DIR"
echo "    $LOG_DIR (owned by $RUN_USER)"

# ---- 5. Clone or refresh the repo --------------------------------------
if [[ ! -d "$APP_DIR/.git" ]]; then
  blue "Cloning $REPO_URL → $APP_DIR"
  sudo -u "$RUN_USER" git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  blue "Repo already present at $APP_DIR — leaving as-is"
  echo "    (deploy.sh will refresh it to origin/$BRANCH)"
fi
chown -R "$RUN_USER:$RUN_USER" "$APP_DIR"

# ---- 6. PM2 startup script (so apps survive reboot) --------------------
blue "Configuring PM2 startup on boot"
env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$RUN_USER" --hp "$RUN_HOME" || true

# ---- 7. Env file template warning --------------------------------------
echo ""
green "✓ VPS bootstrap complete."
echo ""
yellow "Two manual steps before first deploy:"
echo ""
echo "  1) Create backend env file:"
echo "       sudo -u $RUN_USER cp $APP_DIR/backend/.env.example $APP_DIR/backend/.env"
echo "       sudo -u $RUN_USER nano $APP_DIR/backend/.env"
echo "     Fill: MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET, CLOUDINARY_URL, CORS_ORIGIN"
echo ""
echo "  2) Create frontend env file:"
echo "       echo 'NEXT_PUBLIC_API_URL=https://api.your-domain.com' | sudo -u $RUN_USER tee $APP_DIR/frontend/.env.local"
echo ""
echo "Then deploy:"
echo "       sudo -u $RUN_USER bash $APP_DIR/deploy/deploy.sh"
echo ""
echo "Optional: configure nginx using $APP_DIR/deploy/nginx.conf.template"
