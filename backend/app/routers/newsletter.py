from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..models.newsletter import NewsletterSubscriber

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


class SubscribeRequest(BaseModel):
    email: EmailStr


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
    return {"message": "Subscribed successfully! You'll hear from us soon."}
