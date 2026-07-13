from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from .core.config import get_settings
from .api.v1.api import api_router

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

try:
    from fastapi.staticfiles import StaticFiles
    uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
except Exception:
    pass

from .db import create_db
create_db()

@app.get("/")
def root():
    return {"message": "Den Ana Internal API", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "den-ana-backend"}
