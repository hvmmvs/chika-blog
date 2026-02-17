"""Seed the admin user on first run. Idempotent — skips if user already exists."""

import os

from sqlalchemy.orm import Session

from app.database import engine
from app.models.user import User
from app.utils.security import get_password_hash


ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]


def seed_admin():
    with Session(engine) as db:
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if existing:
            print(f"Admin user '{ADMIN_EMAIL}' already exists, skipping seed.")
            return

        user = User(
            email=ADMIN_EMAIL,
            hashed_password=get_password_hash(ADMIN_PASSWORD),
            is_admin=True,
        )
        db.add(user)
        db.commit()
        print(f"Admin user '{ADMIN_EMAIL}' created successfully.")


if __name__ == "__main__":
    seed_admin()
