#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/backend"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

pip install -r requirements.txt --quiet

echo "Starting backend at http://localhost:8000"
uvicorn app.main:app --reload --port 8000
