# 🚀 Deployment Guide — Den Ana

Panduan lengkap deployment ke production.

---

## 📦 Opsi 1: Docker Compose (Recommended)

### Prasyarat
- Docker 24+
- Docker Compose v2+
- Domain + DNS setup

### 1. Clone & Setup

```bash
git clone https://github.com/brontolano/denana_1.0.0.git
cd denana_1.0.0
```

### 2. Environment

```bash
cp .env.example .env
```

Isi `.env`:
```env
DB_PASSWORD=strong-password-here
SECRET_KEY=generate-random-32-char-string
DOMAIN=yourdomain.com
```

### 3. Build & Run

```bash
docker compose up -d --build
```

### 4. Seed Data (first run only)

```bash
docker compose exec backend python seed.py
```

### 5. Setup SSL (HTTPS)

```bash
docker compose run --rm certbot certonly --webroot \
  -w /var/www/certbot -d yourdomain.com
```

---

## 📦 Opsi 2: Manual di VPS (Ubuntu 22.04+)

### Prasyarat
- Python 3.10+
- Node.js 18+
- Nginx
- PostgreSQL (opsional)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup systemd service
sudo tee /etc/systemd/system/denana-backend.service << EOF
[Unit]
Description=Den Ana Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/denana/backend
Environment=DATABASE_URL=postgresql://user:pass@localhost:5432/denana
Environment=SECRET_KEY=your-secret-key
ExecStart=/opt/denana/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable denana-backend
sudo systemctl start denana-backend
```

### Frontend

```bash
cd frontend
npm install
npm run build
sudo cp -r dist /var/www/denana
```

### Nginx Config

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8000;
    }

    location / {
        root /var/www/denana;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📦 Opsi 3: Platform Cloud

### Render (Backend) + Vercel (Frontend)

**Backend di Render:**
1. Buat Web Service → pilih repo GitHub
2. Root Directory: `backend`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add env vars: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`

**Frontend di Vercel:**
1. Import repo → Root: `frontend`
2. Build: `npm run build`
3. Output: `dist`
4. Tambah `vercel.json`:
```json
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "https://api-backend.vercel.app/api/$1" }]
}
```

---

## ⚙️ Checklist Sebelum Launch

- [ ] Ganti `SECRET_KEY` dengan string acak kuat
- [ ] Ganti `DATABASE_URL` ke PostgreSQL
- [ ] Setup environment variables via CI/CD secrets / .env
- [ ] SSL/HTTPS aktif
- [ ] CORS di-set ke domain frontend saja
- [ ] Test endpoint health setelah deploy
- [ ] Seed data user admin
- [ ] Backup database rutin (cron job)
- [ ] Monitoring (UptimeRobot, Sentry, dll)

---

## 🩺 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| 502 Bad Gateway | Pastikan backend berjalan: `sudo systemctl status denana-backend` |
| 413 Entity Too Large | Nginx: `client_max_body_size 10M;` di http block |
| CORS error | Tambah domain di `CORS_ORIGINS` backend |
| Database error | Cek koneksi PostgreSQL: `psql -U user -d denana -h localhost` |
| File upload gagal | Pastikan `uploads/` writable: `chmod 755 uploads/` |
