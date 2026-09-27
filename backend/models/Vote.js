const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
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

    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can vote only once for one project.
voteSchema.index(
  {
    project: 1,
    voter: 1,
  },
  {
    unique: true,
  }
);

voteSchema.index({
  event: 1,
  project: 1,
});

voteSchema.index({
  event: 1,
  voter: 1,
});

module.exports = mongoose.model("Vote", voteSchema);