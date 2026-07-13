from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import time
from ....db import get_db
from ....models.product import Product
from ....models.transaction import Transaction
from ....schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse, TransactionList
from ....models.user import User
from ....core.deps import get_current_active_user, get_admin_user
from ....core.config import get_settings

settings = get_settings()
router = APIRouter()


@router.post("/transactions", response_model=TransactionResponse)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")

    if data.tipe == "penjualan" and product.stok < data.jumlah:
        raise HTTPException(status_code=400, detail="Stok tidak mencukupi")

    total_harga = data.jumlah * data.harga_satuan

    transaction = Transaction(
        tipe=data.tipe,
        product_id=data.product_id,
        user_id=current_user.id,
        jumlah=data.jumlah,
        harga_satuan=data.harga_satuan,
        total_harga=total_harga,
        jenis_pembayaran=data.jenis_pembayaran,
        nomor=f"TRX-{current_user.id}-{time.time_ns()}",
        status="completed",
    )
    db.add(transaction)

    if data.tipe == "penjualan":
        product.stok -= data.jumlah
    elif data.tipe == "pembelian":
        product.stok += data.jumlah

    db.commit()
    db.refresh(transaction)
    return transaction


@router.get("/transactions", response_model=TransactionList)
def list_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    tipe: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    q: Optional[str] = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(Transaction)

    if tipe:
        query = query.filter(Transaction.tipe == tipe)
    if status:
        query = query.filter(Transaction.status == status)
    if start_date:
        query = query.filter(Transaction.tanggal_transaksi >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(Transaction.tanggal_transaksi <= datetime.fromisoformat(end_date))
    if q:
        query = query.filter(Transaction.nomor.ilike(f"%{q}%"))

    total = query.count()

    sort_column = getattr(Transaction, sort_by, Transaction.created_at)
    if sort_dir == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    total_pages = (total + page_size - 1) // page_size
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return TransactionList(items=items, total=total, page=page, page_size=page_size, total_pages=total_pages)


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")
    return transaction


@router.put("/transactions/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, data: TransactionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    product = db.query(Product).filter(Product.id == transaction.product_id).first()
    if product:
        if transaction.tipe == "penjualan":
            product.stok += transaction.jumlah
        elif transaction.tipe == "pembelian":
            product.stok -= transaction.jumlah
    
    db.delete(transaction)
    db.commit()
    return {"status": "deleted"}
