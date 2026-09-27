import api from "./api";

const authService = {
  // =========================
  // REGISTER
  // =========================
  register: async (userData) => {
    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;
  },

  // =========================
  // LOGIN
  // =========================
  login: async (credentials) => {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    return response.data;
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    const response = await api.post(
      "/auth/logout"
    );

    return response.data;
  },

  // =========================
  // CURRENT USER
  // =========================
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");

    return response.data;
  },
};

export default authService;