const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAssignmentById,
  getAllJudges,
  getEventAssignments,
  getMyAssignments,
  updateAssignmentStatus,
  cancelAssignment,
  getJudgesForEvent,
} = require("../controllers/judgeController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

router.use(protect);

/*
 * Admin → all judges
 */
router.get(
  "/",
  authorize("admin"),
  getAllJudges
);

/*
 * Current judge assignments
 */
router.get(
  "/my",
  authorize("judge"),
  getMyAssignments
);

/*
 * Judges available for an event
 */
router.get(
  "/event/:eventId/judges",
  authorize("organizer", "admin"),
  getJudgesForEvent
);

/*
 * Event assignments
 */
router.get(
  "/event/:eventId",
  authorize("organizer", "admin"),
  getEventAssignments
);

/*
 * Create assignment
 */
router.post(
  "/",
  authorize("organizer", "admin"),
  createAssignment
);

/*
 * Single assignment
 */
router.get(
  "/:id",
  getAssignmentById
);

/*
 * Assignment status
 */
router.patch(
  "/:id/status",
  updateAssignmentStatus
);

/*
 * Cancel assignment
 */
router.delete(
  "/:id",
  authorize("organizer", "admin"),
  cancelAssignment
);

module.exports = router;