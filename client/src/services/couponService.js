import api from "./api.js";

export const fetchCoupons = () => api.get("/coupons").then((r) => r.data.data);
export const createCoupon = (data) => api.post("/coupons", data).then((r) => r.data.data);
