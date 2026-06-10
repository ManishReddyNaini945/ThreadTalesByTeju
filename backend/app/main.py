from contextlib import asynccontextmanager

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from .config import settings
from .database import Base, engine
from .limiter import limiter
from .routers import auth, products, cart, wishlist, orders, payments, reviews, admin, addresses, stock_notify, newsletter
from .routers import settings as settings_router
from .services.abandoned_cart import send_abandoned_cart_emails
from . import models  # noqa: F401 – ensures all models are registered before create_all

if settings.SENTRY_DSN:
    import sentry_sdk
    sentry_sdk.init(dsn=settings.SENTRY_DSN, send_default_pii=False, traces_sample_rate=0.1)

# Create DB tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_abandoned_cart_emails, "interval", hours=1)
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready ecommerce API for Thread Tales by Teju",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redirect_slashes=False,
    lifespan=lifespan,
)

app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many attempts. Please wait a moment and try again."},
    )

_frontend_origins = [o.strip() for o in settings.FRONTEND_URL.split(",") if o.strip()]
_cors_origins = list(set(_frontend_origins + [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1")
app.include_router(wishlist.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(payments.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(addresses.router, prefix="/api/v1")
app.include_router(stock_notify.router, prefix="/api/v1")
app.include_router(newsletter.router, prefix="/api/v1")
app.include_router(settings_router.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Thread Tales by Teju API", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
