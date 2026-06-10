import logging
from datetime import datetime, timedelta

from sqlalchemy.orm import joinedload

from ..database import SessionLocal
from ..config import settings
from ..models.cart import Cart, CartItem
from .email_service import send_abandoned_cart_email

logger = logging.getLogger(__name__)

ABANDONED_AFTER = timedelta(hours=2)
REMIND_WINDOW = timedelta(hours=48)


def send_abandoned_cart_emails() -> None:
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        carts = (
            db.query(Cart)
            .join(CartItem, CartItem.cart_id == Cart.id)
            .options(joinedload(Cart.items).joinedload(CartItem.product), joinedload(Cart.user))
            .filter(Cart.abandoned_email_sent_at.is_(None))
            .distinct()
            .all()
        )

        for cart in carts:
            if not cart.items or not cart.user or not cart.user.email:
                continue

            last_activity = max(item.created_at for item in cart.items)
            age = now - last_activity.replace(tzinfo=None)
            if age < ABANDONED_AFTER or age > REMIND_WINDOW:
                continue

            items = [(item.product.name, item.quantity) for item in cart.items if item.product]
            if not items:
                continue

            cart_url = f"{settings.FRONTEND_URL}/cart"
            send_abandoned_cart_email(cart.user.email, items, cart_url)
            cart.abandoned_email_sent_at = now
            db.commit()
            logger.info(f"Abandoned cart email sent to {cart.user.email}")
    except Exception as e:
        logger.error(f"Abandoned cart job failed: {e}")
    finally:
        db.close()
