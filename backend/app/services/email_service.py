import logging
from ..config import settings

logger = logging.getLogger(__name__)


def _send(to: str, subject: str, html: str):
    if not settings.RESEND_API_KEY:
        logger.warning(f"[Email skipped – RESEND_API_KEY not set] To: {to} | Subject: {subject}")
        return
    try:
        import resend
        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [to],
            "subject": subject,
            "html": html,
        })
        logger.info(f"Email sent to {to} | Subject: {subject}")
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


def _quote(text: str) -> str:
    return f"""
      <div style="background:#1c1916;border-left:3px solid #c8a45c;padding:14px 18px;margin:20px 0">
        <p style="margin:0;font-style:italic;font-family:Georgia,serif;color:#d4cdc4;font-size:14px;line-height:1.6">{text}</p>
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
      <p style="margin:0 0 4px;font-size:34px;text-align:center">🎉</p>
      <h2 style="color:#f7f5f2;margin:0 0 4px;text-align:center">Yay! Your Order is Confirmed</h2>
      <p style="color:#a89f94;text-align:center">Thank you for choosing Thread Tales by Teju — every piece is made with love, just for you.</p>
      {_quote("&ldquo;Every thread tells a story, and yours has just begun.&rdquo;")}
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px;margin:20px 0;text-align:center">
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
      <p style="margin-top:24px;color:#a89f94;font-size:13px;text-align:center">
        Sit back and relax — we're already working our magic. 🧵✨<br/>
        We'll email you the moment it ships!
      </p>
      <p style="margin-top:16px;color:#a89f94;font-size:13px;text-align:center">
        Questions? WhatsApp us at <a href="https://wa.me/919866052260" style="color:#c8a45c">+91 98660 52260</a>.
      </p>"""
    _send(to, f"🎉 Order Confirmed – #{order.order_number} | Thread Tales by Teju", _base(content))


def send_tracking_update(to: str, order_number: str, tracking_number: str) -> None:
    content = f"""
      <p style="margin:0 0 4px;font-size:34px;text-align:center">📦</p>
      <h2 style="color:#fb923c;margin:0 0 4px;text-align:center">Your Tracking Number is Here!</h2>
      <p style="color:#a89f94;text-align:center">Your order is on the move — here's how you can follow along.</p>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px;margin:20px 0;text-align:center">
        <p style="margin:0 0 4px;color:#a89f94;font-size:12px;letter-spacing:2px;text-transform:uppercase">Order Number</p>
        <p style="margin:0 0 12px;font-size:20px;color:#c8a45c;font-family:Georgia,serif">#{order_number}</p>
        <p style="margin:0 0 4px;color:#a89f94;font-size:12px;letter-spacing:2px;text-transform:uppercase">Tracking Number</p>
        <p style="margin:0;font-size:20px;color:#f7f5f2;font-family:Georgia,serif">{tracking_number}</p>
      </div>
      {_quote("&ldquo;Good things come to those who track their packages.&rdquo; 😉")}
      <p style="color:#a89f94;font-size:13px;margin-top:24px;text-align:center">
        Questions? WhatsApp us at <a href="https://wa.me/919866052260" style="color:#c8a45c">+91 98660 52260</a>.
      </p>"""
    _send(to, f"📦 Tracking Number Added – #{order_number} | Thread Tales by Teju", _base(content))


def send_stock_notification(to: str, product_name: str, product_url: str) -> None:
    content = f"""
      <p style="margin:0 0 4px;font-size:34px;text-align:center">✨</p>
      <h2 style="color:#c8a45c;margin:0 0 4px;text-align:center">Back in Stock!</h2>
      <p style="color:#a89f94;text-align:center">Good news! An item from your wishlist just made its grand return.</p>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px;margin:20px 0;text-align:center">
        <p style="margin:0;font-size:16px;color:#f7f5f2;font-family:Georgia,serif">{product_name}</p>
        <p style="margin:8px 0 0;color:#a89f94;font-size:13px">is now available — grab it before it sells out again!</p>
      </div>
      {_quote("&ldquo;Some pieces are worth the wait — and worth a second chance.&rdquo;")}
      <div style="text-align:center">
        <a href="{product_url}" style="display:inline-block;padding:12px 28px;background:#c8a45c;color:#0c0a09;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-top:8px">
          Shop Now
        </a>
      </div>
      <p style="margin-top:24px;color:#a89f94;font-size:12px;text-align:center">You received this because you signed up for back-in-stock alerts.</p>"""
    _send(to, f"✨ {product_name} is back in stock | Thread Tales by Teju", _base(content))


