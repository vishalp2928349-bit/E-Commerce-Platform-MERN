import api from "./api.js";

export const fetchCart = () => api.get("/cart").then((r) => r.data.data);
export const addToCart = (productId, quantity = 1) =>
  api.post("/cart", { productId, quantity }).then((r) => r.data.data);
export const updateCartItem = (productId, quantity) =>
  api.put(`/cart/${productId}`, { quantity }).then((r) => r.data.data);
export const removeCartItem = (productId) => api.delete(`/cart/${productId}`).then((r) => r.data.data);
export const applyCoupon = (code) => api.post("/cart/apply-coupon", { code }).then((r) => r.data.data);
