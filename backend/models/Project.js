const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      unique: true,
    },

    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 10000,
    },

    technologies: {
      type: [String],
      default: [],
    },

    repositoryUrl: {
      type: String,
      trim: true,
      default: "",
    },

    demoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    videoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    presentationUrl: {
      type: String,
      trim: true,
      default: "",
    },

    screenshots: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "withdrawn"],
      default: "draft",
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Event index
 */
projectSchema.index({ event: 1 });

/*
 * NOTE:
 * team already has unique: true above,
 * so we do NOT add another team index here.
 */

module.exports = mongoose.model("Project", projectSchema);