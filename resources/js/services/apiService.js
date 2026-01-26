import axios from "axios";

const API_BASE_URL = window.env && window.env.API_BASE_URL;
console.log("API Base URL:", API_BASE_URL);

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]');
  if (csrfToken) {
    const token = csrfToken.getAttribute("content");
    if (token) {
      config.headers["X-CSRF-TOKEN"] = token;
    }
  }

  const authToken = localStorage.getItem("token");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export default apiService;
