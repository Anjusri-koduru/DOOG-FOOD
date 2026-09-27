const express = require("express");

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const asyncHandler = require("../utils/asyncHandler");

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  asyncHandler(register)
);

router.post(
  "/login",
  asyncHandler(login)
);

router.post(
  "/logout",
  asyncHandler(logout)
);

/*
|--------------------------------------------------------------------------
| Protected Authentication Route
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  protect,
  asyncHandler(getMe)
);

module.exports = router;