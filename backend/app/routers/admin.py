import threading
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc, cast, Date
from typing import List, Optional
import re
import cloudinary
import cloudinary.uploader
from ..database import get_db
from ..dependencies import get_admin_user
from ..models.user import User
from ..models.product import Product, ProductStatus
from ..models.category import Category
from ..models.order import Order, OrderItem, OrderStatus
from ..models.stock_notification import StockNotification
from ..models.coupon import Coupon
from ..schemas.product import ProductCreate, ProductUpdate, ProductOut, CategoryCreate, CategoryOut
from ..schemas.order import OrderOut
from ..config import settings
from ..services.email_service import send_status_update, send_stock_notification

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

    # Revenue by day — last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=29)
    daily_revenue = db.query(
        cast(Order.created_at, Date).label("day"),
        func.sum(Order.total_amount).label("revenue"),
        func.count(Order.id).label("orders"),
    ).filter(
        Order.created_at >= thirty_days_ago,
        Order.status != OrderStatus.cancelled,
    ).group_by(cast(Order.created_at, Date)).order_by("day").all()

    # Build complete 30-day series (fill missing days with 0)
    revenue_series = {}
    for row in daily_revenue:
        revenue_series[str(row.day)] = {"revenue": round(float(row.revenue), 2), "orders": row.orders}
    full_series = []
    for i in range(30):
        day = (thirty_days_ago + timedelta(days=i)).strftime("%Y-%m-%d")
        full_series.append({"date": day, **revenue_series.get(day, {"revenue": 0, "orders": 0})})

    # Top selling products
    from ..models.order import OrderItem
    top_products = db.query(
        OrderItem.product_name,
        func.sum(OrderItem.quantity).label("qty"),
        func.sum(OrderItem.total_price).label("revenue"),
    ).group_by(OrderItem.product_name).order_by(desc("qty")).limit(5).all()

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
        "revenue_series": full_series,
        "top_products": [{"name": r.product_name, "qty": r.qty, "revenue": round(float(r.revenue), 2)} for r in top_products],
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

    was_out_of_stock = product.stock_quantity == 0
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)

    # Notify subscribers if stock replenished
    if was_out_of_stock and product.stock_quantity > 0:
        subs = db.query(StockNotification).filter(
            StockNotification.product_id == product_id,
            StockNotification.is_notified == False,
        ).all()
        if subs:
            product_url = f"{settings.FRONTEND_URL}/product/{product.slug}"
            for sub in subs:
                sub.is_notified = True
                threading.Thread(
                    target=send_stock_notification,
                    args=(sub.email, product.name, product_url),
                    daemon=True
                ).start()
            db.commit()

    return product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}


@router.post("/products/bulk-upload")
async def bulk_upload_products(file: UploadFile = File(...), db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    import csv, io
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode("utf-8-sig")))
    required = {"name", "price", "category_id", "stock_quantity"}
    if not required.issubset(set(reader.fieldnames or [])):
        raise HTTPException(status_code=400, detail=f"CSV must have columns: {', '.join(required)}")

    created, skipped = 0, 0
    for row in reader:
        name = row.get("name", "").strip()
        if not name:
            skipped += 1
            continue
        slug_base = slugify(name)
        slug = slug_base
        counter = 1
        while db.query(Product).filter(Product.slug == slug).first():
            slug = f"{slug_base}-{counter}"
            counter += 1
        try:
            product = Product(
                name=name,
                slug=slug,
                price=float(row.get("price", 0)),
                compare_price=float(row["compare_price"]) if row.get("compare_price") else None,
                category_id=int(row.get("category_id", 0)),
                stock_quantity=int(row.get("stock_quantity", 0)),
                description=row.get("description", ""),
                short_description=row.get("short_description", ""),
                sku=row.get("sku") or None,
                images=[u.strip() for u in row.get("images", "").split("|") if u.strip()],
                colors=[c.strip() for c in row.get("colors", "").split("|") if c.strip()],
                sizes=[s.strip() for s in row.get("sizes", "").split("|") if s.strip()],
            )
            db.add(product)
            created += 1
        except Exception:
            skipped += 1
    db.commit()
    return {"created": created, "skipped": skipped}


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
    db.refresh(order)

    if order.user and order.user.email:
        threading.Thread(
            target=send_status_update,
            args=(order.user.email, order.order_number, status.value, tracking_number),
            daemon=True
        ).start()

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
