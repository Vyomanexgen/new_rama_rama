import axios from "axios";
import { API_BASE_URL } from "./apiBase";
import { getFirebaseToken } from "./authToken";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getFirebaseToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
