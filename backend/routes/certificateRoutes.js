const express = require("express");

const router = express.Router();

const {
  generateParticipationController,
  generateWinnerController,
  issueWinnerController,
  getMyCertificatesController,
  getCertificateController,
  verifyCertificateController,
  revokeCertificateController,
  getEventCertificatesController,
} = require("../controllers/certificateController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

/*
 * Public certificate verification
 *
 * Anyone with a certificate ID can verify it.
 */
router.get(
  "/verify/:certificateId",
  verifyCertificateController
);

/*
 * Logged-in user certificates
 */
router.get(
  "/my",
  protect,
  getMyCertificatesController
);

/*
 * View a certificate by certificate ID
 */
router.get(
  "/:certificateId",
  getCertificateController
);

/*
 * Organizer/Admin certificate management
 */
router.use(protect);

router.get(
  "/event/:eventId",
  authorize("organizer", "admin"),
  getEventCertificatesController
);

router.post(
  "/event/:eventId/participation",
  authorize("organizer", "admin"),
  generateParticipationController
);

router.post(
  "/event/:eventId/winners/preview",
  authorize("organizer", "admin"),
  generateWinnerController
);

router.post(
  "/event/:eventId/winners",
  authorize("organizer", "admin"),
  issueWinnerController
);

router.patch(
  "/:certificateId/revoke",
  authorize("organizer", "admin"),
  revokeCertificateController
);

module.exports = router;