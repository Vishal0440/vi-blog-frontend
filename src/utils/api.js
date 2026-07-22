import axios from "axios";

const BASE =
  import.meta.env.VITE_API_URL || "https://vi-blog-backend.onrender.com";
// const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE + "/api",
});

export const setAuthHeader = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

// Static files (uploaded images, etc.) are served from the server origin
// itself, not under /api. Use this helper anywhere you need to build an
// image URL from a stored path (e.g. post.image), instead of hardcoding
// or re-deriving the origin — that's what caused images to break before.
export const getImageUrl = (path) => (path ? `${BASE}${path}` : null);

export default api;
