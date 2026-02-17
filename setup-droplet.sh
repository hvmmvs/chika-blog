#!/bin/bash
# =============================================================================
# ONE-TIME DROPLET SETUP
# =============================================================================
# Run this ONCE to install Docker and prepare the droplet.
# Usage: ./setup-droplet.sh
#
# What it does:
#   1. SSHs into the droplet
#   2. Installs Docker and Docker Compose
#   3. Creates the project directory
#   4. Adds your SSH key to the droplet (already done if you can SSH in)
#
# Prerequisites:
#   - You can SSH into the droplet (set DROPLET_IP in .env)
#   - If you can't, add your SSH key via the DigitalOcean console first
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

echo "==> Connecting to droplet and installing Docker..."

ssh "${DROPLET_USER}@${DROPLET_IP}" bash -s <<'REMOTE_SCRIPT'
set -e

echo "--- Updating packages ---"
apt-get update
apt-get upgrade -y

echo "--- Installing Docker ---"
# Install Docker using the official convenience script
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "Docker installed successfully."
else
    echo "Docker already installed."
fi

# Verify docker compose is available (v2 ships with Docker)
docker compose version

echo "--- Creating app directory ---"
mkdir -p /opt/chika-blog

echo "--- Setting up firewall ---"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "=== Droplet setup complete! ==="
echo "Docker version: $(docker --version)"
REMOTE_SCRIPT

echo ""
echo "==> Droplet is ready! Now run: ./deploy.sh"
