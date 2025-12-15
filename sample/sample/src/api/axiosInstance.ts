import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Request Interceptor */
axiosInstance.interceptors.request.use(
  (config) => {
    // attach token if needed
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response Interceptor */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // global error handling (401, 500)
    return Promise.reject(error);
  }
);
