const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      minlength: 20,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    submissionDeadline: {
      type: Date,
      required: true,
    },

    mode: {
      type: String,
      enum: [
        "online",
        "offline",
        "hybrid",
      ],
      default: "online",
    },

    location: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    rules: {
      type: String,
      default: "",
    },

    maxTeamSize: {
      type: Number,
      min: 1,
      max: 20,
      default: 4,
    },

    minTeamSize: {
      type: Number,
      min: 1,
      max: 20,
      default: 1,
    },

    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "registration_open",
        "registration_closed",
        "judging",
        "completed",
        "cancelled",
      ],
      default: "draft",
      index: true,
    },

    bannerImage: {
      type: String,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Validate event dates
|--------------------------------------------------------------------------
*/

eventSchema.pre(
  "validate",
  function (next) {
    if (
      this.endDate &&
      this.startDate &&
      this.endDate <= this.startDate
    ) {
      return next(
        new Error(
          "End date must be after start date"
        )
      );
    }

    if (
      this.registrationDeadline &&
      this.startDate &&
      this.registrationDeadline >
        this.startDate
    ) {
      return next(
        new Error(
          "Registration deadline cannot be after event start"
        )
      );
    }

    if (
      this.submissionDeadline &&
      this.endDate &&
      this.submissionDeadline >
        this.endDate
    ) {
      return next(
        new Error(
          "Submission deadline cannot be after event end"
        )
      );
    }

    if (
      this.minTeamSize >
      this.maxTeamSize
    ) {
      return next(
        new Error(
          "Minimum team size cannot exceed maximum team size"
        )
      );
    }

    next();
  }
);

module.exports =
  mongoose.model(
    "Event",
    eventSchema
  );