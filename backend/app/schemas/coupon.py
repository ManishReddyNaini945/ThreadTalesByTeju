from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from ..models.coupon import DiscountType


class CouponBase(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: DiscountType = DiscountType.percentage
    discount_value: float
    min_order_amount: float = 0.0
    max_discount_amount: Optional[float] = None
    usage_limit: Optional[int] = None
    is_active: bool = True
    starts_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

    @field_validator("code")
    @classmethod
    def uppercase_code(cls, v):
        return v.strip().upper()


class CouponCreate(CouponBase):
    pass


class CouponUpdate(BaseModel):
    description: Optional[str] = None
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[float] = None
    min_order_amount: Optional[float] = None
    max_discount_amount: Optional[float] = None
    usage_limit: Optional[int] = None
    is_active: Optional[bool] = None
    starts_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None


class CouponOut(CouponBase):
    id: int
    used_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
