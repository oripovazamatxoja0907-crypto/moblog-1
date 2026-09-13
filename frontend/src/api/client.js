import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "Serverda xatolik";
    const details = error.response?.data?.details || [];
    const customError = new Error(message);
    customError.details = details;
    return Promise.reject(customError);
  },
);

export default client;
