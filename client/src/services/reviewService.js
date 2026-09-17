import api from "./api.js";

export const addReview = (productId, data) => api.post(`/reviews/${productId}`, data).then((r) => r.data);
export const deleteReview = (productId, reviewId) =>
  api.delete(`/reviews/${productId}/${reviewId}`).then((r) => r.data);
