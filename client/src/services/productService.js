import api from "./api.js";

export const fetchProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const fetchProductById = (id) => api.get(`/products/${id}`).then((r) => r.data.data);
export const createProduct = (data) => api.post("/products", data).then((r) => r.data.data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data).then((r) => r.data.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
export const uploadImages = (formData) =>
  api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data.data);
