from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.wishlist import WishlistItem
from ..models.product import Product
from ..schemas.product import ProductOut

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("/", response_model=List[ProductOut])
def get_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(WishlistItem).options(
        joinedload(WishlistItem.product)
    ).filter(WishlistItem.user_id == current_user.id).all()
    return [item.product for item in items]


@router.post("/{product_id}", status_code=201)
def add_to_wishlist(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    if existing:
        return {"message": "Already in wishlist"}

    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    db.commit()
    return {"message": "Added to wishlist"}


@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not in wishlist")
    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}


@router.get("/ids")
def get_wishlist_ids(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(WishlistItem.product_id).filter(WishlistItem.user_id == current_user.id).all()
    return [i.product_id for i in items]
