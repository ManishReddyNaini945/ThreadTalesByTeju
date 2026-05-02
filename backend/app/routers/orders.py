import threading
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid
from datetime import datetime
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.order import Order, OrderItem, OrderStatus, PaymentMethod
from ..models.cart import Cart, CartItem
from ..models.product import Product
from ..models.coupon import Coupon, DiscountType
from ..schemas.order import OrderCreate, OrderOut, CouponValidate, CouponValidateResponse
from ..services.email_service import send_order_confirmation

router = APIRouter(prefix="/orders", tags=["Orders"])


def generate_order_number() -> str:
    return f"TTT-{uuid.uuid4().hex[:8].upper()}"


def calculate_discount(coupon: Coupon, subtotal: float) -> float:
    if coupon.min_order_amount and subtotal < coupon.min_order_amount:
        return 0.0
    if coupon.discount_type == DiscountType.percentage:
        discount = subtotal * (coupon.discount_value / 100)
        if coupon.max_discount_amount:
            discount = min(discount, coupon.max_discount_amount)
        return round(discount, 2)
    return min(coupon.discount_value, subtotal)


@router.post("/validate-coupon", response_model=CouponValidateResponse)
def validate_coupon(payload: CouponValidate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    coupon = db.query(Coupon).filter(
        Coupon.code == payload.code.upper(),
        Coupon.is_active == True
    ).first()

    if not coupon:
        return CouponValidateResponse(valid=False, discount_amount=0, message="Invalid coupon code")

    if coupon.expires_at and coupon.expires_at < datetime.utcnow():
        return CouponValidateResponse(valid=False, discount_amount=0, message="Coupon has expired")

    if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
        return CouponValidateResponse(valid=False, discount_amount=0, message="Coupon usage limit reached")

    if payload.order_amount < (coupon.min_order_amount or 0):
        return CouponValidateResponse(
            valid=False,
            discount_amount=0,
            message=f"Minimum order amount ₹{coupon.min_order_amount} required"
        )

    discount = calculate_discount(coupon, payload.order_amount)
    return CouponValidateResponse(valid=True, discount_amount=discount, message="Coupon applied successfully!")


@router.post("/", response_model=OrderOut, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Get user's cart
    cart = db.query(Cart).options(
        joinedload(Cart.items).joinedload(CartItem.product)
    ).filter(Cart.user_id == current_user.id).first()

    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = sum(item.price_at_add * item.quantity for item in cart.items)
    discount = 0.0
    coupon_code = None

    # Apply coupon
    if payload.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == payload.coupon_code.upper(),
            Coupon.is_active == True
        ).first()
        if coupon:
            discount = calculate_discount(coupon, subtotal)
            coupon.used_count += 1
            coupon_code = coupon.code

    shipping = 0.0 if subtotal >= 500 else 50.0
    tax = round(subtotal * 0.0, 2)  # No tax for now
    total = round(subtotal - discount + shipping + tax, 2)

    order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id,
        subtotal=round(subtotal, 2),
        discount_amount=discount,
        shipping_amount=shipping,
        tax_amount=tax,
        total_amount=total,
        payment_method=payload.payment_method,
        shipping_address=payload.shipping_address.model_dump(),
        coupon_code=coupon_code,
        notes=payload.notes,
    )
    db.add(order)
    db.flush()

    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_name=item.product.name,
            product_image=item.product.images[0] if item.product.images else None,
            quantity=item.quantity,
            unit_price=item.price_at_add,
            total_price=round(item.price_at_add * item.quantity, 2),
            selected_color=item.selected_color,
            selected_size=item.selected_size,
        )
        db.add(order_item)
        # Deduct stock
        item.product.stock_quantity = max(0, item.product.stock_quantity - item.quantity)

    # Clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(order)

    threading.Thread(target=send_order_confirmation, args=(current_user.email, order), daemon=True).start()

    return order


@router.get("/", response_model=List[OrderOut])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orders = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).options(joinedload(Order.items)).filter(
        Order.id == order_id, Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{order_id}/cancel")
def cancel_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).options(joinedload(Order.items)).filter(
        Order.id == order_id, Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status not in [OrderStatus.pending, OrderStatus.confirmed]:
        raise HTTPException(status_code=400, detail="Only pending or confirmed orders can be cancelled")

    order.status = OrderStatus.cancelled
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock_quantity += item.quantity
    db.commit()
    db.refresh(order)

    threading.Thread(
        target=send_status_update,
        args=(current_user.email, order.order_number, "cancelled"),
        daemon=True
    ).start()

    return {"message": "Order cancelled successfully"}
