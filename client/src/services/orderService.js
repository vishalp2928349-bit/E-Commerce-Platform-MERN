import api from "./api.js";

export const fetchOrders = () => api.get("/orders").then((r) => r.data.data);
export const fetchOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data.data);
export const createOrder = (data) => api.post("/orders", data).then((r) => r.data.data);
export const updateOrderStatus = (id, orderStatus) =>
  api.put(`/orders/${id}`, { orderStatus }).then((r) => r.data.data);
export const payOrder = (id, paymentMethod) =>
  api.put(`/orders/${id}/pay`, { paymentMethod }).then((r) => r.data.data);

