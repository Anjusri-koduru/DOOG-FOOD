const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    rules: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

trackSchema.index({ event: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Track", trackSchema);