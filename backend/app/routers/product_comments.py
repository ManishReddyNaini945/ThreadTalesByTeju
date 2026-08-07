from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.product import Product
from ..models.product_comment import ProductComment
from ..schemas.product_comment import CommentCreate, CommentOut

router = APIRouter(prefix="/comments", tags=["Product Comments"])


@router.get("/product/{product_id}", response_model=List[CommentOut])
def get_product_comments(product_id: int, db: Session = Depends(get_db)):
    comments = db.query(ProductComment).options(joinedload(ProductComment.user)).filter(
        ProductComment.product_id == product_id
    ).order_by(ProductComment.created_at.desc()).all()

    result = []
    for c in comments:
        out = CommentOut.model_validate(c)
        out.user_name = c.user.full_name if c.user else "Customer"
        result.append(out)
    return result


@router.post("/", response_model=CommentOut, status_code=201)
def create_comment(payload: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    comment = ProductComment(
        user_id=current_user.id,
        product_id=payload.product_id,
        message=payload.message,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    out = CommentOut.model_validate(comment)
    out.user_name = current_user.full_name
    return out


@router.delete("/{comment_id}")
def delete_own_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comment = db.query(ProductComment).filter(
        ProductComment.id == comment_id, ProductComment.user_id == current_user.id
    ).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}
