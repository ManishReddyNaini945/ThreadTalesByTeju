import api from "./api";

export const wishlistService = {
  getWishlist: () => api.get("/wishlist"),
  getWishlistIds: () => api.get("/wishlist/ids"),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};
