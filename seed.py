"""Seed data for development."""
from app.db import SessionLocal, create_db
from app.models.user import User
from app.models.kategori import Kategori


def seed():
    create_db()
    db = SessionLocal()

    # Simple password hash for dev
    def simple_hash(pwd: str) -> str:
        import hashlib
        return hashlib.sha256(pwd.encode()).hexdigest()

    users = [
        {"username": "admin", "email": "admin@denana.com", "full_name": "Administrator", "password": "admin123", "role": "admin"},
        {"username": "manager", "email": "manager@denana.com", "full_name": "Manager Utama", "password": "manager123", "role": "manager"},
        {"username": "staff", "email": "staff@denana.com", "full_name": "Staff Gudang", "password": "staff123", "role": "staff"},
    ]

    for u in users:
        if not db.query(User).filter(User.username == u["username"]).first():
            db.add(User(
                username=u["username"],
                email=u["email"],
                full_name=u["full_name"],
                hashed_password=simple_hash(u["password"]),
                role=u["role"],
                is_active=True,
            ))

    kategoris = [
        {"kode": "elektronik", "nama": "Elektronik"},
        {"kode": "pakaian", "nama": "Pakaian"},
        {"kode": "makanan", "nama": "Makanan"},
        {"kode": "minuman", "nama": "Minuman"},
        {"kode": "alat_tulis", "nama": "Alat Tulis"},
        {"kode": "lainnya", "nama": "Lainnya"},
    ]

    for k in kategoris:
        if not db.query(Kategori).filter(Kategori.kode == k["kode"]).first():
            db.add(Kategori(kode=k["kode"], nama=k["nama"]))

    db.commit()
    db.close()
    print("Seed completed: users, categories created.")


if __name__ == "__main__":
    seed()