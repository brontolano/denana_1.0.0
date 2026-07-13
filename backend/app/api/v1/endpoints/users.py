from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from ....db import get_db
from ....core.security import create_access_token, get_password_hash, verify_password
from ....models.user import User
from ....schemas.user import UserCreate, UserUpdate, UserResponse, UserList
from ....core.deps import get_current_user, get_current_active_user, get_admin_user
from ....core.config import get_settings

settings = get_settings()
router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username sudah ada")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email sudah digunakan")
    
    user = User(
        username=data.username,
        email=data.email,
        full_name=data.full_name,
        hashed_password=get_password_hash(data.password),
        role="staff",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    
    token = create_access_token(data={"sub": user.username, "role": user.role, "user_id": user.id, "full_name": user.full_name})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/users", response_model=UserList)
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    q: Optional[str] = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if q:
        query = query.filter(User.full_name.ilike(f"%{q}%") | User.username.ilike(f"%{q}%"))
    
    total = query.count()
    
    sort_column = getattr(User, sort_by, User.created_at)
    if sort_dir == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    total_pages = (total + page_size - 1) // page_size
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return UserList(items=items, total=total, page=page, page_size=page_size, total_pages=total_pages)


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return user


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    update_data = data.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    db.delete(user)
    db.commit()
    return {"status": "deleted"}
