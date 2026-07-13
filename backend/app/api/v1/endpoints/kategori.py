from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ....db import get_db
from ....models.kategori import Kategori
from ....schemas.kategori import (
    KategoriCreate,
    KategoriUpdate,
    KategoriResponse,
    KategoriList,
)
from ....models.user import User
from ....core.deps import get_current_active_user, get_admin_user

router = APIRouter()


@router.post("/kategoris", response_model=KategoriResponse)
def create_kategori(
    data: KategoriCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if db.query(Kategori).filter(Kategori.kode == data.kode).first():
        raise HTTPException(status_code=400, detail="Kode kategori sudah ada")

    kategori = Kategori(kode=data.kode, nama=data.nama, deskripsi=data.deskripsi)
    db.add(kategori)
    db.commit()
    db.refresh(kategori)
    return kategori


@router.get("/kategoris", response_model=KategoriList)
def list_kategoris(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(Kategori)
    if q:
        query = query.filter(
            Kategori.nama.ilike(f"%{q}%") | Kategori.kode.ilike(f"%{q}%")
        )

    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    items = (
        query.order_by(Kategori.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return KategoriList(
        items=items, total=total, page=page, page_size=page_size, total_pages=total_pages
    )


@router.get("/kategoris/{kategori_id}", response_model=KategoriResponse)
def get_kategori(
    kategori_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if not kategori:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")
    return kategori


@router.put("/kategoris/{kategori_id}", response_model=KategoriResponse)
def update_kategori(
    kategori_id: int,
    data: KategoriUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if not kategori:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(kategori, field, value)

    db.commit()
    db.refresh(kategori)
    return kategori


@router.delete("/kategoris/{kategori_id}")
def delete_kategori(
    kategori_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if not kategori:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")

    db.delete(kategori)
    db.commit()
    return {"status": "deleted"}
