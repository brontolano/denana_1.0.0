"""Seed data for development."""
from app.db import SessionLocal, create_db
from app.core.security import get_password_hash
from app.models.user import User


def seed():
    create_db()
    db = SessionLocal()
    
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@denana.com",
            full_name="Administrator",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True,
        )
        db.add(admin)
    
    manager = db.query(User).filter(User.username == "manager").first()
    if not manager:
        manager = User(
            username="manager",
            email="manager@denana.com",
            full_name="Manager Utama",
            hashed_password=get_password_hash("manager123"),
            role="manager",
            is_active=True,
        )
        db.add(manager)
    
    staff = db.query(User).filter(User.username == "staff").first()
    if not staff:
        staff = User(
            username="staff",
            email="staff@denana.com",
            full_name="Staff Gudang",
            hashed_password=get_password_hash("staff123"),
            role="staff",
            is_active=True,
        )
        db.add(staff)
    
    db.commit()
    db.close()
    print("Seed completed: admin, manager, staff created.")


if __name__ == "__main__":
    seed()
