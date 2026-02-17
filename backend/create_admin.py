#!/usr/bin/env python3
"""Script to create an admin user."""

import sys
from getpass import getpass

from sqlalchemy.orm import Session

from app.database import engine
from app.models.user import User
from app.utils.security import get_password_hash


def create_admin():
    email = input("Admin email: ").strip()
    if not email:
        print("Email is required")
        sys.exit(1)

    password = getpass("Password: ")
    if not password:
        print("Password is required")
        sys.exit(1)

    confirm = getpass("Confirm password: ")
    if password != confirm:
        print("Passwords do not match")
        sys.exit(1)

    with Session(engine) as db:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User with email {email} already exists")
            sys.exit(1)

        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            is_admin=True,
        )
        db.add(user)
        db.commit()
        print(f"Admin user '{email}' created successfully")


if __name__ == "__main__":
    create_admin()
