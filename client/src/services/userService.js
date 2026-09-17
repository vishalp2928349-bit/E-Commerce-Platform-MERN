import api from "./api.js";

export const fetchUsers = () => api.get("/users").then((r) => r.data.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data);
export const fetchDashboardStats = () => api.get("/users/stats/dashboard").then((r) => r.data.data);
export const fetchBuyerStats = () => api.get("/users/stats/buyer").then((r) => r.data.data);

