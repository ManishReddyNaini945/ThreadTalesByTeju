from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..models.product import ProductStatus


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    category_id: int
    stock_quantity: int = 0
    sku: Optional[str] = None
    images: List[str] = []
    colors: List[str] = []
    sizes: List[str] = []
    tags: List[str] = []
    weight: Optional[float] = None
    is_featured: bool = False
    is_bestseller: bool = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    compare_price: Optional[float] = None
    category_id: Optional[int] = None
    stock_quantity: Optional[int] = None
    sku: Optional[str] = None
    images: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    weight: Optional[float] = None
    is_featured: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    status: Optional[ProductStatus] = None
    sale_ends_at: Optional[datetime] = None


class ProductOut(ProductBase):
    id: int
    slug: str
    status: ProductStatus
    avg_rating: float
    review_count: int
    sale_ends_at: Optional[datetime] = None
    created_at: datetime
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True


class ProductFilter(BaseModel):
    category_slug: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    colors: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    search: Optional[str] = None
    sort_by: Optional[str] = "created_at"  # price_asc, price_desc, rating, newest
    page: int = 1
    page_size: int = 20
