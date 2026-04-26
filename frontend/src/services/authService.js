import api from "./api";

export const authService = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  googleAuth: (token) => api.post("/auth/google", { token }),
  refresh: (refresh_token) => api.post("/auth/refresh", { refresh_token }),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/me", data),
  changePassword: (data) => api.post("/auth/change-password", data),
  getAddresses: () => api.get("/auth/addresses"),
  addAddress: (data) => api.post("/auth/addresses", data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};
