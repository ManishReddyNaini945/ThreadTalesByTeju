from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = None
    body: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    title: Optional[str]
    body: Optional[str]
    is_verified_purchase: bool
    created_at: datetime
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None

    class Config:
        from_attributes = True
