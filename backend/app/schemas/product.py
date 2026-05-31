from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict
from datetime import datetime
from ..models.product import ProductStatus


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None
    children: List["CategoryOut"] = []

    class Config:
        from_attributes = True


CategoryOut.model_rebuild()


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
    color_images: Dict[str, List[str]] = {}
    color_prices: Dict[str, float] = {}
    color_names:  Dict[str, str] = {}
    image_types:  Dict[str, str] = {}
    sizes: List[str] = []
    size_prices:  Dict[str, float] = {}
    tags: List[str] = []

    @field_validator("size_prices", "color_prices", "color_names", "image_types", "color_images", mode="before")
    @classmethod
    def coerce_none_dict(cls, v):
        return v if v is not None else {}

    @field_validator("sizes", "colors", "images", "tags", mode="before")
    @classmethod
    def coerce_none_list(cls, v):
        return v if v is not None else []
    weight: Optional[float] = None
    pricing_unit: str = "piece"
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
    color_images: Optional[Dict[str, List[str]]] = None
    color_prices: Optional[Dict[str, float]] = None
    color_names:  Optional[Dict[str, str]] = None
    image_types:  Optional[Dict[str, str]] = None
    sizes: Optional[List[str]] = None
    size_prices:  Optional[Dict[str, float]] = None
    tags: Optional[List[str]] = None
    weight: Optional[float] = None
    pricing_unit: Optional[str] = None
    is_featured: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    status: Optional[ProductStatus] = None
    sale_ends_at: Optional[datetime] = None


class ProductOut(ProductBase):
    id: int
    slug: str
    status: ProductStatus
    avg_rating: float = 0.0
    review_count: int = 0
    sale_ends_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None

    @field_validator("avg_rating", mode="before")
    @classmethod
    def coerce_avg_rating(cls, v):
        return v if v is not None else 0.0

    @field_validator("review_count", mode="before")
    @classmethod
    def coerce_review_count(cls, v):
        return v if v is not None else 0

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
