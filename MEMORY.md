# Den Ana Internal System — MEMORY.md

> Memori konteks project untuk menjaga konsistensi antar sesi.
> Diperbarui: 12 Juli 2026

---

## Ringkasan Project

Internal management system untuk perusahaan retail **"Den Ana"**. Aplikasi web full-stack untuk manajemen stok gudang, transaksi, cetak struk Bluetooth thermal, PDF, dan panel admin. Target user: staff perusahaan retail dari semua level.

---

## Status Pengerjaan

| Komponen | Status | Catatan |
|---|---|---|
| Backend structure | SELESAI | Modular (api/core/db/models/schemas) |
| Database models | SELESAI | User, Product, Transaction |
| Pydantic schemas | SELESAI | Create/Update/Response/List per entity |
| Security (JWT) | SELESAI | Access + refresh token, bcrypt hashing |
| CRUD Users | SELESAI | Register, login, list/get/update/delete + filter |
| CRUD Products | SELESAI | Filter by status/kategori/stok/harga, pagination |
| CRUD Transactions | SELESAI | Auto-update stock, filter by date/tipe |
| OPENCODE.md | SELESAI | Konvensi kode dan arsitektur |
| MEMORY.md | SELESAI | File ini |
| DESIGN.md | SELESAI | Design system lengkap (warna, tipografi, komponen) |
| Services layer | BELUM | Logika bisnis masih langsung di endpoints |
| Frontend structure | BELUM | Belum ada file React/TS apapun |
| UI Template (React) | BELUM | Komponen UI belum dibuat |
| Frontend logic | BELUM | API integration belum dibuat |
| Docker / Deployment | BELUM | docker-compose belum ada |
| Dokumentasi komponen | BELUM | docs/components/ masih kosong |
| Initial data (seeder) | BELUM | Seed data untuk development |
| Alembic migrations | BELUM | alembic init belum dijalankan |
| .env.example | BELUM | File environment template |
| .gitignore | BELUM | Git ignore rules |

---

## File Tree Saat Ini

```
Modul/
├── OPENCODE.md
├── MEMORY.md
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py                        # FastAPI entry point
│       ├── api/
│       │   ├── __init__.py
│       │   └── v1/
│       │       ├── __init__.py
│       │       ├── api.py                 # Router aggregator
│       │       └── endpoints/
│       │           ├── __init__.py
│       │           ├── users.py           # Auth + CRUD Users
│       │           ├── products.py        # CRUD Products
│       │           └── transactions.py    # CRUD Transactions
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py                  # Settings (pydantic-settings)
│       │   ├── deps.py                    # Dependency injection (auth guards)
│       │   └── security.py               # JWT + password hashing
│       ├── db/
│       │   └── __init__.py                # Engine + SessionLocal + get_db
│       ├── models/
│       │   ├── __init__.py
│       │   ├── base.py                    # BaseModel (id, created_at, updated_at)
│       │   ├── user.py                    # User model + UserRole enum
│       │   ├── product.py                 # Product model + Category/Status enums
│       │   └── transaction.py             # Transaction model + TransactionType enum
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── common.py                  # CoreBase, TimestampSchema
│       │   ├── user.py                    # UserCreate/Update/Response/List
│       │   ├── product.py                # ProductCreate/Update/Response/List
│       │   └── transaction.py            # TransactionCreate/Update/Response/List
│       └── services/                      # (kosong, belum diimplementasi)
├── frontend/
│   └── src/
│       ├── components/                    # (kosong)
│       ├── hooks/                         # (kosong)
│       ├── pages/                         # (kosong)
│       ├── services/                      # (kosong)
│       └── store/                         # (kosong)
└── docs/
    └── components/                        # (kosong)
```

---

## API Endpoints (Kontrak)

Base: `GET /api/v1`

