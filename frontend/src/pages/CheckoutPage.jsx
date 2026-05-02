import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import { addressService } from "../services/addressService";
import { toast } from "sonner";
import { Tag, CreditCard, Truck, CheckCircle, MapPin, Gift } from "lucide-react";
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
  const [giftWrap, setGiftWrap] = useState(false);
  const GIFT_WRAP_FEE = 50;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(addressSchema) });

  useEffect(() => {
    addressService.getAddresses().then(({ data }) => {
      setSavedAddresses(data);
      const def = data.find((a) => a.is_default) || data[0];
      if (def) { setSelectedAddressId(def.id); reset({ full_name: def.full_name, phone: def.phone, address_line1: def.address_line1, address_line2: def.address_line2 || "", city: def.city, state: def.state, pincode: def.pincode }); }
    }).catch(() => {});
  }, []);

  const shipping = cart.subtotal >= 500 || cart.subtotal === 0 ? 0 : 50;
  const total = cart.subtotal - couponDiscount + shipping + (giftWrap ? GIFT_WRAP_FEE : 0);

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
        notes: giftWrap ? "Gift wrapping requested" : undefined,
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
          prefill: { name: addressData.full_name, contact: addressData.phone.replace(/\D/g, "").slice(-10) },
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
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-10">
          <CreditCard size={24} style={{ color: "var(--gold)" }} />
          <h1 className="text-3xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left – Address + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h2 className="font-normal text-base mb-5 flex items-center gap-2"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                  <Truck size={18} style={{ color: "var(--gold)" }} /> Shipping Address
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="mb-5 space-y-2">
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--cream-dim)" }}>Saved Addresses</p>
                    {savedAddresses.map((addr) => (
                      <label key={addr.id} className="flex items-start gap-3 p-3 cursor-pointer transition-all"
                        style={{ border: `1px solid ${selectedAddressId === addr.id ? "var(--gold)" : "var(--border)"}`, background: selectedAddressId === addr.id ? "rgba(200,164,92,0.07)" : "transparent" }}>
                        <input type="radio" name="saved_address" checked={selectedAddressId === addr.id}
                          onChange={() => { setSelectedAddressId(addr.id); reset({ full_name: addr.full_name, phone: addr.phone, address_line1: addr.address_line1, address_line2: addr.address_line2 || "", city: addr.city, state: addr.state, pincode: addr.pincode }); }}
                          className="accent-[#c8a45c] mt-0.5" />
                        <div className="text-xs" style={{ color: "var(--cream-dim)" }}>
                          <p className="font-medium" style={{ color: "var(--cream)" }}>{addr.full_name} · {addr.phone}</p>
                          <p>{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}, {addr.city}, {addr.state} – {addr.pincode}</p>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center gap-3 p-3 cursor-pointer transition-all"
                      style={{ border: `1px solid ${selectedAddressId === null ? "var(--gold)" : "var(--border)"}`, background: selectedAddressId === null ? "rgba(200,164,92,0.07)" : "transparent" }}>
                      <input type="radio" name="saved_address" checked={selectedAddressId === null}
                        onChange={() => { setSelectedAddressId(null); reset({ full_name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pincode: "" }); }}
                        className="accent-[#c8a45c]" />
                      <span className="text-xs" style={{ color: "var(--cream-dim)" }}>+ Use a different address</span>
                    </label>
                  </div>
                )}

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
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--cream-dim)" }}>{label}</label>
                      <input {...register(name)} placeholder={placeholder}
                        className="w-full px-4 py-3 text-sm focus:outline-none"
                        style={{
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          color: "var(--cream)",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--gold)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                      />
                      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]?.message}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h2 className="font-normal text-base mb-5 flex items-center gap-2"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                  <CreditCard size={18} style={{ color: "var(--gold)" }} /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "razorpay", label: "Pay Online (UPI, Cards, Netbanking)", sub: "Powered by Razorpay — secure & instant" },
                    { id: "cod", label: "Cash on Delivery", sub: "Pay when you receive your order" },
                  ].map(({ id, label, sub }) => (
                    <label key={id} className="flex items-center gap-4 p-4 cursor-pointer transition-all"
                      style={{
                        border: `1px solid ${paymentMethod === id ? "var(--gold)" : "var(--border)"}`,
                        background: paymentMethod === id ? "rgba(200,164,92,0.07)" : "transparent",
                      }}>
                      <input type="radio" name="payment" value={id} checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)} className="accent-[#c8a45c]" />
                      <div>
                        <p className="font-medium text-sm" style={{ color: "var(--cream)" }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--cream-dim)" }}>{sub}</p>
                      </div>
                    </label>
                  ))}

                  {/* Gift Wrap */}
                  <label className="flex items-center gap-4 p-4 cursor-pointer transition-all"
                    style={{
                      border: `1px solid ${giftWrap ? "var(--gold)" : "var(--border)"}`,
                      background: giftWrap ? "rgba(200,164,92,0.07)" : "transparent",
                    }}>
                    <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="accent-[#c8a45c]" />
                    <div className="flex items-center gap-2">
                      <Gift size={16} style={{ color: "var(--gold)" }} />
                      <div>
                        <p className="font-medium text-sm" style={{ color: "var(--cream)" }}>Gift Wrapping (+₹{GIFT_WRAP_FEE})</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--cream-dim)" }}>Beautifully wrapped with a handwritten note</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right – Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 sticky top-28 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h2 className="font-normal text-lg pb-4" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.product?.images?.[0]} alt="" className="w-10 h-10 object-cover flex-shrink-0" style={{ border: "1px solid var(--border)" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1" style={{ color: "var(--cream)" }}>{item.product?.name}</p>
                        <p className="text-xs" style={{ color: "var(--cream-dim)" }}>×{item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: "var(--cream)" }}>₹{(item.price_at_add * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: "var(--cream-dim)" }}>
                    <Tag size={12} /> Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="SAVE20" maxLength={20}
                      className="flex-1 px-3 py-2 text-sm focus:outline-none"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--cream)" }}
                      onFocus={e => e.target.style.borderColor = "var(--gold)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <button type="button" onClick={validateCoupon} disabled={validatingCoupon}
                      className="px-3 py-2 text-xs font-medium tracking-widest uppercase transition-all"
                      style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
                      onMouseEnter={e => { e.target.style.background = "var(--gold)"; e.target.style.color = "var(--bg)"; }}
                      onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--gold)"; }}>
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-xs mt-1 ${couponDiscount > 0 ? "text-green-400" : "text-red-400"}`}>{couponMsg}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--cream-dim)" }}>Subtotal</span>
                    <span style={{ color: "var(--cream)" }}>₹{cart.subtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon Discount</span><span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: "var(--cream-dim)" }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? "#4ade80" : "var(--cream)" }}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {giftWrap && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--cream-dim)" }}>Gift Wrapping</span>
                      <span style={{ color: "var(--cream)" }}>₹{GIFT_WRAP_FEE}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-base pt-3" style={{ borderTop: "1px solid var(--border)", color: "var(--cream)" }}>
                    <span>Total</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={placingOrder}
                  className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-60">
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
