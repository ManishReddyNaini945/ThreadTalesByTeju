from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .product import ProductOut


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    selected_color: Optional[str] = None
    selected_size: Optional[str] = None


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    selected_color: Optional[str]
    selected_size: Optional[str]
    price_at_add: float
    product: ProductOut

    class Config:
        from_attributes = True


class CartOut(BaseModel):
    id: int
    items: List[CartItemOut]
    subtotal: float
    item_count: int

    class Config:
        from_attributes = True
