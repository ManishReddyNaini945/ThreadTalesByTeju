from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class ProductStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    out_of_stock = "out_of_stock"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    price = Column(Float, nullable=False)
    compare_price = Column(Float, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    stock_quantity = Column(Integer, default=0)
    sku = Column(String(100), unique=True, nullable=True)
    images = Column(JSON, default=list)  # list of image URLs
    colors = Column(JSON, default=list)  # available colors
    sizes = Column(JSON, default=list)   # available sizes
    tags = Column(JSON, default=list)
    weight = Column(Float, nullable=True)  # in grams
    is_featured = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    status = Column(Enum(ProductStatus), default=ProductStatus.active)
    avg_rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    cart_items = relationship("CartItem", back_populates="product")
    wishlist_items = relationship("WishlistItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product")
