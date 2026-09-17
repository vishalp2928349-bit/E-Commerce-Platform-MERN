import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("mern_user"))?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Bug #10 fix: on 401, dispatch logout so Redux state is cleared in addition to localStorage.
// We use a lazy import here to avoid a circular dependency:
//   api.js → store.js → slices → authSlice.js (which is fine at runtime but breaks at module-init time).
// By deferring the import() call until the interceptor fires, we break the init-time cycle.
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // Lazy-load store and logout to avoid circular import at module initialisation
      const [{ default: store }, { logout }] = await Promise.all([
        import("../redux/store.js"),
        import("../redux/slices/authSlice.js"),
      ]);
      store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);

export default api;
