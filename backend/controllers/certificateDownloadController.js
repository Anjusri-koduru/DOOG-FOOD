const Certificate = require("../models/Certificate");

const {
  generateCertificatePDF,
} = require("../services/certificatePdfService");

const downloadCertificate = async (
  req,
  res
) => {
  try {
    const {
      certificateId,
    } = req.params;

    const certificate =
      await Certificate.findOne({
        certificateId:
          certificateId
            .trim()
            .toUpperCase(),
      })
        .populate(
          "event",
          "title organizer"
        )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "team",
          "name leader"
        )
        .populate(
          "project",
          "title"
        );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message:
          "Certificate not found",
      });
    }

    /*
     * Admin can download any certificate.
     */
    const isAdmin =
      req.user.role === "admin";

    /*
     * Certificate owner can download
     * their own certificate.
     */
    const isOwner =
      certificate.user &&
      certificate.user._id
        .toString() ===
        req.user._id.toString();

    /*
     * Event organizer can download
     * certificates belonging to their event.
     */
    const isOrganizer =
      req.user.role === "organizer" &&
      certificate.event &&
      certificate.event.organizer &&
      certificate.event.organizer
        .toString() ===
        req.user._id.toString();

    if (
      !isAdmin &&
      !isOwner &&
      !isOrganizer
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to download this certificate",
      });
    }

    if (!certificate.isValid) {
      return res.status(400).json({
        success: false,
        message:
          "This certificate has been revoked and cannot be downloaded",
      });
    }

    generateCertificatePDF(
      certificate,
      res
    );
  } catch (error) {
    console.error(
      "Certificate PDF download error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to generate certificate PDF",
        error: error.message,
      });
    }
  }
};

module.exports = {
  downloadCertificate,
};