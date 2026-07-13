from sqlalchemy import Column, String, Boolean, Enum as SQLEnum
import enum
from .base import BaseModel


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"


class User(BaseModel):
    __tablename__ = "users"
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.STAFF, nullable=False)
    is_active = Column(Boolean, default=True)
