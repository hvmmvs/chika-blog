#!/bin/bash
# =============================================================================
# DEPLOY TO DROPLET
# =============================================================================
# Syncs code to the droplet and runs docker compose.
# Usage: ./deploy.sh
#
# What it does:
#   1. Syncs project files to the droplet using rsync (skips node_modules, venv, etc.)
#   2. Ensures a .env file exists on the droplet (copies .env.example if missing)
#   3. Builds and restarts containers with docker compose
#   4. Shows container status and logs
#
# First time? Run ./setup-droplet.sh first to install Docker.
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
else
    echo "ERROR: .env file not found. Copy .env.example to .env and fill in your values."
    exit 1
fi

REMOTE="${DROPLET_USER}@${DROPLET_IP}"

echo "==> Syncing files to droplet..."

# rsync flags:
#   -a          archive mode (preserves permissions, timestamps, etc.)
#   -v          verbose (shows files being transferred)
#   -z          compress during transfer (faster over network)
#   --delete    remove files on droplet that don't exist locally
#   --exclude   skip files/dirs we don't want on the server
rsync -avz --delete \
    --exclude '.git/' \
    --exclude 'node_modules/' \
    --exclude 'venv/' \
    --exclude '.venv/' \
    --exclude '__pycache__/' \
    --exclude '*.pyc' \
    --exclude '.env' \
    --exclude '.env.local' \
    --exclude 'frontend/dist/' \
    --exclude 'backend/uploads/*' \
    --exclude '.DS_Store' \
    ./ "${REMOTE}:${APP_DIR}/"

echo ""
echo "==> Ensuring .env file exists on droplet..."

# If no .env exists on the droplet yet, copy the example and generate secrets
ssh "${REMOTE}" bash -s <<'REMOTE_SCRIPT'
set -e
cd /opt/chika-blog

if [ ! -f .env ]; then
    cp .env.example .env

    # Generate random passwords/secrets automatically
    GENERATED_PG_PASS=$(openssl rand -hex 24)
    GENERATED_SECRET=$(openssl rand -hex 32)

    # Replace placeholder values in .env
    sed -i "s|change-me-to-a-strong-password|${GENERATED_PG_PASS}|" .env
    sed -i "s|change-me-to-a-random-64-char-hex-string|${GENERATED_SECRET}|" .env
    sed -i "s|CORS_ORIGINS=http://localhost|CORS_ORIGINS=http://$(grep DROPLET_IP .env | cut -d= -f2)|" .env

    echo ".env created with generated secrets."
    echo "  POSTGRES_PASSWORD: ${GENERATED_PG_PASS}"
    echo "  SECRET_KEY: ${GENERATED_SECRET}"
    echo ""
    echo "  Save these somewhere safe! They won't be shown again."
else
    echo ".env already exists, keeping current values."
fi
REMOTE_SCRIPT

echo ""
echo "==> Building and starting containers..."

ssh "${REMOTE}" bash -s <<'REMOTE_SCRIPT'
set -e
cd /opt/chika-blog
docker compose up --build -d
REMOTE_SCRIPT

echo ""
echo "==> Waiting for containers to start..."
sleep 5

echo ""
echo "==> Container status:"
ssh "${REMOTE}" "cd /opt/chika-blog && docker compose ps"

echo ""
echo "==> Recent logs:"
ssh "${REMOTE}" "cd /opt/chika-blog && docker compose logs --tail=20"

echo ""
echo "============================================"
echo "  Deployment complete!"
echo "  Visit: http://${DROPLET_IP}"
echo "============================================"
