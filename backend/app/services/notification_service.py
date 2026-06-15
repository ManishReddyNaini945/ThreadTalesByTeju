import threading
from . import email_service


def notify_payment_event(order, event: str, customer_email: str = None) -> None:
    """Fire admin + customer email alerts for a payment event in the background.

    event: "paid" | "failed" | "refunded"
    """
    def _run():
        if event == "failed" and customer_email:
            email_service.send_payment_failed(customer_email, order.order_number, order.total_amount)

        email_service.send_admin_payment_alert(order, event)

    threading.Thread(target=_run, daemon=True).start()
