import axios from "axios";

const API_BASE_URL = window.env?.API_BASE_URL;

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default apiService;