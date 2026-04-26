import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import { toast } from "sonner";
import { Tag, CreditCard, Truck, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const addressSchema = z.object({
  full_name: z.string().min(2, "Required"),
  phone: z.string().min(10, "Valid phone required"),
  address_line1: z.string().min(5, "Required"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  pincode: z.string().length(6, "6-digit pincode required"),
});

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(addressSchema) });

  const shipping = cart.subtotal >= 500 || cart.subtotal === 0 ? 0 : 50;
  const total = cart.subtotal - couponDiscount + shipping;

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const { data } = await orderService.validateCoupon(couponCode, cart.subtotal);
      if (data.valid) {
        setCouponDiscount(data.discount_amount);
        setCouponMsg(`✓ ${data.message} - You save ₹${data.discount_amount}`);
      } else {
        setCouponDiscount(0);
        setCouponMsg(`✗ ${data.message}`);
      }
    } catch {
      setCouponMsg("✗ Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const onSubmit = async (addressData) => {
    if (cart.items.length === 0) { toast.error("Cart is empty"); return; }
    setPlacingOrder(true);

    try {
      // Create order
      const { data: order } = await orderService.createOrder({
        shipping_address: addressData,
        payment_method: paymentMethod,
        coupon_code: couponDiscount > 0 ? couponCode : undefined,
      });

      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpay();
        if (!loaded) { toast.error("Razorpay SDK failed to load"); setPlacingOrder(false); return; }

        const { data: rzpOrder } = await orderService.createRazorpayOrder(order.id);

        const options = {
          key: RAZORPAY_KEY,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Thread Tales by Teju",
          description: `Order #${order.order_number}`,
          order_id: rzpOrder.razorpay_order_id,
          handler: async (response) => {
            try {
              await orderService.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              });
              clearCart();
              navigate(`/order-success/${order.id}`);
            } catch {
              toast.error("Payment verification failed. Contact support.");
            }
          },
          prefill: { name: addressData.full_name, contact: addressData.phone },
          theme: { color: "#c8a45c" },
          modal: {
            ondismiss: () => {
              toast.error("Payment cancelled");
              setPlacingOrder(false);
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // COD
        clearCart();
        navigate(`/order-success/${order.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to place order");
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif text-brand-dark mb-8 flex items-center gap-3">
          <CreditCard size={28} className="text-brand-gold" /> Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left – Address + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="font-semibold text-brand-dark mb-5 flex items-center gap-2">
                  <Truck size={18} className="text-brand-gold" /> Shipping Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "full_name", label: "Full Name", placeholder: "Your full name", col: 1 },
                    { name: "phone", label: "Phone", placeholder: "+91 98765 43210", col: 1 },
                    { name: "address_line1", label: "Address Line 1", placeholder: "House / Street", col: 2 },
                    { name: "address_line2", label: "Address Line 2 (optional)", placeholder: "Landmark, Colony", col: 2 },
                    { name: "city", label: "City", placeholder: "City", col: 1 },
                    { name: "state", label: "State", placeholder: "State", col: 1 },
                    { name: "pincode", label: "Pincode", placeholder: "560001", col: 1 },
                  ].map(({ name, label, placeholder, col }) => (
                    <div key={name} className={col === 2 ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-brand-dark/70 mb-1.5">{label}</label>
                      <input {...register(name)} placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-brand-dark text-sm" />
                      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="font-semibold text-brand-dark mb-5 flex items-center gap-2">
                  <CreditCard size={18} className="text-brand-gold" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "razorpay", label: "Pay Online (UPI, Cards, Netbanking)", sub: "Powered by Razorpay — secure & instant" },
                    { id: "cod", label: "Cash on Delivery", sub: "Pay when you receive your order" },
                  ].map(({ id, label, sub }) => (
                    <label key={id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === id ? "border-brand-gold bg-brand-gold/5" : "border-brand-dark/10 hover:border-brand-gold/40"}`}>
                      <input type="radio" name="payment" value={id} checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)} className="accent-brand-gold" />
                      <div>
                        <p className="font-medium text-brand-dark text-sm">{label}</p>
                        <p className="text-xs text-brand-dark/50">{sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
                <h2 className="font-semibold text-brand-dark">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.product?.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-brand-dark font-medium line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-brand-dark/50">×{item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold text-brand-dark">₹{(item.price_at_add * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark/70 mb-1.5 flex items-center gap-1">
                    <Tag size={12} /> Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="SAVE20" maxLength={20}
                      className="flex-1 px-3 py-2 rounded-xl border border-brand-dark/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-brand-dark" />
                    <button type="button" onClick={validateCoupon} disabled={validatingCoupon}
                      className="px-3 py-2 bg-brand-gold/20 text-brand-dark rounded-xl text-xs font-medium hover:bg-brand-gold/40 transition-colors">
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-xs mt-1 ${couponDiscount > 0 ? "text-green-600" : "text-red-500"}`}>{couponMsg}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-brand-dark/10 pt-4">
                  <div className="flex justify-between text-brand-dark/70">
                    <span>Subtotal</span><span>₹{cart.subtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span><span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-dark/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-dark text-base border-t border-brand-dark/10 pt-2">
                    <span>Total</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={placingOrder}
                  className="w-full py-4 bg-brand-dark text-brand-cream rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors disabled:opacity-60">
                  <CheckCircle size={18} />
                  {placingOrder ? "Processing..." : `Place Order · ₹${total.toLocaleString()}`}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
