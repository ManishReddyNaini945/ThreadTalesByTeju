from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from typing import Optional
from sqlalchemy.orm import Session, joinedload
import cloudinary
import cloudinary.uploader
from ..config import settings
from ..limiter import limiter
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.cart import Cart, CartItem
from ..models.product import Product, ProductStatus
from ..schemas.cart import CartItemCreate, CartItemUpdate, CartOut, CartItemOut

router = APIRouter(prefix="/cart", tags=["Cart"])


def _get_or_create_cart(user: User, db: Session) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def _build_cart_out(cart: Cart) -> CartOut:
    items = cart.items if cart.items else []
    subtotal = sum(i.price_at_add * i.quantity for i in items)
    return CartOut(
        id=cart.id,
        items=[CartItemOut.model_validate(i) for i in items],
        subtotal=round(subtotal, 2),
        item_count=sum(i.quantity for i in items),
    )


@router.get("", response_model=CartOut)
@router.get("/", response_model=CartOut, include_in_schema=False)
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = db.query(Cart).options(
        joinedload(Cart.items).joinedload(CartItem.product)
    ).filter(Cart.user_id == current_user.id).first()

    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return _build_cart_out(cart)


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

MAX_REFERENCE_IMAGE_BYTES = 5 * 1024 * 1024


@router.post("/reference-image")
@limiter.limit("20/hour")
async def upload_reference_image(request: Request, file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    """Customer uploads a photo to go with an item, e.g. the saree the bangles should match."""
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")
    data = await file.read()
    if len(data) > MAX_REFERENCE_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image must be 5 MB or smaller")
    try:
        result = cloudinary.uploader.upload(
            data,
            folder="threadtales/customer-references",
            resource_type="image",
            transformation=[{"width": 1600, "height": 1600, "crop": "limit", "quality": "auto", "fetch_format": "auto"}],
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Could not upload this image. Please try another one.")
    return {"url": result["secure_url"]}


def _is_own_reference_image(url: str) -> bool:
    return (url.startswith(f"https://res.cloudinary.com/{settings.CLOUDINARY_CLOUD_NAME}/image/upload/")
            and "/threadtales/customer-references/" in url)


def _unit_price(product: Product, color: Optional[str], size: Optional[str]) -> float:
    """Same precedence as the product page: colour price, then size price, then base price."""
    if color and (product.color_prices or {}).get(color):
        return product.color_prices[color]
    if size and (product.size_prices or {}).get(size):
        return product.size_prices[size]
    return product.price


@router.post("/items", response_model=CartOut, status_code=201)
def add_to_cart(payload: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(
        Product.id == payload.product_id, Product.status == ProductStatus.active
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock_quantity < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    if payload.reference_image_url and not _is_own_reference_image(payload.reference_image_url):
        raise HTTPException(status_code=400, detail="Invalid reference image")

    cart = _get_or_create_cart(current_user, db)

    # Check if same product+color+size already in cart
    existing = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == payload.product_id,
        CartItem.selected_color == payload.selected_color,
        CartItem.selected_size == payload.selected_size,
    ).first()

    if existing:
        existing.quantity += payload.quantity
        if payload.custom_note:
            existing.custom_note = payload.custom_note
        if payload.reference_image_url:
            existing.reference_image_url = payload.reference_image_url
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
            selected_color=payload.selected_color,
            selected_size=payload.selected_size,
            custom_note=payload.custom_note,
            reference_image_url=payload.reference_image_url,
            price_at_add=_unit_price(product, payload.selected_color, payload.selected_size),
        )
        db.add(item)

    db.commit()

    cart = db.query(Cart).options(
        joinedload(Cart.items).joinedload(CartItem.product)
    ).filter(Cart.id == cart.id).first()

    return _build_cart_out(cart)


@router.put("/items/{item_id}", response_model=CartOut)
def update_cart_item(item_id: int, payload: CartItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = _get_or_create_cart(current_user, db)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if payload.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = payload.quantity

    db.commit()

    cart = db.query(Cart).options(
        joinedload(Cart.items).joinedload(CartItem.product)
    ).filter(Cart.id == cart.id).first()

    return _build_cart_out(cart)


@router.delete("/items/{item_id}", response_model=CartOut)
def remove_cart_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = _get_or_create_cart(current_user, db)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()

    cart = db.query(Cart).options(
        joinedload(Cart.items).joinedload(CartItem.product)
    ).filter(Cart.id == cart.id).first()

    return _build_cart_out(cart)


@router.delete("")
@router.delete("/", include_in_schema=False)
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = _get_or_create_cart(current_user, db)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
