const express = require("express");

const {
  createEvent,
  getPublicEvents,
  getAllEvents,
  getEventById,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  publishEvent,
  unpublishEvent,
} = require("../controllers/eventController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/public",
  asyncHandler(getPublicEvents)
);

router.get(
  "/slug/:slug",
  asyncHandler(getEventBySlug)
);

/*
|--------------------------------------------------------------------------
| Organizer/Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(getAllEvents)
);

router.post(
  "/",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(createEvent)
);

/*
|--------------------------------------------------------------------------
| Event Details
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  asyncHandler(getEventById)
);

/*
|--------------------------------------------------------------------------
| Event Management
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(updateEvent)
);

router.delete(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(deleteEvent)
);

router.patch(
  "/:id/publish",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(publishEvent)
);

router.patch(
  "/:id/unpublish",
  protect,
  authorize("organizer", "admin"),
  asyncHandler(unpublishEvent)
);

module.exports = router;