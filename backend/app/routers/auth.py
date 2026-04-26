from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserRole, AuthProvider
from ..models.cart import Cart
from ..schemas.user import UserCreate, UserLogin, UserOut, Token, TokenRefresh, GoogleAuthRequest, UserUpdate, ChangePassword, AddressCreate, AddressOut
from ..auth.jwt import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from ..auth.google import verify_google_token
from ..dependencies import get_current_user
from ..models.address import Address
from typing import List

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _build_token(user: User) -> Token:
    access = create_access_token({"sub": str(user.id), "role": user.role})
    refresh = create_refresh_token({"sub": str(user.id)})
    return Token(access_token=access, refresh_token=refresh, user=UserOut.model_validate(user))


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        auth_provider=AuthProvider.local,
    )
    db.add(user)
    db.flush()

    # Create empty cart for user
    cart = Cart(user_id=user.id)
    db.add(cart)
    db.commit()
    db.refresh(user)

    return _build_token(user)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email. Please register first.")
    if not user.hashed_password:
        raise HTTPException(status_code=400, detail="This account uses Google sign-in. Please use the Google button.")
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Your account has been deactivated. Please contact support.")

    return _build_token(user)


@router.post("/google", response_model=Token)
async def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    google_data = await verify_google_token(payload.token)

    email = google_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Could not get email from Google")

    user = db.query(User).filter(User.email == email).first()

    if user:
        # Update Google ID if missing
        if not user.google_id:
            user.google_id = google_data.get("sub")
            user.auth_provider = AuthProvider.google
            db.commit()
    else:
        # Create new user from Google
        user = User(
            full_name=google_data.get("name", ""),
            email=email,
            google_id=google_data.get("sub"),
            avatar_url=google_data.get("picture"),
            auth_provider=AuthProvider.google,
            is_verified=True,
        )
        db.add(user)
        db.flush()
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(user)

    return _build_token(user)


@router.post("/refresh", response_model=Token)
def refresh_token(payload: TokenRefresh, db: Session = Depends(get_db)):
    data = decode_token(payload.refresh_token)
    if data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == int(data["sub"])).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")

    return _build_token(user)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_profile(payload: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password")
def change_password(payload: ChangePassword, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.hashed_password:
        raise HTTPException(status_code=400, detail="Account uses Google login")
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/addresses", response_model=List[AddressOut])
def get_addresses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Address).filter(Address.user_id == current_user.id).all()


@router.post("/addresses", response_model=AddressOut, status_code=201)
def add_address(payload: AddressCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    addr = Address(**payload.model_dump(), user_id=current_user.id)
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


@router.delete("/addresses/{address_id}")
def delete_address(address_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(addr)
    db.commit()
    return {"message": "Address deleted"}
