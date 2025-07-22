import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  //   withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Don't add token for public auth routes
  const publicPaths = ["/auth/login", "/auth/register"];
  const isPublic = publicPaths.some(
    (path) => config.url?.endsWith(path) || config.url?.includes(path)
  );
  console.log("Request URL:", config.url);
  console.log("Is public path:", isPublic);
  if (!isPublic && typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
