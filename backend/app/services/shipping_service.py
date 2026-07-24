from datetime import datetime, timedelta

LOCAL_STATES = {"telangana", "andhra pradesh", "ts", "ap"}

SHIPPING_LOCAL = 70.0
SHIPPING_OTHER = 80.0

DELIVERY_DAYS_LOCAL = (3, 5)
DELIVERY_DAYS_OTHER = (6, 8)


def is_local_state(state: str) -> bool:
    return (state or "").strip().lower() in LOCAL_STATES


def calculate_shipping(state: str) -> float:
    return SHIPPING_LOCAL if is_local_state(state) else SHIPPING_OTHER


def estimated_delivery_range(state: str, from_date: datetime) -> tuple[datetime, datetime]:
    min_days, max_days = DELIVERY_DAYS_LOCAL if is_local_state(state) else DELIVERY_DAYS_OTHER
    return from_date + timedelta(days=min_days), from_date + timedelta(days=max_days)
