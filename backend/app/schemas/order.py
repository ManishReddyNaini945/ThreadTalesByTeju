from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..models.order import OrderStatus, PaymentStatus, PaymentMethod


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_image: Optional[str]
    quantity: int
    unit_price: float
    total_price: float
    selected_color: Optional[str]
    selected_size: Optional[str]

    class Config:
        from_attributes = True


class ShippingAddressIn(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    country: str = "India"


class OrderCreate(BaseModel):
    shipping_address: ShippingAddressIn
    payment_method: PaymentMethod
    coupon_code: Optional[str] = None
    notes: Optional[str] = None


class CouponValidate(BaseModel):
    code: str
    order_amount: float


class CouponValidateResponse(BaseModel):
    valid: bool
    discount_amount: float
    message: str


class OrderOut(BaseModel):
    id: int
    order_number: str
    subtotal: float
    discount_amount: float
    shipping_amount: float
    tax_amount: float
    total_amount: float
    status: OrderStatus
    payment_status: PaymentStatus
    payment_method: Optional[PaymentMethod]
    shipping_address: dict
    coupon_code: Optional[str]
    tracking_number: Optional[str]
    tracking_url: Optional[str]
    notes: Optional[str]
    items: List[OrderItemOut]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class RazorpayOrderCreate(BaseModel):
    order_id: int


class RazorpayVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: int
