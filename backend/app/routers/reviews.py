from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.review import Review
from ..models.product import Product
from ..models.order import Order, OrderItem
from ..schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/product/{product_id}", response_model=List[ReviewOut])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(
        Review.product_id == product_id,
        Review.is_approved == True
    ).order_by(Review.created_at.desc()).all()

    result = []
    for r in reviews:
        out = ReviewOut.model_validate(r)
        out.user_name = r.user.full_name if r.user else "Anonymous"
        out.user_avatar = r.user.avatar_url if r.user else None
        result.append(out)
    return result


@router.post("/", response_model=ReviewOut, status_code=201)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.product_id == payload.product_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already reviewed this product")

    # Check verified purchase
    purchased = db.query(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        OrderItem.product_id == payload.product_id
    ).first()

    review = Review(
        user_id=current_user.id,
        product_id=payload.product_id,
        rating=payload.rating,
        title=payload.title,
        body=payload.body,
        is_verified_purchase=purchased is not None,
    )
    db.add(review)
    db.flush()

    # Update product avg rating
    avg = db.query(func.avg(Review.rating)).filter(
        Review.product_id == payload.product_id, Review.is_approved == True
    ).scalar() or 0.0
    count = db.query(func.count(Review.id)).filter(
        Review.product_id == payload.product_id, Review.is_approved == True
    ).scalar() or 0

    product.avg_rating = round(float(avg), 1)
    product.review_count = count
    db.commit()
    db.refresh(review)

    out = ReviewOut.model_validate(review)
    out.user_name = current_user.full_name
    out.user_avatar = current_user.avatar_url
    return out


@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    review = db.query(Review).filter(Review.id == review_id, Review.user_id == current_user.id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}
