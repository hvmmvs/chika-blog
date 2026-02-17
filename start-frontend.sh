#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/frontend"

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting frontend at http://localhost:5173"
npm run dev
