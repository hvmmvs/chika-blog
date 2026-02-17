#!/bin/bash
# =============================================================================
# INITIALIZE SSL CERTIFICATES
# =============================================================================
# Run this ONCE after the first deploy to obtain Let's Encrypt certificates.
# Usage: ./init-ssl.sh
#
# Prerequisites:
#   - DNS for your domain must point to the droplet IP
#   - The app must be running (./deploy.sh already ran)
#
# What it does:
#   1. Deploys latest code (with certbot support)
#   2. Requests a certificate from Let's Encrypt
#   3. Switches nginx to the HTTPS config
#   4. Reloads nginx
#   5. Updates CORS to use https://
#
# After this, the certbot container auto-renews every 12 hours.
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
EMAIL="${ADMIN_EMAIL}"

echo "==> Step 1: Deploying latest code..."
./deploy.sh

echo ""
echo "==> Step 2: Requesting SSL certificate from Let's Encrypt..."

ssh "${REMOTE}" bash -s <<REMOTE_SCRIPT
set -e
cd ${APP_DIR}

# Request the certificate using certbot as a one-off container
docker compose run --rm certbot certonly \
    --webroot \
    -w /var/www/certbot \
    -d ${DOMAIN} \
    -d www.${DOMAIN} \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    --force-renewal

echo ""
echo "==> Step 3: Switching nginx to HTTPS config..."

# Swap to the SSL config inside the running container
docker compose exec nginx sh -c 'cp /etc/nginx/nginx-ssl.conf /etc/nginx/conf.d/default.conf'

echo ""
echo "==> Step 4: Reloading nginx..."
docker compose exec nginx nginx -s reload

echo ""
echo "==> Step 5: Updating CORS origins to HTTPS..."
sed -i 's|CORS_ORIGINS=.*|CORS_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}|' .env

echo ""
echo "==> Step 6: Restarting backend with new CORS..."
docker compose up -d backend

echo ""
echo "=== SSL setup complete! ==="
echo "Visit: https://${DOMAIN}"
REMOTE_SCRIPT
