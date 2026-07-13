from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import time
from pydantic import BaseModel, ConfigDict
from ....db import get_db
from ....models.product import Product
from ....models.transaction import Transaction
from ....schemas.product import ProductResponse, ProductList
from ....schemas.common import CoreBase

router = APIRouter()

class GuestOrderCreate(CoreBase):
    tipe: str = "penjualan"
    product_id: int
    jumlah: int = 1
    harga_satuan: float
    jenis_pembayaran: Optional[str] = "cash"
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    customer_address: Optional[str] = None
    notes: Optional[str] = None

@router.get("/products", response_model=ProductList)
def public_list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    kategori: Optional[str] = None,
    q: Optional[str] = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.status == "aktif")
    if kategori:
        query = query.filter(Product.kategori == kategori)
    if q:
        query = query.filter(Product.nama.ilike(f"%{q}%"))
    total = query.count()
    sort_column = getattr(Product, sort_by, Product.created_at)
    if sort_dir == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    total_pages = (total + page_size - 1) // page_size
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return ProductList(items=items, total=total, page=page, page_size=page_size, total_pages=total_pages)

@router.get("/products/{product_id}", response_model=ProductResponse)
def public_get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.status == "aktif").first()
    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
    return product

@router.post("/orders")
def create_guest_order(data: GuestOrderCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.product_id, Product.status == "aktif").first()
    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
    if product.stok < data.jumlah:
        raise HTTPException(status_code=400, detail="Stok tidak mencukupi")
    total_harga = data.jumlah * data.harga_satuan
    transaction = Transaction(
        tipe=data.tipe,
        product_id=data.product_id,
        user_id=None,
        jumlah=data.jumlah,
        harga_satuan=data.harga_satuan,
        total_harga=total_harga,
        jenis_pembayaran=data.jenis_pembayaran,
        nomor=f"ORD-{int(time.time_ns() * 1000)}",
        status="pending",
    )
    db.add(transaction)
    product.stok -= data.jumlah
    db.commit()
    db.refresh(transaction)
    return transaction
