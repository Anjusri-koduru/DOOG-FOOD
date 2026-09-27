const mongoose = require("mongoose");

const normalizedScoreSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    judgeMean: {
      type: Number,
      required: true,
    },

    judgeStandardDeviation: {
      type: Number,
      required: true,
    },

    normalizedScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    method: {
      type: String,
      enum: ["z-score"],
      default: "z-score",
    },
  },
  {
    timestamps: true,
  }
);

normalizedScoreSchema.index(
  { event: 1, project: 1, judge: 1 },
  { unique: true }
);

normalizedScoreSchema.index({
  event: 1,
  project: 1,
});

module.exports = mongoose.model(
  "NormalizedScore",
  normalizedScoreSchema
);