from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    refunded = "refunded"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"


class PaymentMethod(str, enum.Enum):
    razorpay = "razorpay"
    stripe = "stripe"
    cod = "cod"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Pricing
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    shipping_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)

    # Status
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    payment_method = Column(Enum(PaymentMethod), nullable=True)

    # Payment gateway references
    razorpay_order_id = Column(String(255), nullable=True)
    razorpay_payment_id = Column(String(255), nullable=True)
    razorpay_signature = Column(String(500), nullable=True)
    stripe_session_id = Column(String(255), nullable=True)

    # Shipping address (stored as JSON snapshot)
    shipping_address = Column(JSON, nullable=False)

    # Coupon
    coupon_code = Column(String(50), nullable=True)

    # Tracking
    tracking_number = Column(String(255), nullable=True)
    tracking_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    delivered_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(500), nullable=False)
    product_image = Column(String(500), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    selected_color = Column(String(100), nullable=True)
    selected_size = Column(String(100), nullable=True)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
