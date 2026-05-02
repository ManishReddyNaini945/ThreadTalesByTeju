import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from ..config import settings

logger = logging.getLogger(__name__)


def _send(to: str, subject: str, html: str):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.info(f"[Email skipped – SMTP not configured] To: {to} | Subject: {subject}")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to
        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to, msg.as_string())
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")


def _base(content: str) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0c0a09;color:#f7f5f2;border:1px solid #2d2824">
      <div style="padding:32px 24px;border-bottom:1px solid #2d2824;text-align:center">
        <h1 style="margin:0;font-size:22px;color:#c8a45c;font-family:Georgia,serif">Thread Tales by Teju</h1>
        <p style="margin:4px 0 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#a89f94">Handcrafted with love</p>
      </div>
      <div style="padding:32px 24px">{content}</div>
      <div style="padding:20px 24px;border-top:1px solid #2d2824;text-align:center;font-size:12px;color:#a89f94">
        &copy; 2025 Thread Tales by Teju · Hyderabad, Telangana, India
      </div>
    </div>"""


def send_order_confirmation(to: str, order) -> None:
    items_html = "".join(
        f'<tr><td style="padding:8px 0;color:#f7f5f2;border-bottom:1px solid #2d2824">{i.product_name}</td>'
        f'<td style="padding:8px 0;text-align:center;color:#a89f94;border-bottom:1px solid #2d2824">×{i.quantity}</td>'
        f'<td style="padding:8px 0;text-align:right;color:#f7f5f2;border-bottom:1px solid #2d2824">₹{i.total_price:,.0f}</td></tr>'
        for i in order.items
    )
    addr = order.shipping_address or {}
    content = f"""
      <h2 style="color:#f7f5f2;margin-top:0">Order Confirmed!</h2>
      <p style="color:#a89f94">Thank you for shopping with us. Your order has been placed successfully.</p>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px;margin:20px 0">
        <p style="margin:0 0 4px;color:#a89f94;font-size:12px;letter-spacing:2px;text-transform:uppercase">Order Number</p>
        <p style="margin:0;font-size:20px;color:#c8a45c;font-family:Georgia,serif">#{order.order_number}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <thead><tr>
          <th style="text-align:left;padding-bottom:8px;color:#a89f94;font-size:12px;border-bottom:1px solid #2d2824">Item</th>
          <th style="text-align:center;padding-bottom:8px;color:#a89f94;font-size:12px;border-bottom:1px solid #2d2824">Qty</th>
          <th style="text-align:right;padding-bottom:8px;color:#a89f94;font-size:12px;border-bottom:1px solid #2d2824">Price</th>
        </tr></thead>
        <tbody>{items_html}</tbody>
      </table>
      <div style="text-align:right;margin-bottom:24px">
        <p style="color:#a89f94;margin:4px 0">Shipping: {'FREE' if order.shipping_amount == 0 else f'₹{order.shipping_amount:,.0f}'}</p>
        {'<p style="color:#4ade80;margin:4px 0">Discount: -₹' + f'{order.discount_amount:,.0f}</p>' if order.discount_amount > 0 else ''}
        <p style="font-size:18px;color:#f7f5f2;margin:8px 0"><strong>Total: ₹{order.total_amount:,.0f}</strong></p>
      </div>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px">
        <p style="margin:0 0 8px;color:#a89f94;font-size:12px;letter-spacing:2px;text-transform:uppercase">Shipping To</p>
        <p style="margin:0;color:#f7f5f2">{addr.get('full_name','')}</p>
        <p style="margin:4px 0 0;color:#a89f94">{addr.get('address_line1','')}{', ' + addr.get('address_line2','') if addr.get('address_line2') else ''}</p>
        <p style="margin:2px 0 0;color:#a89f94">{addr.get('city','')}, {addr.get('state','')} – {addr.get('pincode','')}</p>
      </div>
      <p style="margin-top:24px;color:#a89f94;font-size:13px">
        We'll notify you when your order is shipped. For queries, WhatsApp us at <a href="https://wa.me/919866052260" style="color:#c8a45c">+91 98660 52260</a>.
      </p>"""
    _send(to, f"Order Confirmed – #{order.order_number} | Thread Tales by Teju", _base(content))


def send_stock_notification(to: str, product_name: str, product_url: str) -> None:
    content = f"""
      <h2 style="color:#c8a45c;margin-top:0">Back in Stock!</h2>
      <p style="color:#a89f94">Good news! An item from your wishlist is back in stock.</p>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px;margin:20px 0">
        <p style="margin:0;font-size:16px;color:#f7f5f2;font-family:Georgia,serif">{product_name}</p>
        <p style="margin:8px 0 0;color:#a89f94;font-size:13px">is now available — grab it before it sells out again!</p>
      </div>
      <a href="{product_url}" style="display:inline-block;padding:12px 28px;background:#c8a45c;color:#0c0a09;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-top:8px">
        Shop Now
      </a>
      <p style="margin-top:24px;color:#a89f94;font-size:12px">You received this because you signed up for back-in-stock alerts.</p>"""
    _send(to, f"{product_name} is back in stock | Thread Tales by Teju", _base(content))


def send_status_update(to: str, order_number: str, status: str, tracking_number: str = None) -> None:
    status_messages = {
        "confirmed": ("Order Confirmed", "Your order has been confirmed and is being prepared.", "#60a5fa"),
        "processing": ("Order Processing", "Your order is currently being processed and packed.", "#c084fc"),
        "shipped": ("Order Shipped!", "Great news – your order is on its way!", "#fb923c"),
        "delivered": ("Order Delivered", "Your order has been delivered. We hope you love it!", "#4ade80"),
        "cancelled": ("Order Cancelled", "Your order has been cancelled. Refund (if applicable) will be processed within 5-7 days.", "#f87171"),
    }
    title, msg, color = status_messages.get(status, ("Order Update", f"Your order status has been updated to {status}.", "#c8a45c"))
    tracking_html = f'<p style="margin-top:16px;color:#a89f94">Tracking Number: <strong style="color:#c8a45c">{tracking_number}</strong></p>' if tracking_number else ""
    content = f"""
      <h2 style="color:{color};margin-top:0">{title}</h2>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px;margin:16px 0">
        <p style="margin:0 0 4px;color:#a89f94;font-size:12px;letter-spacing:2px;text-transform:uppercase">Order Number</p>
        <p style="margin:0;font-size:20px;color:#c8a45c;font-family:Georgia,serif">#{order_number}</p>
      </div>
      <p style="color:#a89f94">{msg}</p>
      {tracking_html}
      <p style="color:#a89f94;font-size:13px;margin-top:24px">
        Questions? WhatsApp us at <a href="https://wa.me/919866052260" style="color:#c8a45c">+91 98660 52260</a>.
      </p>"""
    _send(to, f"{title} – #{order_number} | Thread Tales by Teju", _base(content))
