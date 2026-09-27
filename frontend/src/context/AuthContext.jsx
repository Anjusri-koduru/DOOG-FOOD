import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

export const AuthContext = createContext(null);

function normalizeUser(response) {
  const user =
    response?.data?.user ||
    response?.user ||
    response?.data ||
    null;

  if (!user || typeof user !== "object") {
    return null;
  }

  return {
    ...user,
    _id: user._id || user.id || null,
    role: user.role
      ? String(user.role).trim().toLowerCase()
      : null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD CURRENT USER
  // ==========================================
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await authService.getCurrentUser();

      if (response?.success) {
        const currentUser =
          normalizeUser(response);

        console.log(
          "DOGFOOD current user:",
          currentUser
        );

        console.log(
          "DOGFOOD current user role:",
          currentUser?.role
        );

        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.error(
          "Failed to load current user:",
          error
        );

        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL AUTH CHECK
  // ==========================================
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (email, password) => {
    const response =
      await authService.login({
        email,
        password,
      });

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Login failed"
      );
    }

    const loggedInUser =
      normalizeUser(response);

    console.log(
      "DOGFOOD logged in user:",
      loggedInUser
    );

    console.log(
      "DOGFOOD logged in role:",
      loggedInUser?.role
    );

    setUser(loggedInUser);

    return response;
  };

  // ==========================================
  // REGISTER
  // ==========================================
  const register = async (userData) => {
    const response =
      await authService.register(
        userData
      );

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Registration failed"
      );
    }

    return response;
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      setUser(null);
    }
  };

  // ==========================================
  // REFRESH USER
  // ==========================================
  const refreshUser = async () => {
    await loadUser();
  };

  // ==========================================
  // UPDATE USER
  // ==========================================
  const updateUser = (updatedUser) => {
    const normalizedUser =
      updatedUser
        ? {
            ...updatedUser,
            _id:
              updatedUser._id ||
              updatedUser.id ||
              null,
            role: updatedUser.role
              ? String(
                  updatedUser.role
                )
                  .trim()
                  .toLowerCase()
              : null,
          }
        : null;

    setUser(normalizedUser);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const value = {
    user,
    loading,

    isAuthenticated:
      Boolean(user),

    login,
    register,
    logout,

    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}