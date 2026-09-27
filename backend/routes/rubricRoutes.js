const express = require("express");

const router = express.Router();

const {
  createRubric,
  getRubricById,
  getRubricsByEvent,
  getRubricsByTrack,
  updateRubric,
  deleteRubric,
} = require("../controllers/rubricController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

router.get(
  "/event/:eventId",
  getRubricsByEvent
);

router.get(
  "/track/:trackId",
  getRubricsByTrack
);

router.get(
  "/:id",
  getRubricById
);

router.post(
  "/",
  protect,
  authorize("organizer", "admin"),
  createRubric
);

router.put(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  updateRubric
);

router.delete(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  deleteRubric
);

module.exports = router;