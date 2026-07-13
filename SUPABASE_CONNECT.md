# 🔌 Konfigurasi Supabase — Den Ana

## 1. Data yang dibutuhkan

Buka **Supabase Dashboard → Project Settings → API**:

| Field | Contoh value | ✅ Ceklis |
|-------|-------------|-----------|
| Project URL | `https://xyzabc.supabase.co` | ☐ |
| anon public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ☐ |
| Database password | `B!smillahberkah` | ✅ |

## 2. Database Connection String

Password `B!smillahberkah` **aman digunakan langsung** (karakter `!` adalah sub-delimiter valid di URI, tidak perlu encode).

Format:
```
postgresql://postgres:B!smillahberkah@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Ganti `[PROJECT-REF]`** dengan ref project Supabase kamu (ada di URL dashboard: `https://supabase.com/dashboard/project/[REF]`).

### Contoh hasil:
```
postgresql://postgres:B!smillahberkah@db.abcdefghijklm.supabase.co:5432/postgres
```

## 3. Cara pakai

### Backend (Railway/Render/VPS):
```env
DATABASE_URL=postgresql://postgres:B!smillahberkah@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Frontend (Vercel):
```env
VITE_SUPABASE_URL=https://[PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 4. Test koneksi

Jalankan dari terminal:
```bash
# Cek koneksi database
psql "postgresql://postgres:B!smillahberkah@db.[PROJECT-REF].supabase.co:5432/postgres"

# Test migration (bikin tabel)
python -c "
from sqlalchemy import create_engine
engine = create_engine('postgresql://postgres:B!smillahberkah@db.[PROJECT-REF].supabase.co:5432/postgres')
engine.connect()
print('✅ Koneksi berhasil!')
"
```
