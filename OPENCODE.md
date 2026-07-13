# Den Ana Internal System — OPENCODE.md

## Project Identity

- **Project**: Den Ana Internal System
- **Type**: Internal warehouse/retail management system
- **Stack**: FastAPI + PostgreSQL (backend), React + Tailwind CSS (frontend)
- **Lang**: Python (backend), TypeScript (frontend)
- **Auth**: JWT (access + refresh token)
- **Database ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **API Style**: REST, JSON, paginated lists, filterable + sortable

## Directory Structure

```
den-ana/
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── api/v1/         # Route handlers
│   │   ├── core/           # Config, security, deps
│   │   ├── db/             # Engine + session
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic validation
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI entry point
│   ├── alembic/            # DB migrations
│   └── requirements.txt    # Python deps
├── frontend/               # React app (TS)
│   └── src/
│       ├── components/     # Reusable UI
│       │   ├── ui/         # Atomic components
│       │   ├── layout/     # Header, Sidebar, etc.
│       │   └── features/   # Feature-specific
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Route pages
│       ├── services/       # Axios API layer
│       └── store/          # Zustand stores
├── docs/                   # Documentation
│   └── components/         # Component docs
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Code Conventions

### Python / Backend

- **Imports**: standard lib → third-party → local, alphabetical within groups
- **Type hints**: mandatory on all function signatures
- **Naming**: snake_case for vars/functions, PascalCase for classes/models/schemas, UPPER for constants
- **Docstrings**: Google style only for public API functions
- **FastAPI routes**: use `Depends(get_db)` for sessions, `Depends(get_current_active_user)` for protected routes
- **Response schemas**: always use Pydantic `response_model` on endpoints
- **Services**: business logic goes in `services/`, not in `api/v1/endpoints/`
- **Error messages**: use Bahasa Indonesia (e.g., "Produk tidak ditemukan")
- **Pydantic**: always use `model_config = ConfigDict(from_attributes=True)` for response schemas
- **Model dump**: use `model_dump()` (Pydantic v2), never `dict()`

### TypeScript / Frontend

- **Naming**: camelCase for vars/functions, PascalCase for components/types
- **Components**: one component per file, default export
- **API calls**: all go through `src/services/` layer, never direct axios in components
- **State**: Zustand stores in `src/store/`, one store per domain
- **Hooks**: custom hooks in `src/hooks/`, always return typed values
- **Styling**: Tailwind utility classes only (no CSS modules except for animations)
- **Types**: share types via `src/types/` directory
- **Error handling**: toast notifications for user-facing errors

### Git

- **Branch**: `main` (production-ready), `develop` (active work), `feature/*` (new features)
- **Commits**: use conventional commits (feat:, fix:, refactor:, docs:, chore:)
- **No force push**, no commit to `main` directly

## Architecture Rules

1. **API is the contract**: frontend never talks directly to database
2. **Separation of concerns**: `endpoints/` only handles HTTP concerns, `services/` has business logic
3. **Pagination is mandatory**: all list endpoints use `page` + `page_size` params
4. **Filtering**: use query params, not request body for GET lists
5. **Sorting**: `sort_by` + `sort_dir` query params
6. **Auth**: JWT in `Authorization: Bearer` header, enforced on all write endpoints
7. **Performance**: API responses must be <200ms for 1000 records (use eager loading, indexed queries)

## Common Patterns

### Paginated List Response
```json
{ "items": [...], "total": 100, "page": 1, "page_size": 20, "total_pages": 5 }
```

### Error Response
```json
{ "detail": "Pesan error dalam Bahasa Indonesia" }
```

### API Route Pattern
```python
@router.get("/products", response_model=ProductList)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    q: str | None = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    ...
```

## Available Commands

```bash
# Backend
cd backend && uvicorn app.main:app --reload           # Dev server
cd backend && alembic revision --autogenerate          # Migration
cd backend && pytest                                   # Run tests

# Frontend
cd frontend && npm run dev                             # Dev server
cd frontend && npm run build                           # Production build

# Docker (full stack)
docker-compose up -d                                   # Start all services
docker-compose -f docker-compose.prod.yml up -d        # Production stack
```
