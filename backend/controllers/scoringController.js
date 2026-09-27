const asyncHandler = require("../utils/asyncHandler");
const scoringService = require("../services/scoringService");

const createOrUpdateScore =
  asyncHandler(async (req, res) => {
    const score =
      await scoringService.createOrUpdateScore(
        req.body,
        req.user
      );

    res.status(201).json({
      success: true,
      message:
        req.body.submit === true
          ? "Score submitted successfully"
          : "Score saved as draft successfully",
      data: score,
    });
  });

const getScoreById =
  asyncHandler(async (req, res) => {
    const score =
      await scoringService.getScoreById(
        req.params.id
      );

    res.json({
      success: true,
      data: score,
    });
  });

const getMyScoreForProject =
  asyncHandler(async (req, res) => {
    const score =
      await scoringService.getMyScoreForProject(
        req.params.projectId,
        req.user._id
      );

    res.json({
      success: true,
      data: score,
    });
  });

const getMyScores =
  asyncHandler(async (req, res) => {
    const scores =
      await scoringService.getMyScores(
        req.user._id
      );

    res.json({
      success: true,
      data: scores,
    });
  });

const getProjectScores =
  asyncHandler(async (req, res) => {
    const scores =
      await scoringService.getProjectScores(
        req.params.projectId,
        req.user
      );

    res.json({
      success: true,
      data: scores,
    });
  });

const getEventScores =
  asyncHandler(async (req, res) => {
    const scores =
      await scoringService.getEventScores(
        req.params.eventId,
        req.user
      );

    res.json({
      success: true,
      data: scores,
    });
  });

module.exports = {
  createOrUpdateScore,
  getScoreById,
  getMyScoreForProject,
  getMyScores,
  getProjectScores,
  getEventScores,
};