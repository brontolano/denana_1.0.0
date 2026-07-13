from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "Den Ana Internal"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/test.db"
    SECRET_KEY: str = "change-me-in-production-use-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
