import axios from "axios";
import { CONFIG } from "./configuration";
import { removeToken } from "../service/localStorageService";

const httpClient = axios.create({
  baseURL: CONFIG.API_GATEWAY,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor để handle lỗi 401/403
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token
      removeToken();
      
      // Redirect về trang login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;