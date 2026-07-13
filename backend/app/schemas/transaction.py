from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from .common import CoreBase, TimestampSchema
from .product import ProductResponse


class TransactionBase(CoreBase):
    nomor: str
    tipe: str
    product_id: int
    user_id: int
    jumlah: int
    harga_satuan: float
    total_harga: float
    jenis_pembayaran: Optional[str] = None
    status: str = "completed"


class TransactionCreate(CoreBase):
    tipe: str
    product_id: int
    jumlah: int
    harga_satuan: float
    jenis_pembayaran: Optional[str] = None


class TransactionUpdate(CoreBase):
    status: Optional[str] = None
    jenis_pembayaran: Optional[str] = None


class TransactionResponse(TransactionBase, TimestampSchema):
    product: Optional[ProductResponse] = None
    user_name: Optional[str] = None


class TransactionList(CoreBase):
    items: list[TransactionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