### Authentication & Users
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api/v1/auth/register` | - | Registrasi user baru |
| POST | `/api/v1/auth/login` | - | Login, return JWT token |
| GET | `/api/v1/auth/users` | JWT | List users + filter (role, is_active, q) |
| GET | `/api/v1/auth/users/{id}` | JWT | Detail user |
| PUT | `/api/v1/auth/users/{id}` | JWT | Update user |
| DELETE | `/api/v1/auth/users/{id}` | JWT | Hapus user |

### Products
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api/v1/products` | JWT | Buat produk baru |
| GET | `/api/v1/products` | JWT | List produk + filter (status, kategori, stok, harga, q) |
| GET | `/api/v1/products/{id}` | JWT | Detail produk |
| PUT | `/api/v1/products/{id}` | JWT | Update produk |
| DELETE | `/api/v1/products/{id}` | JWT | Hapus produk |

### Transactions
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api/v1/transactions` | JWT | Buat transaksi (auto-update stok) |
| GET | `/api/v1/transactions` | JWT | List transaksi + filter (tipe, status, date range, q) |
| GET | `/api/v1/transactions/{id}` | JWT | Detail transaksi |
| PUT | `/api/v1/transactions/{id}` | JWT | Update status transaksi |

### System
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| GET | `/` | - | Info API + versi |
| GET | `/health` | - | Health check |

---

## Database Models

### User
- id, username (unique), email (unique), full_name, hashed_password
- role: admin | manager | staff
- is_active: bool
- created_at, updated_at

### Product
- id, kode (unique), nama, kategori, harga_beli, harga_jual
- stok, stok_minimum, satuan, deskripsi
- status: aktif | tidak_aktif | habis
- created_at, updated_at

### Transaction
- id, nomor (unique, auto-generated), tipe (pembelian/penjualan/return)
- product_id (FK), user_id (FK), jumlah, harga_satuan, total_harga
- tanggal_transaksi, jenis_pembayaran, status
- created_at, updated_at

---

## Keputusan Arsitektur (ADL)

| ID | Keputusan | Alasan |
|---|---|---|
| ADL-001 | Modular backend (api/core/db/models/schemas/services) | Skalabilitas, pemisahan concern |
| ADL-002 | Error messages dalam Bahasa Indonesia | Target user staff retail Indonesia |
| ADL-003 | JWT auth (access 1 jam, refresh 7 hari) | Stateless, cocok untuk REST |
| ADL-004 | Pagination wajib di semua list endpoint | Konsistensi API, performa |
| ADL-005 | Pydantic v2 + SQLAlchemy 2.0 | Performa lebih cepat, API modern |
| ADL-006 | Filter via query params (bukan body) | REST convention, cacheable |
| ADL-007 | Response <200ms untuk 1000 data | Constraint performa eksplisit |

---

## Masalah yang Diketahui

1. `sqlalchemy.func as sqlfunc` diimport tapi tidak dipakai di beberapa endpoint
2. `TransactionType` enum ada di model tapi belum dipakai untuk validasi input
3. `SECRET_KEY` masih placeholder "change-me-in-production-use-random-string"
4. `create_db()` hanya dipanggil untuk non-SQLite — belum ada Alembic migration
5. Services layer kosong — semua logika bisnis masih langsung di endpoint handlers

---

## Rencana Selanjutnya (Prioritas)

1. Frontend Setup — React + Vite + Tailwind + TypeScript
2. Landing Page / Beranda — Hero section, quick actions, menu cards
3. Auth Pages — Login, register
4. CRUD Pages — Products, Users, Transactions (filtering + sorting)
5. API Integration — Axios service layer + Zustand store
6. Fitur Khusus — Cetak PDF, cetak struk Bluetooth thermal
7. Admin Panel — Dashboard, laporan, manajemen user
8. Docker — docker-compose (backend + frontend + postgres)
9. Seed Data — Data awal untuk development
10. Dokumentasi — Component docs di docs/components/

---

## Glossary

| Istilah | Arti |
|---|---|
| Den Ana | Nama perusahaan retail |
| Struk | Receipt / nota belanja |
| Bluetooth thermal | Printer thermal portabel via Bluetooth |
| Stok minimum | Batas stok yang memicu notifikasi restock |
| Gudang | Warehouse / tempat penyimpanan barang |
| Panel admin | Admin dashboard untuk manajemen |
| ADL | Architecture Decision Log |
