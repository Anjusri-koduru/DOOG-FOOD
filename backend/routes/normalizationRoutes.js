const express = require("express");

const router = express.Router();

const {
  normalizeScores,
  getProjectNormalizedScoresController,
  getEventNormalizedScoresController,
} = require("../controllers/normalizationController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.use(protect);

router.post(
  "/event/:eventId/normalize",
  authorize("organizer", "admin"),
  normalizeScores
);

router.get(
  "/event/:eventId",
  authorize("organizer", "admin"),
  getEventNormalizedScoresController
);

router.get(
  "/project/:projectId",
  authorize("organizer", "admin"),
  getProjectNormalizedScoresController
);

module.exports = router;