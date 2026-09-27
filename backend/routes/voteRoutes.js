const express = require("express");

const router = express.Router();

const {
  createVoteController,
  removeVoteController,
  getMyVoteController,
  getProjectVoteCountController,
  getEventVotingResultsController,
} = require("../controllers/voteController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Public vote count
router.get(
  "/project/:projectId/count",
  getProjectVoteCountController
);

// Authentication required below
router.use(protect);

// Cast vote
router.post(
  "/",
  createVoteController
);

// Remove own vote
router.delete(
  "/project/:projectId",
  removeVoteController
);

// Check whether current user voted
router.get(
  "/project/:projectId/me",
  getMyVoteController
);

// Organizer/Admin voting results
router.get(
  "/event/:eventId",
  authorize("organizer", "admin"),
  getEventVotingResultsController
);

module.exports = router;