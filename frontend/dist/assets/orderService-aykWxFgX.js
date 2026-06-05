import{c as a,k as r}from"./index-R4zDghXe.js";/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],s=a("circle-check-big",t),p={createOrder:e=>r.post("/orders",e),getOrders:()=>r.get("/orders"),getOrder:e=>r.get(`/orders/${e}`),validateCoupon:(e,o)=>r.post("/orders/validate-coupon",{code:e,order_amount:o}),createRazorpayOrder:e=>r.post("/payments/razorpay/create",{order_id:e}),verifyRazorpayPayment:e=>r.post("/payments/razorpay/verify",e),cancelOrder:e=>r.post(`/orders/${e}/cancel`)};export{s as C,p as o};
