# ☁️ Setup Supabase + Vercel — Den Ana

Panduan integrasi dengan **Supabase** (database + storage) + **Vercel** (frontend hosting).

---

## 🟢 Bagian 1: Supabase Setup

### 1.1 Buat Project di Supabase

1. Login ke [supabase.com](https://supabase.com)
2. **New Project** → isi:
   - **Name**: `denana`
   - **Database Password**: simpan aman
   - **Region**: pilih terdekat (Singapore/Asia)
3. Tunggu provisioning (~2 menit)

### 1.2 Dapatkan Credentials

Di **Project Settings → API**:
- `Project URL`: `https://xxxxx.supabase.co`
- `anon public key`: `eyJhbGciOiJIUzI1NiIs...`

Di **Project Settings → Database**:
- `Connection string` (URI): `postgresql://postgres:pass@db.xxxxx.supabase.co:5432/postgres`

### 1.3 Setup Database (via Backend)

Backend Den Ana otomatis membuat tabel saat pertama kali jalan:

```bash
# Set DATABASE_URL ke Supabase PostgreSQL
export DATABASE_URL="postgresql://postgres:pass@db.xxxxx.supabase.co:5432/postgres"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
# Tabel akan dibuat otomatis via SQLAlchemy

# Seed data
python seed.py
```

> ⚠️ Untuk production, atur `pool_size` dan `max_overflow` di `app/db/__init__.py`.

### 1.4 Setup Storage untuk Upload Gambar

1. **Supabase Dashboard → Storage → New Bucket**
   - Name: `product-images`
   - Public bucket ✅
2. **Set Policy → New Policy → Allow all**
   - SQL: 
     ```sql
     CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'product-images');
     ```

### 1.5 Setup Auth (Opsional — ganti JWT manual)

Jika ingin pakai **Supabase Auth** bawaan:

```ts
// frontend/src/services/auth.ts
import { supabase } from '@/lib/supabase'

export const supabaseAuth = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },
  register: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  },
  logout: async () => { await supabase.auth.signOut() },
}
```

---

## ▲ Bagian 2: Vercel Setup

### 2.1 Deploy Frontend

1. Push repo ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. **Add New → Project** → pilih `denana_1.0.0`
4. **Framework Preset**: `Vite`
5. **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`

### 2.2 Environment Variables di Vercel

Set di **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` |

### 2.3 Update API Proxy (`vercel.json`)

Buka `vercel.json` dan sesuaikan `destination` ke URL backend kamu:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-BACKEND.railway.app/api/:path*"
    }
  ]
}
```

Backend bisa di-deploy di **Railway**, **Render**, atau **Fly.io**.

---

## 🚂 Bagian 3: Deploy Backend (Railway — Recommended)

### 3.1 Deploy FastAPI

```bash
# Install Railway CLI
npm i -g @railway/cli
railway login

# Dashboard → New Project → Deploy from GitHub
# Root: backend/
# Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 3.2 Environment Variables di Railway

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres:pass@db.xxxxx.supabase.co:5432/postgres` |
| `SECRET_KEY` | `your-random-secret` |
| `CORS_ORIGINS` | `["https://your-frontend.vercel.app"]` |

### 3.3 Domain Kustom

Railway → Settings → Generate Domain → `denana-api.railway.app`

Update `vercel.json` dengan domain ini:

```json
{ "source": "/api/:path*", "destination": "https://denana-api.railway.app/api/:path*" }
```

Re-deploy Vercel setelah update.

---

## ✅ Checklist Integrasi

- [ ] Supabase project aktif
- [ ] Database PostgreSQL terhubung (seed sukses)
- [ ] Storage bucket `product-images` public
- [ ] Backend di Railway/berjalan
- [ ] Frontend di Vercel terdeploy
- [ ] API proxy (`/api/*`) mengarah ke backend
- [ ] CORS di backend mengizinkan domain Vercel
- [ ] SSL/HTTPS aktif di semua layer
- [ ] Upload gambar berfungsi (test upload via admin)

---

## 📦 File-file Penting

| File | Fungsi |
|------|--------|
| `frontend/src/lib/supabase.ts` | Supabase client (DB + storage) |
| `vercel.json` | Vercel routing & proxy config |
| `.env.example` | Template environment variables |

---

## 🔗 Link Terkait

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Railway Dashboard](https://railway.app/dashboard)
