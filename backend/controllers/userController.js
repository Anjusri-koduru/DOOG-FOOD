const authService = require("../services/authService");
const {
  successResponse,
} = require("../utils/apiResponse");

const getMyProfile = async (req, res) => {
  return successResponse(
    res,
    200,
    "Profile retrieved successfully",
    {
      user: req.user,
    }
  );
};

const updateMyProfile = async (req, res) => {
  const user =
    await authService.updateOwnProfile(
      req.user._id,
      req.body
    );

  return successResponse(
    res,
    200,
    "Profile updated successfully",
    {
      user,
    }
  );
};

const getUsers = async (req, res) => {
  const {
    role,
    search,
  } = req.query;

  let isActive;

  if (req.query.isActive !== undefined) {
    isActive =
      req.query.isActive === "true";
  }

  const page = Math.max(
    parseInt(req.query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(req.query.limit) || 20,
      1
    ),
    100
  );

  const result =
    await authService.getUsers({
      role,
      isActive,
      search,
      page,
      limit,
    });

  return successResponse(
    res,
    200,
    "Users retrieved successfully",
    result
  );
};

const getUserById = async (req, res) => {
  const user =
    await authService.getUserById(
      req.params.id
    );

  return successResponse(
    res,
    200,
    "User retrieved successfully",
    {
      user,
    }
  );
};

const updateUserStatus = async (
  req,
  res
) => {
  const {
    isActive,
  } = req.body;

  if (
    typeof isActive !== "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "isActive must be true or false",
    });
  }

  if (
    req.user._id.toString() ===
    req.params.id
  ) {
    return res.status(400).json({
      success: false,
      message:
        "You cannot change your own account status",
    });
  }

  const user =
    await authService.updateUserStatus(
      req.params.id,
      isActive
    );

  return successResponse(
    res,
    200,
    "User status updated successfully",
    {
      user,
    }
  );
};

const updateUserRole = async (
  req,
  res
) => {
  const { role } = req.body;

  const allowedRoles = [
    "participant",
    "judge",
    "organizer",
    "admin",
  ];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid role",
    });
  }

  if (
    req.user._id.toString() ===
    req.params.id
  ) {
    return res.status(400).json({
      success: false,
      message:
        "You cannot change your own role",
    });
  }

  const user =
    await authService.updateUserRole(
      req.params.id,
      role
    );

  return successResponse(
    res,
    200,
    "User role updated successfully",
    {
      user,
    }
  );
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
};