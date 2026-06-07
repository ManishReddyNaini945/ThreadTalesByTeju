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


from ..routers.settings import _get as get_setting

# Fallback constants (used if DB not yet seeded)
_PROMO_THRESHOLD_DEFAULT = 999.0
_PROMO_DISCOUNT_DEFAULT  = 15.0


def _get_promo_config(db: Session):
    enabled     = get_setting(db, "promo_enabled") == "true"
    threshold   = float(get_setting(db, "promo_threshold")    or _PROMO_THRESHOLD_DEFAULT)
    discount_pct = float(get_setting(db, "promo_discount_pct") or _PROMO_DISCOUNT_DEFAULT)
    return enabled, threshold, discount_pct


PROMO_THRESHOLD = 999.0
PROMO_DISCOUNT_PCT = 15.0


def get_promo_discount(subtotal: float) -> float:
    """Auto-apply 15% off when subtotal >= ₹999. (static fallback for validate-coupon endpoint)"""
    if subtotal >= PROMO_THRESHOLD:
        return round(subtotal * (PROMO_DISCOUNT_PCT / 100), 2)
    return 0.0


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


@router.get("/promo-status")
def get_promo_status(order_amount: float, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Return whether the promo is active and how much is saved."""
    promo_enabled, promo_threshold, promo_discount_pct = _get_promo_config(db)
    eligible = promo_enabled and order_amount >= promo_threshold
    promo_discount = round(order_amount * (promo_discount_pct / 100), 2) if eligible else 0.0
    return {
        "eligible":      eligible,
        "enabled":       promo_enabled,
        "threshold":     promo_threshold,
        "discount_pct":  promo_discount_pct,
        "discount_amount": promo_discount,
        "remaining":     max(0.0, round(promo_threshold - order_amount, 2)),
    }


@router.post("", response_model=OrderOut, status_code=201)
@router.post("/", response_model=OrderOut, status_code=201, include_in_schema=False)
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
    promo_applied = False

    # Read promo config from DB
    promo_enabled, promo_threshold, promo_discount_pct = _get_promo_config(db)

    # Auto-apply promo if enabled and subtotal qualifies
    if promo_enabled and subtotal >= promo_threshold:
        discount = round(subtotal * (promo_discount_pct / 100), 2)
        promo_applied = True

    # Apply coupon only if promo is NOT already active
    if payload.coupon_code and not promo_applied:
        coupon = db.query(Coupon).filter(
            Coupon.code == payload.coupon_code.upper(),
            Coupon.is_active == True
        ).first()
        if coupon:
            coupon_discount = calculate_discount(coupon, subtotal)
            if coupon_discount > 0:
                discount = coupon_discount
                coupon.used_count += 1
                coupon_code = coupon.code

    # Free shipping only when promo is active; otherwise always ₹50
    shipping = 0.0 if promo_applied else 50.0
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


@router.get("", response_model=List[OrderOut])
@router.get("/", response_model=List[OrderOut], include_in_schema=False)
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
