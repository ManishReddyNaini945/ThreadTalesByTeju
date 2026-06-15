import logging
from datetime import datetime, timedelta

from sqlalchemy.orm import joinedload

from ..database import SessionLocal
from ..models.order import Order, OrderStatus, PaymentStatus, PaymentMethod
from .email_service import send_payment_reminder, send_admin_payment_alert

logger = logging.getLogger(__name__)

PENDING_AFTER = timedelta(minutes=30)
REMIND_WINDOW = timedelta(hours=24)


def send_pending_payment_reminders() -> None:
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        orders = (
            db.query(Order)
            .options(joinedload(Order.user))
            .filter(
                Order.payment_status == PaymentStatus.pending,
                Order.status == OrderStatus.pending,
                Order.payment_method != PaymentMethod.cod,
                Order.payment_reminder_sent_at.is_(None),
            )
            .all()
        )

        for order in orders:
            age = now - order.created_at.replace(tzinfo=None)
            if age < PENDING_AFTER or age > REMIND_WINDOW:
                continue
            if not order.user or not order.user.email:
                continue

            send_payment_reminder(order.user.email, order)
            send_admin_payment_alert(order, "pending")
            order.payment_reminder_sent_at = now
            db.commit()
            logger.info(f"Payment reminder sent for order #{order.order_number}")
    except Exception as e:
        logger.error(f"Payment reminder job failed: {e}")
    finally:
        db.close()
