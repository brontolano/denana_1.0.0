from fastapi import APIRouter
from .endpoints import users, products, transactions, kategori, public

api_router = APIRouter()

api_router.include_router(users.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(products.router, prefix="", tags=["Products"])
api_router.include_router(transactions.router, prefix="", tags=["Transactions"])
api_router.include_router(kategori.router, prefix="", tags=["Kategoris"])
api_router.include_router(public.router, prefix="/public", tags=["Public"])
