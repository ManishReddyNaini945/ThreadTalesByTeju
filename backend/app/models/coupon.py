from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum
from ..database import Base


class DiscountType(str, enum.Enum):
    percentage = "percentage"
    fixed = "fixed"


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    discount_type = Column(Enum(DiscountType), default=DiscountType.percentage)
    discount_value = Column(Float, nullable=False)
    min_order_amount = Column(Float, default=0.0)
    max_discount_amount = Column(Float, nullable=True)  # cap for percentage discounts
    usage_limit = Column(Integer, nullable=True)
    used_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
