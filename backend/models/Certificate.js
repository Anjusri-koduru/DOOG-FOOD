const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    certificateType: {
      type: String,
      enum: [
        "participation",
        "winner",
        "runner_up",
        "special_award",
        "judge",
        "organizer",
      ],
      default: "participation",
    },

    awardTitle: {
      type: String,
      trim: true,
      default: "",
    },

    rank: {
      type: Number,
      default: null,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    isValid: {
      type: Boolean,
      default: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokedReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Additional useful indexes
 * certificateId index is NOT added here because
 * unique: true already creates that index.
 */

certificateSchema.index({
  event: 1,
  user: 1,
});

certificateSchema.index({
  event: 1,
  certificateType: 1,
});

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);