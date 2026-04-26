from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, asc, desc
from typing import List, Optional
from ..database import get_db
from ..models.product import Product, ProductStatus
from ..models.category import Category
from ..schemas.product import ProductOut, ProductFilter, CategoryOut
import re

router = APIRouter(prefix="/products", tags=["Products"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"[^\w-]", "", text)
    return text


@router.get("/", response_model=dict)
def list_products(
    category_slug: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    colors: Optional[str] = Query(None),  # comma-separated
    is_featured: Optional[bool] = Query(None),
    is_bestseller: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("newest"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product).options(joinedload(Product.category)).filter(
        Product.status == ProductStatus.active
    )

    if category_slug:
        cat = db.query(Category).filter(Category.slug == category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    if is_bestseller is not None:
        query = query.filter(Product.is_bestseller == is_bestseller)
    if search:
        query = query.filter(
            or_(Product.name.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%"))
        )

    sort_map = {
        "newest": desc(Product.created_at),
        "price_asc": asc(Product.price),
        "price_desc": desc(Product.price),
        "rating": desc(Product.avg_rating),
    }
    query = query.order_by(sort_map.get(sort_by, desc(Product.created_at)))

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": [ProductOut.model_validate(p) for p in items],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
    }


@router.get("/featured", response_model=List[ProductOut])
def featured_products(limit: int = 8, db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.is_featured == True, Product.status == ProductStatus.active
    ).limit(limit).all()
    return products


@router.get("/bestsellers", response_model=List[ProductOut])
def bestsellers(limit: int = 8, db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.is_bestseller == True, Product.status == ProductStatus.active
    ).limit(limit).all()
    return products


@router.get("/categories", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order).all()


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(joinedload(Product.category)).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
