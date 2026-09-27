const express = require("express");

const router = express.Router();

const {
  createTrack,
  getTracksByEvent,
  getAllTracksByEvent,
  getTrackById,
  updateTrack,
  deleteTrack,
} = require("../controllers/trackController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/event/:eventId", getTracksByEvent);

router.get(
  "/event/:eventId/all",
  protect,
  authorize("organizer", "admin"),
  getAllTracksByEvent
);

router.get("/:id", getTrackById);

router.post(
  "/",
  protect,
  authorize("organizer", "admin"),
  createTrack
);

router.put(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  updateTrack
);

router.delete(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  deleteTrack
);

module.exports = router;