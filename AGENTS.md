# Den Ana Internal System — AGENTS.md

A compact guide for AI coding agents working on the Den Ana internal retail management system.

## Project Overview

**Den Ana**: Internal retail management for warehouse/staff.
**Stack**: FastAPI (backend), React + TypeScript (frontend), JWT auth.
**Database**: SQLAlchemy 2.0 ORM. Default `DATABASE_URL` is **SQLite** (`sqlite:///./test.db`); PostgreSQL is for production (set `DATABASE_URL` in `.env`).

## Directory Structure

```
Modul/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/v1/endpoints/   # REST endpoints (users, products, transactions)
│   │   ├── core/              # config, security (JWT), deps (auth guards)
│   │   ├── db/__init__.py      # engine + SessionLocal + get_db + create_db
│   │   ├── models/            # ORM models (User, Product, Transaction)
│   │   └── schemas/           # Pydantic validation schemas
│   ├── seed.py                # Dev seed data
│   └── requirements.txt
└── frontend/             # React + Vite + TS application
    └── src/
        ├── components/        # UI components (ui/, layout/)
        ├── hooks/            # Custom React hooks
        ├── pages/            # Page components
        ├── services/         # API clients (api.ts is the axios singleton)
        ├── store/            # Zustand state (authStore.ts)
        ├── types/            # Shared TS types (index.ts)
        └── lib/              # utils (cn = clsx + tailwind-merge)
```

## Commands

### Backend
```bash
cd backend
pip install -r requirements.txt          # deps
uvicorn app.main:app --reload            # dev server on :8000
python seed.py                           # load dev seed data
```
- No test suite yet: `pytest` installs but there are no tests. Writing tests is safe; expect them to be greenfield.
- Migrations: `alembic` is in `requirements.txt` but **not initialized** (no `alembic/` dir). Tables are created at startup via `create_db()` in `app/db/__init__.py`. Do not assume `alembic` works without `alembic init`.

### Frontend
```bash
cd frontend
npm install
npm run dev                              # Vite dev server on :5173
npm run build                            # tsc && vite build (strict typecheck gate)
npm run lint                             # eslint --max-warnings 0 (fails on any warning)
```
- There is **no `test` script** in `package.json`. Do not run `npm test`.

## Operational Gotchas

- **Backend port**: Uvicorn runs on `:8000`; FastAPI root mounted at `API_V1_PREFIX=/api/v1`.
- **Vite proxy**: `frontend/vite.config.ts` proxies `/api` → `http://localhost:8000`. Frontend code calls `/api/v1/...` (no host). Do not hardcode `localhost:8000` in frontend source.
- **Path alias**: `@` → `./src` (configured in both `vite.config.ts` and `tsconfig.json`). Use `@/components/...` imports.
- **TypeScript is strict**: `tsconfig.json` has `strict`, `noUnusedLocals`, `noUnusedParameters`. Unused imports/vars break the build.
- **API contract**: Frontend never touches the DB; all data goes through `src/services/api.ts` (axios). Auth token is read from `localStorage['den-ana-auth']` and attached by an interceptor.
- **Auth**: JWT in `Authorization: Bearer`. `get_current_active_user` guards most routes; product/transaction writes require `get_admin_user`.
- **List endpoints** (users, products, transactions) accept `page`, `page_size` (default 20, max 100), `q`, `sort_by`, `sort_dir` (asc/desc) as query params. Filtering is query-param only, never in the body.
- **Error messages** are in Bahasa Indonesia (e.g., "Produk tidak ditemukan", "Stok tidak mencukupi"). Keep new errors in Indonesian to match.

## Conventions

- **Backend password hashing uses `hashlib.sha256`** (see `app/core/security.py`), NOT bcrypt — despite `passlib[bcrypt]` being in `requirements.txt`. Follow the existing SHA256 scheme; don't introduce bcrypt.
- **Business logic lives in endpoints**, not a `services/` layer. `app/services/` does not exist. Keep new logic in the endpoint module or a helper in `models/`.
- **`calculate_selling_price`** is defined in `app/models/product.py` AND duplicated at the top of `app/api/v1/endpoints/products.py` (the endpoint imports the model's version). Don't add a third copy.
- **Roles**: `UserRole` enum values are `admin`/`manager`/`staff` (lowercase strings). `get_admin_user` checks `role != "admin"`.
- **Styling**: Tailwind only. Design tokens/colors live in `DESIGN.md` (Indonesian). Brand palette: blue `#3b82f6` primary, orange `#f97316` accent.
- **Types**: shared TS types in `src/types/index.ts`. UI strings in Indonesian.

## Troubleshooting

| Issue | Solution |
|---|---|
| 401 Unauthorized | Check `Authorization: Bearer` header / valid JWT |
| 503 / DB error | Check `DATABASE_URL` in `.env`; SQLite needs `check_same_thread=False` (already set) |
| CORS error | `CORS_ORIGINS` in `app/core/config.py` defaults to `localhost:5173`/`3000`; add origins in `.env` |
| `npm run lint` fails | Fix the warning (lint runs with `--max-warnings 0`) |
