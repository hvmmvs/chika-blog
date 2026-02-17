#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"

# Load root .env for admin credentials
if [ -f "$SCRIPT_DIR/.env" ]; then
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
else
    echo "ERROR: .env file not found. Copy .env.example to .env and fill in your values."
    exit 1
fi

# Load database config from backend .env
if [ -f "$BACKEND_DIR/.env" ]; then
    source <(grep -E '^(DATABASE_URL)=' "$BACKEND_DIR/.env")
fi

DB_USER="${DB_USER:-chika}"
DB_PASSWORD="${DB_PASSWORD:-change-me}"
DB_NAME="${DB_NAME:-chika_blog}"

# Parse from DATABASE_URL if available
if [ -n "$DATABASE_URL" ]; then
    DB_USER=$(echo "$DATABASE_URL" | sed -n 's|.*://\([^:]*\):.*|\1|p')
    DB_PASSWORD=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')
    DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
fi

echo "Setting up PostgreSQL database..."
echo "  User:     $DB_USER"
echo "  Database: $DB_NAME"

# Create role if it doesn't exist
if psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
    echo "Role '$DB_USER' already exists, skipping."
else
    echo "Creating role '$DB_USER'..."
    psql postgres -c "CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';"
fi

# Create database if it doesn't exist
if psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
    echo "Database '$DB_NAME' already exists, skipping."
else
    echo "Creating database '$DB_NAME'..."
    psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
fi

# Grant privileges
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true

# Run Alembic migrations
echo ""
echo "Running database migrations..."
cd "$BACKEND_DIR"
source venv/bin/activate
alembic upgrade head

# Seed an admin user
echo ""
echo "Seeding admin user..."
python -c "
import os
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.utils.security import get_password_hash

admin_email = os.environ['ADMIN_EMAIL']
admin_password = os.environ['ADMIN_PASSWORD']

Base.metadata.create_all(bind=engine)
db = SessionLocal()

existing = db.query(User).filter(User.email == admin_email).first()
if existing:
    print('Admin user already exists, skipping.')
else:
    admin = User(
        email=admin_email,
        hashed_password=get_password_hash(admin_password),
        is_admin=True,
    )
    db.add(admin)
    db.commit()
    print(f'Created admin user: {admin_email}')

db.close()
"

echo ""
echo "Database setup complete!"
