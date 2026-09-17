import api from "./api.js";

export const register = (data) => api.post("/auth/register", data).then((r) => r.data.data);
export const login = (data) => api.post("/auth/login", data).then((r) => r.data.data);
export const getProfile = () => api.get("/auth/profile").then((r) => r.data.data);
export const updateProfile = (data) => api.put("/auth/profile", data).then((r) => r.data.data);
export const changePassword = (data) => api.put("/auth/change-password", data).then((r) => r.data);
