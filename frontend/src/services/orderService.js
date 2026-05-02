import api from "./api";

export const orderService = {
  createOrder: (data) => api.post("/orders", data),
  getOrders: () => api.get("/orders"),
  getOrder: (id) => api.get(`/orders/${id}`),
  validateCoupon: (code, order_amount) => api.post("/orders/validate-coupon", { code, order_amount }),
  createRazorpayOrder: (order_id) => api.post("/payments/razorpay/create", { order_id }),
  verifyRazorpayPayment: (data) => api.post("/payments/razorpay/verify", data),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
};
