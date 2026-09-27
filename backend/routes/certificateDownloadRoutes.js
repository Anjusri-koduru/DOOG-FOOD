const express = require("express");

const {
  downloadCertificate,
} = require("../controllers/certificateDownloadController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/:certificateId/download",
  protect,
  downloadCertificate
);

module.exports = router;