import axios from "axios";

const url = import.meta.env.VITE_BACKEND;

const axiosInstance = axios.create({
  baseURL: "/api",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      const { data } = error.response;
      console.log(data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
