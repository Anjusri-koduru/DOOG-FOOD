const express = require("express");

const router = express.Router();

const {
  createCommentController,
  getProjectCommentsController,
  getCommentController,
  updateCommentController,
  deleteCommentController,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

router.get(
  "/project/:projectId",
  getProjectCommentsController
);

router.get(
  "/:id",
  getCommentController
);

router.post(
  "/",
  protect,
  createCommentController
);

router.put(
  "/:id",
  protect,
  updateCommentController
);

router.delete(
  "/:id",
  protect,
  deleteCommentController
);

module.exports = router;