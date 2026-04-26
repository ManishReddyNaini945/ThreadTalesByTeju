import razorpay
import hmac
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.order import Order, PaymentStatus, OrderStatus
from ..schemas.order import RazorpayOrderCreate, RazorpayVerify
from ..config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])


def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@router.post("/razorpay/create")
def create_razorpay_order(
    payload: RazorpayOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == payload.order_id, Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    client = get_razorpay_client()
    rzp_order = client.order.create({
        "amount": int(order.total_amount * 100),  # paise
        "currency": "INR",
        "receipt": order.order_number,
        "notes": {"order_id": str(order.id)}
    })

    order.razorpay_order_id = rzp_order["id"]
    db.commit()

    return {
        "razorpay_order_id": rzp_order["id"],
        "amount": rzp_order["amount"],
        "currency": rzp_order["currency"],
        "key": settings.RAZORPAY_KEY_ID,
        "order_number": order.order_number,
    }


@router.post("/razorpay/verify")
def verify_razorpay_payment(
    payload: RazorpayVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == payload.order_id, Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Verify signature
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()

    if expected != payload.razorpay_signature:
        order.payment_status = PaymentStatus.failed
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")

    order.payment_status = PaymentStatus.paid
    order.status = OrderStatus.confirmed
    order.razorpay_payment_id = payload.razorpay_payment_id
    order.razorpay_signature = payload.razorpay_signature
    db.commit()

    return {"success": True, "message": "Payment verified", "order_number": order.order_number}


@router.post("/razorpay/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    data = await request.json()
    event = data.get("event")

    if event == "payment.captured":
        payment_id = data["payload"]["payment"]["entity"]["id"]
        order = db.query(Order).filter(Order.razorpay_payment_id == payment_id).first()
        if order:
            order.payment_status = PaymentStatus.paid
            order.status = OrderStatus.confirmed
            db.commit()

    return {"status": "ok"}
