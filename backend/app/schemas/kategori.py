from typing import Optional
from .common import CoreBase, TimestampSchema


class KategoriBase(CoreBase):
    kode: str
    nama: str
    deskripsi: Optional[str] = None


class KategoriCreate(CoreBase):
    kode: str
    nama: str
    deskripsi: Optional[str] = None


class KategoriUpdate(CoreBase):
    kode: Optional[str] = None
    nama: Optional[str] = None
    deskripsi: Optional[str] = None


class KategoriResponse(KategoriBase, TimestampSchema):
    pass


class KategoriList(CoreBase):
    items: list[KategoriResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
