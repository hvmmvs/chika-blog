#!/bin/bash
# =============================================================================
# RUN LOCALLY FOR DEVELOPMENT
# =============================================================================
# Sets up and starts the backend and frontend for local development.
# Usage: ./dev.sh
#
# What it does:
#   1. Ensures the backend .env file exists (copies .env.example if missing)
#   2. Sets up the Python virtual environment and installs dependencies
#   3. Ensures the frontend .env file exists and installs npm dependencies
#   4. Starts both the backend (port 8000) and frontend (port 5173)
#   5. Ctrl-C stops both processes
#
# First time? Run ./setup-db.sh first to create the database.
# =============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# --- Backend setup ---

echo "==> Setting up backend..."

if [ ! -f "$BACKEND_DIR/.env" ]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    echo "    Created .env from .env.example"
else
    echo "    .env already exists, keeping current values."
fi

if [ ! -d "$BACKEND_DIR/venv" ]; then
    echo "    Creating virtual environment..."
    python3 -m venv "$BACKEND_DIR/venv"
fi

source "$BACKEND_DIR/venv/bin/activate"

echo "    Installing dependencies..."
pip install -r "$BACKEND_DIR/requirements.txt" --quiet

# --- Frontend setup ---

echo ""
echo "==> Setting up frontend..."

if [ ! -f "$FRONTEND_DIR/.env" ]; then
    cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
    echo "    Created .env from .env.example"
else
    echo "    .env already exists, keeping current values."
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "    Installing dependencies..."
    (cd "$FRONTEND_DIR" && npm install)
fi

# --- Start both services ---

echo ""
echo "============================================"
echo "  Starting dev servers..."
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo "  Press Ctrl-C to stop both."
echo "============================================"
echo ""

# Trap Ctrl-C to kill both background processes
cleanup() {
    echo ""
    echo "==> Stopping dev servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "    Done."
}
trap cleanup EXIT INT TERM

# Start backend in background
(cd "$BACKEND_DIR" && source venv/bin/activate && uvicorn app.main:app --reload --port 8000) &
BACKEND_PID=$!

# Start frontend in background
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

# Wait for either to exit
wait $BACKEND_PID $FRONTEND_PID
