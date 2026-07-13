from sqlalchemy import Column, String, Integer, Numeric, Text, Enum as SQLEnum, ForeignKey, Boolean
import enum
import os
import base64
import uuid
from datetime import datetime
from pathlib import Path
from .base import BaseModel

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BACKEND_DIR / "uploads" / "products"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class ProductCategory(str, enum.Enum):
    ELEKTRONIK = "elektronik"
    PAKAIAN = "pakaian"
    MAKANAN = "makanan"
    MINUMAN = "minuman"
    ALAT_TULIS = "alat_tulis"
    LAINNYA = "lainnya"

class ProductStatus(str, enum.Enum):
    AKTIF = "aktif"
    TIDAK_AKTIF = "tidak_aktif"
    HABIS = "habis"

class Product(BaseModel):
    __tablename__ = "products"
    kode = Column(String(50), unique=True, nullable=False, index=True)
    nama = Column(String(200), nullable=False, index=True)
    kategori = Column(SQLEnum(ProductCategory), default=ProductCategory.LAINNYA)
    harga_beli = Column(Numeric(15, 2), nullable=False)
    harga_jual = Column(Numeric(15, 2), nullable=False)
    stok = Column(Integer, default=0)
    stok_minimum = Column(Integer, default=5)
    satuan = Column(String(20), default="pcs")
    image_url = Column(String(500), nullable=True)
    deskripsi = Column(Text, nullable=True)
    status = Column(SQLEnum(ProductStatus), default=ProductStatus.AKTIF)

def calculate_selling_price(harga_beli: float) -> float:
    """Calculate selling price based on tiered pricing structure"""
    if harga_beli <= 1000000:
        return float(harga_beli * 1.10)
    elif harga_beli <= 10000000:
        return float(harga_beli * 1.25)
    elif harga_beli <= 50000000:
        return float(harga_beli * 1.50)
    elif harga_beli <= 100000000:
        return float(harga_beli * 1.75)
    else:
        return float(harga_beli * 2.00)


def save_image(base64_str: str | None) -> str | None:
    if not base64_str or "base64," not in base64_str:
        return None
    try:
        fmt, data = base64_str.split("base64,", 1)
        ext = "jpg"
        if "png" in fmt:
            ext = "png"
        elif "gif" in fmt:
            ext = "gif"
        elif "webp" in fmt:
            ext = "webp"
        filename = f"{uuid.uuid4().hex}.{ext}"
        path = UPLOAD_DIR / filename
        with open(path, "wb") as f:
            f.write(base64.b64decode(data))
        return f"/uploads/products/{filename}"
    except Exception:
        return None
