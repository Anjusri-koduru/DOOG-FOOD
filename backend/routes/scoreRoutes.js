const express = require("express");

const router = express.Router();

const {
  createOrUpdateScore,
  getScoreById,
  getMyScoreForProject,
  getMyScores,
  getProjectScores,
  getEventScores,
} = require("../controllers/scoringController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

router.use(protect);

router.get(
  "/my",
  authorize("judge"),
  getMyScores
);

router.get(
  "/my/project/:projectId",
  authorize("judge"),
  getMyScoreForProject
);

router.post(
  "/",
  authorize("judge"),
  createOrUpdateScore
);

router.get(
  "/project/:projectId",
  getProjectScores
);

router.get(
  "/event/:eventId",
  authorize("organizer", "admin"),
  getEventScores
);

router.get(
  "/:id",
  getScoreById
);

module.exports = router;