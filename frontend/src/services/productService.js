import api from "./api";

export const productService = {
  getProducts: (params) => api.get("/products/", { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get("/products/categories"),
  getReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (data) => api.post("/reviews", data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};
