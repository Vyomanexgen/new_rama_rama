export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

if (import.meta.env.DEV) {
  console.log("[apiBase] API_BASE_URL =", API_BASE_URL);
}

