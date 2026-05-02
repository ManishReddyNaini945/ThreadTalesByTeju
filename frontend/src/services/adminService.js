import api from "./api";

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  // Products
  getProducts: (params) => api.get("/admin/products", { params }),
  createProduct: (data) => api.post("/admin/products", data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  uploadImage: (formData) => api.post("/admin/products/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  bulkUpload: (formData) => api.post("/admin/products/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  // Categories
  getCategories: () => api.get("/admin/categories"),
  createCategory: (data) => api.post("/admin/categories", data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  // Orders
  getOrders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (id, status, tracking_number) =>
    api.put(`/admin/orders/${id}/status`, null, { params: { status, tracking_number } }),
  // Coupons
  getCoupons: () => api.get("/admin/coupons"),
  createCoupon: (data) => api.post("/admin/coupons", data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
};
