from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..dependencies import get_admin_user
from ..models.user import User
from ..models.site_settings import SiteSettings

router = APIRouter(prefix="/settings", tags=["Settings"])

# Default values used if DB has no row yet
DEFAULTS = {
    "promo_enabled":       "true",
    "promo_threshold":     "999",
    "promo_discount_pct":  "15",
    "promo_label":         "15% OFF + FREE SHIPPING",
    "rakhi_banner_enabled":   "false",
    "rakhi_banner_image_url": "",
}


def _get(db: Session, key: str) -> str:
    row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
    return row.value if row else DEFAULTS.get(key, "")


def _set(db: Session, key: str, value: str, description: str = ""):
    row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
    if row:
        row.value = value
    else:
        db.add(SiteSettings(key=key, value=value, description=description))
    db.commit()


# ── Public endpoint — frontend reads promo config ──────────────────────────────
@router.get("/promo")
def get_promo_settings(db: Session = Depends(get_db)):
    return {
        "enabled":       _get(db, "promo_enabled") == "true",
        "threshold":     float(_get(db, "promo_threshold")),
        "discount_pct":  float(_get(db, "promo_discount_pct")),
        "label":         _get(db, "promo_label"),
    }


# ── Admin endpoints ─────────────────────────────────────────────────────────────
class PromoUpdate(BaseModel):
    enabled: bool
    threshold: float
    discount_pct: float
    label: str


@router.put("/promo")
def update_promo_settings(
    payload: PromoUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    _set(db, "promo_enabled",      str(payload.enabled).lower(),  "Promo active toggle")
    _set(db, "promo_threshold",    str(payload.threshold),         "Min order amount for promo")
    _set(db, "promo_discount_pct", str(payload.discount_pct),      "Discount percentage")
    _set(db, "promo_label",        payload.label,                  "Banner display text")
    return {"message": "Promo settings updated successfully"}


# ── Rakhi homepage banner ───────────────────────────────────────────────────────
@router.get("/rakhi-banner")
def get_rakhi_banner_settings(db: Session = Depends(get_db)):
    return {
        "enabled":   _get(db, "rakhi_banner_enabled") == "true",
        "image_url": _get(db, "rakhi_banner_image_url"),
    }


class RakhiBannerUpdate(BaseModel):
    enabled: bool
    image_url: Optional[str] = None


@router.put("/rakhi-banner")
def update_rakhi_banner_settings(
    payload: RakhiBannerUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    _set(db, "rakhi_banner_enabled",   str(payload.enabled).lower(), "Rakhi homepage banner toggle")
    _set(db, "rakhi_banner_image_url", payload.image_url or "",      "Rakhi homepage banner image URL")
    return {"message": "Rakhi banner settings updated successfully"}
