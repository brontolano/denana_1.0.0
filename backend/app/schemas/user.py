from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
from .common import CoreBase, TimestampSchema


class UserBase(CoreBase):
    username: str
    email: EmailStr
    full_name: str
    role: str = "staff"
    is_active: bool = True


class UserCreate(CoreBase):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: str = "staff"


class UserUpdate(CoreBase):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase, TimestampSchema):
    pass


class UserList(CoreBase):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
