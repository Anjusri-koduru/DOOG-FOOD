const express = require("express");

const router = express.Router();

const {
  createPrize,
  getPrizesByEvent,
  getAllPrizesByEvent,
  getPrizeById,
  updatePrize,
  deletePrize,
} = require("../controllers/prizeController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/event/:eventId", getPrizesByEvent);

router.get(
  "/event/:eventId/all",
  protect,
  authorize("organizer", "admin"),
  getAllPrizesByEvent
);

router.get("/:id", getPrizeById);

router.post(
  "/",
  protect,
  authorize("organizer", "admin"),
  createPrize
);

router.put(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  updatePrize
);

router.delete(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  deletePrize
);

module.exports = router;