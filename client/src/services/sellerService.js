import api from "./api.js";

export const fetchSellerStats = () => api.get("/seller/stats").then((r) => r.data.data);
export const fetchSellerProducts = () => api.get("/seller/products").then((r) => r.data.data);
export const fetchSellerOrders = () => api.get("/seller/orders").then((r) => r.data.data);
