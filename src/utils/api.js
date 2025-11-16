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

export default api;
