const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Own Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  protect,
  asyncHandler(getMyProfile)
);

router.put(
  "/me",
  protect,
  asyncHandler(updateMyProfile)
);

/*
|--------------------------------------------------------------------------
| User Management
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(getUsers)
);

router.get(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(getUserById)
);

router.patch(
  "/:id/status",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(updateUserStatus)
);

router.patch(
  "/:id/role",
  protect,
  authorize("admin"),
  asyncHandler(updateUserRole)
);

module.exports = router;