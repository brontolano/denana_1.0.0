from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import get_settings
from .api.v1.api import api_router
from .db import create_db
from pathlib import Path

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

uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.on_event("startup")
def startup_event():
    create_db()


@app.get("/")
def root():
    return {"message": "Den Ana Internal API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "den-ana-backend"}
