const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjectById,
  getMyProject,
  getAllProjects,
  getProjectsByEvent,
  updateProject,
  submitProject,
  withdrawProject,
} = require("../controllers/projectController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

router.use(protect);

/*
 * Organizer/Admin project management
 */
router.get(
  "/",
  authorize("organizer", "admin"),
  getAllProjects
);

/*
 * Current user's project
 */
router.get(
  "/my",
  getMyProject
);

/*
 * Projects belonging to an event
 */
router.get(
  "/event/:eventId",
  authorize(
    "organizer",
    "admin",
    "judge"
  ),
  getProjectsByEvent
);

/*
 * Create project
 */
router.post(
  "/",
  createProject
);

/*
 * Single project
 */
router.get(
  "/:id",
  getProjectById
);

/*
 * Update project
 */
router.put(
  "/:id",
  updateProject
);

/*
 * Submit project
 */
router.patch(
  "/:id/submit",
  submitProject
);

/*
 * Withdraw project
 */
router.patch(
  "/:id/withdraw",
  withdrawProject
);

module.exports = router;