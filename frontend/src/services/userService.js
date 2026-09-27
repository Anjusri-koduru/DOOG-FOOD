import api from "./api";

const userService = {
  // Get logged-in user's profile
  getMyProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Update logged-in user's profile
  updateMyProfile: async (userData) => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },

  // Admin - get all users
  getUsers: async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  // Admin - get single user
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Admin - activate/deactivate user
  updateUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/users/${userId}/status`, {
      isActive,
    });
    return response.data;
  },

  // Admin - change user role
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, {
      role,
    });
    return response.data;
  },
};

export default userService;