import api from "./api";

export const addressService = {
  getAddresses: () => api.get("/addresses"),
  createAddress: (data) => api.post("/addresses", data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  setDefault: (id) => api.patch(`/addresses/${id}/default`),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
};
