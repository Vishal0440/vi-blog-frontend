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
//
// Handles two cases: newer posts store a full Cloudinary URL already
// (starts with http), older posts (pre-Cloudinary) store a relative
// /uploads/... path — those old ones will still 404 since those files
// no longer exist on Render's disk, but this at least avoids mangling
// the URL further.
export const getImageUrl = (path) => {
  if (!path) return null;

  // Already a valid absolute URL (e.g. Cloudinary, or a link the user pasted)
  try {
    const url = new URL(path);
    if (url.protocol === "http:" || url.protocol === "https:") return path;
  } catch {
    // not a valid absolute URL — fall through
  }

  // Old-style relative path from before URL-based images (e.g. /uploads/xyz.jpg).
  // Only treat as relative if it actually looks like a path, not a mangled
  // absolute URL (like "https//example.com/..." missing a colon) — otherwise
  // we'd silently produce a broken concatenated URL.
  if (path.startsWith("/") && !/^\/\/|^\/https?\b/i.test(path)) {
    return `${BASE}${path}`;
  }

  return null; // malformed value — don't guess, let the UI show a broken-image fallback
};

export default api;
