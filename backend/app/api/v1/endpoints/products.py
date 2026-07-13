from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ....db import get_db
from ....models.product import Product, calculate_selling_price, save_image
from ....schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductList
from ....models.user import User
from ....core.deps import get_current_active_user, get_admin_user
from ....core.config import get_settings

settings = get_settings()
router = APIRouter()


@router.post("/products", response_model=ProductResponse)
def create_product(data: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    existing = db.query(Product).filter(Product.kode == data.kode).first()
    if existing:
        raise HTTPException(status_code=400, detail="Kode produk sudah ada")
    
    harga_jual = data.harga_jual if data.harga_jual else calculate_selling_price(float(data.harga_beli))
    image_url = save_image(data.image_base64) if data.image_base64 else None
    
    product = Product(
        kode=data.kode,
        nama=data.nama,
        kategori=data.kategori,
        harga_beli=data.harga_beli,
        harga_jual=harga_jual,
        stok=data.stok,
        stok_minimum=data.stok_minimum,
        satuan=data.satuan,
        image_url=image_url,
        deskripsi=data.deskripsi,
        status=data.status,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/products", response_model=ProductList)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    kategori: Optional[str] = None,
    stok_below: Optional[int] = None,
    harga_from: Optional[float] = None,
    harga_to: Optional[float] = None,
    q: Optional[str] = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(Product)
    
    if status:
        query = query.filter(Product.status == status)
    if kategori:
        query = query.filter(Product.kategori == kategori)
    if stok_below:
        query = query.filter(Product.stok <= stok_below)
    if harga_from:
        query = query.filter(Product.harga_jual >= harga_from)
    if harga_to:
        query = query.filter(Product.harga_jual <= harga_to)
    if q:
        query = query.filter(Product.nama.ilike(f"%{q}%") | Product.kode.ilike(f"%{q}%"))
    
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
def get_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
    return product


@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
    
    update_data = data.model_dump(exclude_unset=True)
    if "image_base64" in update_data and update_data["image_base64"]:
        image_url = save_image(update_data["image_base64"])
        if image_url:
            update_data["image_url"] = image_url
        del update_data["image_base64"]
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
    
    db.delete(product)
    db.commit()
    return {"status": "deleted"}
