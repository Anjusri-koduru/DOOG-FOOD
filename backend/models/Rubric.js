const mongoose = require("mongoose");

const criterionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    maxScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    _id: true,
  }
);

const rubricSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    criteria: {
      type: [criterionSchema],
      required: true,
      validate: {
        validator: (criteria) =>
          Array.isArray(criteria) &&
          criteria.length > 0,
        message:
          "At least one evaluation criterion is required",
      },
    },

    totalWeight: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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

rubricSchema.pre("validate", function (next) {
  if (!this.criteria || this.criteria.length === 0) {
    return next();
  }

  const totalWeight = this.criteria.reduce(
    (sum, criterion) =>
      sum + Number(criterion.weight || 0),
    0
  );

  this.totalWeight = totalWeight;

  if (Math.abs(totalWeight - 100) > 0.01) {
    return next(
      new Error(
        "Total criterion weight must be exactly 100"
      )
    );
  }

  next();
});

rubricSchema.index({
  event: 1,
  track: 1,
});

module.exports = mongoose.model(
  "Rubric",
  rubricSchema
);