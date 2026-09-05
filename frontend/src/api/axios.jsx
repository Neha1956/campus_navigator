/*import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
 /* headers: {
    "Content-Type": "application/json",
  },*/
/*});

export default api;*/

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
/*  headers: {
    "Content-Type": "application/json",
  },*/
});

// Request interceptor to automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if ((status === 401 || status === 403) && !requestUrl.includes("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/admin/login") {
        window.location.replace("/admin/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;