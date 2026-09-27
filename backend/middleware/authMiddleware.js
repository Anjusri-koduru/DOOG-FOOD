const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");
const {
  COOKIE_NAME,
} = require("../utils/constants");

const getTokenFromRequest = (req) => {
  /*
  |--------------------------------------------------------------------------
  | First check HTTP-only cookie
  |--------------------------------------------------------------------------
  */

  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }

  /*
  |--------------------------------------------------------------------------
  | Also support Authorization header
  |--------------------------------------------------------------------------
  |
  | This is useful for API testing tools such as Postman/Thunder Client.
  |
  */

  const authorization =
    req.headers.authorization;

  if (
    authorization &&
    authorization.startsWith("Bearer ")
  ) {
    return authorization.split(" ")[1];
  }

  return null;
};

const protect = async (req, res, next) => {
  try {
    const token =
      getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please login.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        env.JWT_SECRET
      );

    const user =
      await User.findById(
        decoded.userId
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Session expired. Please login again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    next(error);
  }
};

module.exports = {
  protect,
};