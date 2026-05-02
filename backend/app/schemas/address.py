from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AddressIn(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    country: str = "India"
    is_default: bool = False


class AddressOut(BaseModel):
    id: int
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str]
    city: str
    state: str
    pincode: str
    country: str
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True
