from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from typing import List, Optional
import re
import cloudinary
import cloudinary.uploader
from ..database import get_db
from ..dependencies import get_admin_user
from ..models.user import User
from ..models.product import Product, ProductStatus
from ..models.category import Category
from ..models.order import Order, OrderStatus
from ..models.coupon import Coupon
from ..schemas.product import ProductCreate, ProductUpdate, ProductOut, CategoryCreate, CategoryOut
from ..schemas.order import OrderOut
from ..config import settings

router = APIRouter(prefix="/admin", tags=["Admin"])

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"[^\w-]", "", text)
    return text


# ── Dashboard ──────────────────────────────────────────────────────────────────
@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    total_orders = db.query(func.count(Order.id)).scalar()
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.status != OrderStatus.cancelled
    ).scalar() or 0.0
    total_products = db.query(func.count(Product.id)).scalar()
    total_users = db.query(func.count(User.id)).scalar()

    recent_orders = db.query(Order).options(
        joinedload(Order.user)
    ).order_by(desc(Order.created_at)).limit(5).all()

    orders_by_status = db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()

    return {
        "stats": {
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
            "total_products": total_products,
            "total_users": total_users,
        },
        "recent_orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "customer": o.user.full_name if o.user else "",
                "total": o.total_amount,
                "status": o.status,
                "created_at": o.created_at,
            }
            for o in recent_orders
        ],
        "orders_by_status": {str(s): c for s, c in orders_by_status},
    }


# ── Products ───────────────────────────────────────────────────────────────────
@router.get("/products", response_model=dict)
def admin_list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    query = db.query(Product).options(joinedload(Product.category))
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    total = query.count()
    items = query.order_by(desc(Product.created_at)).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [ProductOut.model_validate(p) for p in items], "total": total}


@router.post("/products", response_model=ProductOut, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    slug = slugify(payload.name)
    base_slug = slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    product = Product(**payload.model_dump(), slug=slug)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}


@router.post("/products/upload-image")
async def upload_product_image(file: UploadFile = File(...), admin: User = Depends(get_admin_user)):
    result = cloudinary.uploader.upload(
        await file.read(),
        folder="threadtales/products",
        transformation=[{"quality": "auto", "fetch_format": "auto"}]
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


# ── Categories ─────────────────────────────────────────────────────────────────
@router.get("/categories", response_model=List[CategoryOut])
def admin_list_categories(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(Category).all()


@router.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    cat = Category(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}


# ── Orders ─────────────────────────────────────────────────────────────────────
@router.get("/orders", response_model=dict)
def admin_list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    query = db.query(Order).options(joinedload(Order.items), joinedload(Order.user))
    if status:
        query = query.filter(Order.status == status)
    total = query.count()
    orders = query.order_by(desc(Order.created_at)).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [OrderOut.model_validate(o) for o in orders], "total": total}


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: OrderStatus,
    tracking_number: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    if tracking_number:
        order.tracking_number = tracking_number
    db.commit()
    return {"message": "Order status updated"}


# ── Coupons ────────────────────────────────────────────────────────────────────
@router.get("/coupons")
def list_coupons(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(Coupon).all()


@router.post("/coupons", status_code=201)
def create_coupon(payload: dict, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    coupon = Coupon(**payload)
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.delete("/coupons/{coupon_id}")
def delete_coupon(coupon_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db.delete(coupon)
    db.commit()
    return {"message": "Coupon deleted"}
