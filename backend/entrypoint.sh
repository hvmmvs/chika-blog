#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
until pg_isready -h postgres -U chika -d chika_blog -q; do
  sleep 1
done
echo "PostgreSQL is ready."

echo "Running database migrations..."
alembic upgrade head

echo "Seeding admin user..."
python seed.py

echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
