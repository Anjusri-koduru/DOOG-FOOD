const asyncHandler = require("../utils/asyncHandler");

const {
  generateParticipationCertificates,
  generateWinnerCertificates,
  issueWinnerCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate,
  getEventCertificates,
} = require("../services/certificateService");

const generateParticipationController =
  asyncHandler(async (req, res) => {
    const result =
      await generateParticipationCertificates(
        req.params.eventId,
        req.user
      );

    res.status(201).json({
      success: true,
      message:
        "Participation certificates generated successfully",
      data: result,
    });
  });

const generateWinnerController =
  asyncHandler(async (req, res) => {
    const result =
      await generateWinnerCertificates(
        req.params.eventId,
        req.user
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  });

const issueWinnerController =
  asyncHandler(async (req, res) => {
    const {
      projectId,
      rank,
      awardTitle,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message:
          "Project ID is required",
      });
    }

    if (!rank) {
      return res.status(400).json({
        success: false,
        message:
          "Rank is required",
      });
    }

    const result =
      await issueWinnerCertificate({
        eventId: req.params.eventId,
        projectId,
        rank,
        awardTitle,
        user: req.user,
      });

    res.status(201).json({
      success: true,
      message:
        "Winner certificates issued successfully",
      data: result,
    });
  });

const getMyCertificatesController =
  asyncHandler(async (req, res) => {
    const certificates =
      await getMyCertificates(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: certificates,
    });
  });

const getCertificateController =
  asyncHandler(async (req, res) => {
    const certificate =
      await getCertificateById(
        req.params.certificateId
      );

    res.status(200).json({
      success: true,
      data: certificate,
    });
  });

const verifyCertificateController =
  asyncHandler(async (req, res) => {
    const result =
      await verifyCertificate(
        req.params.certificateId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  });

const revokeCertificateController =
  asyncHandler(async (req, res) => {
    const certificate =
      await revokeCertificate(
        req.params.certificateId,
        req.body.reason,
        req.user
      );

    res.status(200).json({
      success: true,
      message:
        "Certificate revoked successfully",
      data: certificate,
    });
  });

const getEventCertificatesController =
  asyncHandler(async (req, res) => {
    const certificates =
      await getEventCertificates(
        req.params.eventId,
        req.user
      );

    res.status(200).json({
      success: true,
      data: certificates,
    });
  });

module.exports = {
  generateParticipationController,
  generateWinnerController,
  issueWinnerController,
  getMyCertificatesController,
  getCertificateController,
  verifyCertificateController,
  revokeCertificateController,
  getEventCertificatesController,
};