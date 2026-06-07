import hmac
import hashlib
import json
import threading
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.order import Order, PaymentStatus, OrderStatus
from ..schemas.order import RazorpayOrderCreate, RazorpayVerify
from ..config import settings
from ..services.email_service import send_order_confirmation, send_status_update

router = APIRouter(prefix="/payments", tags=["Payments"])


def get_razorpay_client():
    import razorpay
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


# ── Create Razorpay order ──────────────────────────────────────────────────────
@router.post("/razorpay/create")
def create_razorpay_order(
    payload: RazorpayOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.id == payload.order_id, Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    amount_paise = int(order.total_amount * 100)
    if amount_paise < 100:
        raise HTTPException(status_code=400, detail="Order amount too low (minimum ₹1)")

    client = get_razorpay_client()
    rzp_order = client.order.create({
        "amount":   amount_paise,
        "currency": "INR",
        "receipt":  order.order_number,
        "notes":    {"order_id": str(order.id)},
    })

    order.razorpay_order_id = rzp_order["id"]
    db.commit()

    return {
        "razorpay_order_id": rzp_order["id"],
        "amount":            rzp_order["amount"],
        "currency":          rzp_order["currency"],
        "key":               settings.RAZORPAY_KEY_ID,
        "order_number":      order.order_number,
    }


# ── Verify payment after modal success ────────────────────────────────────────
@router.post("/razorpay/verify")
def verify_razorpay_payment(
    payload: RazorpayVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).options(joinedload(Order.items)).filter(
        Order.id == payload.order_id, Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # HMAC-SHA256 signature verification
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, payload.razorpay_signature):
        order.payment_status = PaymentStatus.failed
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed — signature mismatch")

    order.payment_status     = PaymentStatus.paid
    order.status             = OrderStatus.confirmed
    order.razorpay_payment_id = payload.razorpay_payment_id
    order.razorpay_signature  = payload.razorpay_signature
    db.commit()
    db.refresh(order)

    # Send confirmation email in background
    threading.Thread(
        target=send_order_confirmation,
        args=(current_user.email, order),
        daemon=True,
    ).start()

    return {"success": True, "message": "Payment verified", "order_number": order.order_number}


# ── Razorpay Webhook ──────────────────────────────────────────────────────────
@router.post("/razorpay/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    # Read raw body ONCE — reuse for both signature check and JSON parsing
    body = await request.body()

    # 1. Verify webhook signature
    webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET  # set this in .env
    if webhook_secret:
        signature = request.headers.get("X-Razorpay-Signature", "")
        expected = hmac.new(
            webhook_secret.encode(), body, hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

    # 2. Parse body (use raw bytes already read above)
    try:
        data = json.loads(body)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    event = data.get("event", "")

    # ── payment.authorized ───────────────────────────────────────────────────
    # Razorpay has authorized but not yet captured — mark as pending/confirmed
    if event == "payment.authorized":
        entity       = data["payload"]["payment"]["entity"]
        rzp_order_id = entity.get("order_id")
        payment_id   = entity.get("id")

        order = db.query(Order).filter(
            Order.razorpay_order_id == rzp_order_id
        ).first()
        if order and order.payment_status == PaymentStatus.pending:
            order.razorpay_payment_id = payment_id
            # Don't mark paid yet — wait for payment.captured
            db.commit()

    # ── payment.captured ──────────────────────────────────────────────────────
    elif event == "payment.captured":
        entity     = data["payload"]["payment"]["entity"]
        payment_id = entity.get("id")
        rzp_order_id = entity.get("order_id")

        order = db.query(Order).options(joinedload(Order.items)).filter(
            Order.razorpay_order_id == rzp_order_id
        ).first()

        if order and order.payment_status != PaymentStatus.paid:
            order.payment_status      = PaymentStatus.paid
            order.status              = OrderStatus.confirmed
            order.razorpay_payment_id = payment_id
            db.commit()
            db.refresh(order)

            # Email confirmation — look up user
            user = db.query(User).filter(User.id == order.user_id).first()
            if user:
                threading.Thread(
                    target=send_order_confirmation,
                    args=(user.email, order),
                    daemon=True,
                ).start()

    # ── payment.failed ────────────────────────────────────────────────────────
    elif event == "payment.failed":
        entity       = data["payload"]["payment"]["entity"]
        rzp_order_id = entity.get("order_id")

        order = db.query(Order).filter(
            Order.razorpay_order_id == rzp_order_id
        ).first()
        if order and order.payment_status == PaymentStatus.pending:
            order.payment_status = PaymentStatus.failed
            db.commit()

    # ── order.paid ────────────────────────────────────────────────────────────
    elif event == "order.paid":
        rzp_order_id = data["payload"]["order"]["entity"].get("id")
        order = db.query(Order).filter(
            Order.razorpay_order_id == rzp_order_id
        ).first()
        if order and order.payment_status != PaymentStatus.paid:
            order.payment_status = PaymentStatus.paid
            order.status         = OrderStatus.confirmed
            db.commit()

    # ── refund events ─────────────────────────────────────────────────────────
    elif event in ("refund.processed", "refund.created"):
        entity     = data["payload"]["refund"]["entity"]
        payment_id = entity.get("payment_id")

        order = db.query(Order).filter(
            Order.razorpay_payment_id == payment_id
        ).first()
        if order:
            order.payment_status = PaymentStatus.refunded
            order.status         = OrderStatus.refunded
            db.commit()

            user = db.query(User).filter(User.id == order.user_id).first()
            if user:
                threading.Thread(
                    target=send_status_update,
                    args=(user.email, order.order_number, "cancelled"),
                    daemon=True,
                ).start()

    elif event == "refund.failed":
        import logging
        entity     = data["payload"]["refund"]["entity"]
        payment_id = entity.get("payment_id")
        logging.getLogger(__name__).error(
            f"Razorpay refund FAILED for payment {payment_id} — handle manually in dashboard"
        )

    # ── dispute events ────────────────────────────────────────────────────────
    elif event.startswith("payment.dispute"):
        import logging
        logging.getLogger(__name__).warning(
            f"Razorpay dispute event: {event} | "
            f"{data.get('payload', {}).get('dispute', {}).get('entity', {}).get('id', '')}"
        )

    # ── invoice / subscription / settlement / downtime ────────────────────────
    # Not used in this store — no subscriptions, invoices, or settlement splits.
    # These events are safely ignored; Razorpay expects a 200 response which we return below.

    return {"status": "ok"}
