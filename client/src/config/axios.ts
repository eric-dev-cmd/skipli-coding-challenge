import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

export interface ApiError {
  success?: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    console.error("API Error:", error);
    if (error && error.status === 401) {
      localStorage.removeItem("phoneNumber");
      window.location.href = "/auth/login";
    }
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";

    toast.error(apiMessage);

    return Promise.reject(error);
  }
);

export default axiosInstance;
