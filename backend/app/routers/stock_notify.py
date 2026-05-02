import threading
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..models.product import Product
from ..models.stock_notification import StockNotification

router = APIRouter(prefix="/stock-notify", tags=["Stock Notifications"])


class NotifyRequest(BaseModel):
    product_id: int
    email: EmailStr


@router.post("/", status_code=201)
def subscribe(payload: NotifyRequest, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(StockNotification).filter(
        StockNotification.product_id == payload.product_id,
        StockNotification.email == payload.email,
        StockNotification.is_notified == False,
    ).first()
    if existing:
        return {"message": "Already subscribed for this product"}

    db.add(StockNotification(product_id=payload.product_id, email=payload.email))
    db.commit()
    return {"message": "You'll be notified when this product is back in stock"}
