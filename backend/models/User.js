const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [
        2,
        "Name must contain at least 2 characters",
      ],
      maxlength: [
        100,
        "Name cannot exceed 100 characters",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        8,
        "Password must contain at least 8 characters",
      ],
      select: false,
    },

    role: {
      type: String,
      enum: [
        "participant",
        "judge",
        "organizer",
        "admin",
      ],
      default: "participant",
      index: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    college: {
      type: String,
      maxlength: 200,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Hash password before saving
|--------------------------------------------------------------------------
|
| Mongoose 9 compatible middleware.
| Do NOT use next() here.
|
*/

userSchema.pre("save", async function () {
  // If password was not changed,
  // don't hash it again.
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

/*
|--------------------------------------------------------------------------
| Compare password
|--------------------------------------------------------------------------
*/

userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

/*
|--------------------------------------------------------------------------
| Remove sensitive fields from JSON
|--------------------------------------------------------------------------
*/

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.__v;

  return user;
};

module.exports = mongoose.model(
  "User",
  userSchema
);