const mongoose = require("mongoose");

const criterionScoreSchema = new mongoose.Schema(
  {
    criterionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    maxScore: {
      type: Number,
      required: true,
      min: 1,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    weightedScore: {
      type: Number,
      default: 0,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const scoreSchema = new mongoose.Schema(
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

    rubric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rubric",
      required: true,
    },

    criteriaScores: {
      type: [criterionScoreSchema],
      required: true,
    },

    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    overallComment: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
      ],
      default: "draft",
    },

    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

scoreSchema.index(
  {
    project: 1,
    judge: 1,
    rubric: 1,
  },
  {
    unique: true,
  }
);

scoreSchema.index({
  event: 1,
  project: 1,
});

module.exports = mongoose.model(
  "Score",
  scoreSchema
);