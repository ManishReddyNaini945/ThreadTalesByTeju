from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from ..models.user import UserRole, AuthProvider


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class GoogleAuthRequest(BaseModel):
    token: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    country: str = "India"
    is_default: bool = False


class AddressOut(AddressCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str]
    avatar_url: Optional[str]
    role: UserRole
    auth_provider: AuthProvider
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenRefresh(BaseModel):
    refresh_token: str


class ChangePassword(BaseModel):
    current_password: str
    new_password: str
