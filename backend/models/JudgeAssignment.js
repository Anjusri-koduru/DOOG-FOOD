const mongoose = require("mongoose");

const judgeAssignmentSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track",
      default: null,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "assigned",
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

judgeAssignmentSchema.index({
  event: 1,
  judge: 1,
});

judgeAssignmentSchema.index({
  project: 1,
  judge: 1,
});

module.exports = mongoose.model(
  "JudgeAssignment",
  judgeAssignmentSchema
);