from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.user import User
from .config import get_settings
from .security import decode_token

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak valid")
    
    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="User tidak aktif")
    return current_user


async def get_admin_user(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin yang boleh akses")
    return current_user
