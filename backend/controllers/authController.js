const authService = require("../services/authService");

const {
  validateRegistration,
  validateLogin,
} = require("../utils/validators");

const {
  successResponse,
  errorResponse,
} = require("../utils/apiResponse");

const {
  COOKIE_NAME,
} = require("../utils/constants");


// ==========================================
// SET AUTH COOKIE
// ==========================================

const setAuthCookie = (res, token) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
      ? "none"
      : "lax",
    maxAge:
      7 *
      24 *
      60 *
      60 *
      1000,
    path: "/",
  });
};


// ==========================================
// CLEAR AUTH COOKIE
// ==========================================

const clearAuthCookie = (res) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
      ? "none"
      : "lax",
    path: "/",
  });
};


// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      college,
      bio,
      skills,
    } = req.body;

    // ------------------------------
    // VALIDATION
    // ------------------------------

    const errors = validateRegistration({
      name,
      email,
      password,
    });

    if (Object.keys(errors).length > 0) {
      return errorResponse(
        res,
        400,
        "Please correct the validation errors",
        errors
      );
    }

    // ------------------------------
    // ROLE VALIDATION
    // ------------------------------

    const allowedRoles = [
      "participant",
      "judge",
      "organizer",
    ];

    const selectedRole =
      role || "participant";

    // Admin MUST NOT be selected
    // during public registration.
    if (
      selectedRole === "admin"
    ) {
      return errorResponse(
        res,
        403,
        "Admin accounts cannot be created through public registration"
      );
    }

    if (
      !allowedRoles.includes(
        selectedRole
      )
    ) {
      return errorResponse(
        res,
        400,
        "Invalid account role"
      );
    }

    // ------------------------------
    // CREATE USER
    // ------------------------------

    const result =
      await authService.registerUser({
        name,
        email,
        password,
        role: selectedRole,
        college,
        bio,
        skills,
      });

    // ------------------------------
    // SET COOKIE
    // ------------------------------

    setAuthCookie(
      res,
      result.token
    );

    return successResponse(
      res,
      201,
      "Registration successful",
      {
        user: result.user,
      }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return errorResponse(
      res,
      error.statusCode || 500,
      error.message ||
        "Registration failed"
    );
  }
};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const errors =
      validateLogin({
        email,
        password,
      });

    if (
      Object.keys(errors).length > 0
    ) {
      return errorResponse(
        res,
        400,
        "Please correct the validation errors",
        errors
      );
    }

    const result =
      await authService.loginUser({
        email,
        password,
      });

    setAuthCookie(
      res,
      result.token
    );

    return successResponse(
      res,
      200,
      "Login successful",
      {
        user: result.user,
      }
    );
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return errorResponse(
      res,
      error.statusCode || 500,
      error.message ||
        "Login failed"
    );
  }
};


// ==========================================
// LOGOUT
// ==========================================

const logout = async (req, res) => {
  clearAuthCookie(res);

  return successResponse(
    res,
    200,
    "Logout successful"
  );
};


// ==========================================
// CURRENT USER
// ==========================================

const getMe = async (req, res) => {
  return successResponse(
    res,
    200,
    "Current user retrieved successfully",
    {
      user: req.user,
    }
  );
};


module.exports = {
  register,
  login,
  logout,
  getMe,
};