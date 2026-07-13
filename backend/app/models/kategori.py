from sqlalchemy import Column, String, Integer
from .base import BaseModel


class Kategori(BaseModel):
    __tablename__ = "kategoris"
    kode = Column(String(50), unique=True, nullable=False, index=True)
    nama = Column(String(100), nullable=False, index=True)
    deskripsi = Column(String(500), nullable=True)
