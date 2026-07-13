from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from .common import CoreBase, TimestampSchema


class ProductBase(CoreBase):
    kode: str
    nama: str
    kategori: str = "lainnya"
    harga_beli: float
    harga_jual: float
    stok: int = 0
    stok_minimum: int = 5
    satuan: str = "pcs"
    image_url: Optional[str] = None
    deskripsi: Optional[str] = None
    status: str = "aktif"


class ProductCreate(CoreBase):
    kode: str
    nama: str
    kategori: str = "lainnya"
    harga_beli: float
    harga_jual: Optional[float] = None
    stok: int = 0
    stok_minimum: int = 5
    satuan: str = "pcs"
    image_base64: Optional[str] = None
    deskripsi: Optional[str] = None
    status: str = "aktif"


class ProductUpdate(CoreBase):
    kode: Optional[str] = None
    nama: Optional[str] = None
    kategori: Optional[str] = None
    harga_beli: Optional[float] = None
    harga_jual: Optional[float] = None
    stok: Optional[int] = None
    stok_minimum: Optional[int] = None
    satuan: Optional[str] = None
    image_base64: Optional[str] = None
    deskripsi: Optional[str] = None
    status: Optional[str] = None


class ProductResponse(ProductBase, TimestampSchema):
    pass


class ProductList(CoreBase):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
