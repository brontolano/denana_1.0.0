# 🏪 Den Ana — Sistem Manajemen Retail Internal

**Den Ana** adalah sistem manajemen retail internal untuk mengelola stok gudang, transaksi penjualan/pembelian, dan operasional staf — dilengkapi **katalog publik** untuk pembeli langsung.

---

## 📌 Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| **🔐 Autentikasi** | Login/register, JWT token, role-based access (admin/manager/staff) |
| **📦 Manajemen Produk** | CRUD produk, upload gambar base64, kategori, stok minimum alert |
| **💳 Transaksi** | Penjualan, pembelian, return — update stok otomatis |
| **🧾 POS Kasir** | Grid produk cepat, keranjang, checkout + cetak struk Bluetooth |
| **🏷️ Kategori** | Atur kategori produk |
| **👥 Manajemen User** | Admin bisa kelola role & status pengguna |
| **🏬 Storefront Publik** | Landing page katalog produk + keranjang + pemesanan tanpa login |
| **📊 Dashboard** | Statistik real-time + aksi cepat admin |
| **🖨️ Cetak Struk** | Thermal printer via Bluetooth atau print browser |
| **📄 Laporan PDF** | Generate laporan produk, transaksi, user |

---

## 🧱 Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Python 3.14+, FastAPI, SQLAlchemy 2.0, SQLite/PostgreSQL |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **State** | Zustand (+ persist middleware) |
| **Auth** | JWT (python-jose), SHA256 password hashing |
| **HTTP Client** | Axios + interceptor auth token |

---

## 🚀 Quick Start

### Prasyarat
- Python 3.10+
- Node.js 18+
- npm 9+

### 1. Clone & Setup

```bash
git clone https://github.com/brontolano/denana_1.0.0.git
cd denana_1.0.0
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
python seed.py                # seed data awal
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                   # dev server di http://localhost:5173
```

### 4. Buka Browser

```
http://localhost:5173          → Landing page / storefront
http://localhost:8000/docs     → Swagger API docs
```

---

## 🔑 Akun Default (Seed)

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `manager` | `manager123` | Manager |
| `staff` | `staff123` | Staff |

---

## 📁 Struktur Project

```
denana_1.0.0/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # REST endpoints
│   │   ├── core/               # config, security, deps
│   │   ├── db/                 # engine, session
│   │   ├── models/             # ORM models
│   │   └── schemas/            # Pydantic schemas
│   ├── seed.py                 # seed data
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # UI komponen
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Halaman (Landing, Login, Dashboard, dll)
│   │   ├── services/           # API client + print + report
│   │   ├── store/              # Zustand state
│   │   └── types/              # TypeScript types
│   ├── index.html
│   └── vite.config.ts
├── seed.py
├── .gitignore
├── AGENTS.md
└── README.md
```

---

## 🐳 Deploy dengan Docker

Lihat file [DEPLOY.md](DEPLOY.md) untuk panduan lengkap deployment menggunakan Docker + Nginx.

### Ringkasan:

```bash
docker compose up -d --build
docker compose exec backend python seed.py
```

---

## 🛠️ Environment Variables

Buat file `.env` di `backend/`:

```env
DATABASE_URL=sqlite:///./test.db        # SQLite (dev)
# DATABASE_URL=postgresql://user:pass@host:5432/denana  # PostgreSQL (prod)
SECRET_KEY=change-me-in-production
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
DEBUG=True
```

---

## 📄 API Documentation

Setelah backend berjalan:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Endpoint Publik (tanpa auth)

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/v1/public/products` | Lihat katalog produk |
| GET | `/api/v1/public/products/{id}` | Detail produk |
| POST | `/api/v1/public/orders` | Pesan sebagai tamu |

---

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur: `git checkout -b feat/fitur-keren`
3. Commit: `git commit -m "feat: tambah fitur keren"`
4. Push: `git push origin feat/fitur-keren`
5. Buka Pull Request

---

## 📝 Lisensi

MIT © 2026 Den Ana
