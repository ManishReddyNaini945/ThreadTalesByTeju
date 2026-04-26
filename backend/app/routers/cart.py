from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
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


@router.get("/", response_model=CartOut)
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


@router.post("/items", response_model=CartOut, status_code=201)
def add_to_cart(payload: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(
        Product.id == payload.product_id, Product.status == ProductStatus.active
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock_quantity < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

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
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
            selected_color=payload.selected_color,
            selected_size=payload.selected_size,
            price_at_add=product.price,
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


@router.delete("/")
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = _get_or_create_cart(current_user, db)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