def send_abandoned_cart_email(to: str, items: list, cart_url: str) -> None:
    items_html = "".join(
        f'<tr><td style="padding:8px 0;color:#f7f5f2;border-bottom:1px solid #2d2824">{name}</td>'
        f'<td style="padding:8px 0;text-align:center;color:#a89f94;border-bottom:1px solid #2d2824">×{qty}</td></tr>'
        for name, qty in items
    )
    content = f"""
      <p style="margin:0 0 4px;font-size:34px;text-align:center">🛍️</p>
      <h2 style="color:#c8a45c;margin:0 0 4px;text-align:center">You Left Something Behind!</h2>
      <p style="color:#a89f94;text-align:center">Your handpicked treasures are still waiting in your cart — don't let them slip away.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <thead><tr>
          <th style="text-align:left;padding-bottom:8px;color:#a89f94;font-size:12px;border-bottom:1px solid #2d2824">Item</th>
          <th style="text-align:center;padding-bottom:8px;color:#a89f94;font-size:12px;border-bottom:1px solid #2d2824">Qty</th>
        </tr></thead>
        <tbody>{items_html}</tbody>
      </table>
      {_quote("&ldquo;The things we love don't like to be kept waiting.&rdquo;")}
      <div style="text-align:center">
        <a href="{cart_url}" style="display:inline-block;padding:12px 28px;background:#c8a45c;color:#0c0a09;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-top:8px">
          Complete Your Order
        </a>
      </div>
      <p style="margin-top:24px;color:#a89f94;font-size:13px;text-align:center">
        Questions? WhatsApp us at <a href="https://wa.me/919866052260" style="color:#c8a45c">+91 98660 52260</a>.
      </p>"""
    _send(to, "🛍️ You left something in your cart | Thread Tales by Teju", _base(content))


def send_password_reset(to: str, reset_link: str) -> None:
    content = f"""
      <h2 style="color:#c8a45c;margin-top:0">Reset Your Password</h2>
      <p style="color:#a89f94">We received a request to reset your password. Click the button below to choose a new one.</p>
      <a href="{reset_link}" style="display:inline-block;padding:14px 32px;background:#c8a45c;color:#0c0a09;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:20px 0">
        Reset Password
      </a>
      <p style="color:#a89f94;font-size:13px">This link expires in <strong style="color:#f7f5f2">1 hour</strong>.</p>
      <p style="color:#a89f94;font-size:12px;margin-top:24px">If you didn't request a password reset, you can safely ignore this email. Your password won't change.</p>"""
    _send(to, "Reset Your Password | Thread Tales by Teju", _base(content))


def send_status_update(to: str, order_number: str, status: str, tracking_number: str = None) -> None:
    status_messages = {
        "confirmed": (
            "✅", "Order Confirmed",
            "We've got your order! Our artisans are getting started on your handcrafted pieces.",
            "&ldquo;Good things are worth the wait — and yours are already in the making.&rdquo;",
            "#60a5fa",
        ),
        "processing": (
            "🧵", "Your Order is Being Crafted",
            "Your items are being carefully packed and prepped for their journey to you.",
            "&ldquo;Patience is the secret ingredient behind every beautiful thing.&rdquo;",
            "#c084fc",
        ),
        "shipped": (
            "📦", "Your Order is on Its Way!",
            "Pack your excitement — your order has left our hands and is heading straight to yours!",
            "&ldquo;Good things come to those who track their packages.&rdquo; 😉",
            "#fb923c",
        ),
        "delivered": (
            "💛", "Delivered With Love",
            "Your order has arrived! We hope it brings as much joy to you as it brought us making it.",
            "&ldquo;Happiness is a little box of handcrafted treasures.&rdquo;",
            "#4ade80",
        ),
        "cancelled": (
            "🤍", "Order Cancelled",
            "Your order has been cancelled. Refund (if applicable) will be processed within 5-7 days.",
            "&ldquo;Every ending is just a new beginning waiting to happen — we'll be here when you're ready.&rdquo;",
            "#f87171",
        ),
    }
    emoji, title, msg, quote, color = status_messages.get(
        status, ("✨", "Order Update", f"Your order status has been updated to {status}.", "", "#c8a45c")
    )
    tracking_html = f'<p style="margin-top:16px;color:#a89f94">Tracking Number: <strong style="color:#c8a45c">{tracking_number}</strong></p>' if tracking_number else ""
    quote_html = _quote(quote) if quote else ""
    content = f"""
      <p style="margin:0 0 4px;font-size:34px;text-align:center">{emoji}</p>
      <h2 style="color:{color};margin:0 0 4px;text-align:center">{title}</h2>
      <div style="background:#1c1916;border:1px solid #2d2824;padding:16px;margin:16px 0;text-align:center">
        <p style="margin:0 0 4px;color:#a89f94;font-size:12px;letter-spacing:2px;text-transform:uppercase">Order Number</p>
        <p style="margin:0;font-size:20px;color:#c8a45c;font-family:Georgia,serif">#{order_number}</p>
      </div>
      <p style="color:#a89f94;text-align:center">{msg}</p>
      {tracking_html}
      {quote_html}
      <p style="color:#a89f94;font-size:13px;margin-top:24px;text-align:center">
        Questions? WhatsApp us at <a href="https://wa.me/919866052260" style="color:#c8a45c">+91 98660 52260</a>.
      </p>"""
    _send(to, f"{emoji} {title} – #{order_number} | Thread Tales by Teju", _base(content))
