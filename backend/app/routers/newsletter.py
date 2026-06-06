from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..models.newsletter import NewsletterSubscriber
from ..services.email_service import _send, _base

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


class SubscribeRequest(BaseModel):
    email: EmailStr


def send_newsletter_welcome(to: str) -> None:
    content = """
      <h2 style="color:#c8a45c;margin-top:0">Welcome to the Thread Tales family!</h2>
      <p style="color:#a89f94">
        You're now subscribed to our newsletter. You'll be the first to know about new arrivals,
        exclusive collections, and special offers.
      </p>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:20px;margin:24px 0;text-align:center">
        <p style="margin:0;color:#a89f94;font-size:13px;font-style:italic">
          "Handcrafted jewelry that tells your story. Made with love, worn with pride."
        </p>
      </div>
      <a href="https://www.threadtalesbyteju.com/shop"
         style="display:inline-block;padding:12px 28px;background:#c8a45c;color:#0c0a09;
                text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase">
        Explore Our Collection
      </a>
      <p style="margin-top:24px;color:#a89f94;font-size:12px">
        If you didn't subscribe, you can safely ignore this email.
      </p>"""
    _send(to, "Welcome to Thread Tales by Teju 🧵", _base(content))


@router.post("/subscribe", status_code=201)
def subscribe(payload: SubscribeRequest, db: Session = Depends(get_db)):
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == payload.email).first()
    if existing:
        if not existing.is_active:
            existing.is_active = True
            db.commit()
        return {"message": "You're already subscribed!"}
    db.add(NewsletterSubscriber(email=payload.email))
    db.commit()
    # Send welcome email to subscriber
    try:
        send_newsletter_welcome(payload.email)
    except Exception:
        pass  # Don't fail the request if email fails
    return {"message": "Subscribed successfully! You'll hear from us soon."}
