from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base import BaseModel
from sqlalchemy.sql import func


class Transaction(BaseModel):
    __tablename__ = "transactions"
    nomor = Column(String(50), unique=True, nullable=False, index=True)
    tipe = Column(String(20), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, default=0)
    jumlah = Column(Integer, nullable=False)
    harga_satuan = Column(Numeric(15, 2), nullable=False)
    total_harga = Column(Numeric(15, 2), nullable=False)
    tanggal_transaksi = Column(DateTime(timezone=True), server_default=func.now())
    jenis_pembayaran = Column(String(50), nullable=True)
    status = Column(String(20), default="completed")

    product = relationship("Product")
    user = relationship("User")