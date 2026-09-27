const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken =
  require("../utils/generateToken");


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async ({
  name,
  email,
  password,
  role,
  college,
  bio,
  skills,
}) => {
  // ------------------------------
  // CHECK EXISTING USER
  // ------------------------------

  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await User.findOne({
      email: normalizedEmail,
    });

  if (existingUser) {
    const error = new Error(
      "An account with this email already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  // ------------------------------
  // SAFE ROLE
  // ------------------------------

  const selectedRole =
    role || "participant";

  // Admin cannot be created
  // through normal registration.
  if (
    selectedRole === "admin"
  ) {
    const error = new Error(
      "Admin accounts cannot be created through public registration"
    );

    error.statusCode = 403;

    throw error;
  }

  const allowedRoles = [
    "participant",
    "judge",
    "organizer",
  ];

  if (
    !allowedRoles.includes(
      selectedRole
    )
  ) {
    const error = new Error(
      "Invalid account role"
    );

    error.statusCode = 400;

    throw error;
  }

  // ------------------------------
  // CREATE USER
  // ------------------------------

  const user =
    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: selectedRole,
      college:
        college?.trim() || "",
      bio:
        bio?.trim() || "",
      skills:
        Array.isArray(skills)
          ? skills
          : [],
    });

  // ------------------------------
  // GENERATE JWT
  // ------------------------------

  const token =
    generateToken(user);

  // ------------------------------
  // RETURN
  // ------------------------------

  return {
    user,
    token,
  };
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async ({
  email,
  password,
}) => {
  const normalizedEmail =
    email.trim().toLowerCase();

  // Password is select:false
  // in User model, so explicitly select it.
  const user =
    await User.findOne({
      email: normalizedEmail,
    }).select("+password");

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  if (!user.isActive) {
    const error = new Error(
      "Your account is inactive"
    );

    error.statusCode = 403;

    throw error;
  }

  // ------------------------------
  // CHECK PASSWORD
  // ------------------------------

  const isPasswordValid =
    await user.comparePassword(
      password
    );

  if (!isPasswordValid) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  // ------------------------------
  // UPDATE LOGIN TIME
  // ------------------------------

  user.lastLoginAt =
    new Date();

  await user.save();

  // ------------------------------
  // TOKEN
  // ------------------------------

  const token =
    generateToken(user);

  return {
    user,
    token,
  };
};


module.exports = {
  registerUser,
  loginUser,
};