import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // 401 from /auth/me is normal when user is not logged in.
    // Do not show it as a console error/warning.
    if (
      status === 401 &&
      error.config?.url?.includes("/auth/me")
    ) {
      return Promise.reject(error);
    }

    // Other 401 errors can still be useful while debugging.
    if (status === 401) {
      console.warn("Authentication required:", message);
    }

    return Promise.reject(error);
  }
);

export default api;