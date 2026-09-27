const asyncHandler = require("../utils/asyncHandler");
const {
  normalizeEventScores,
  getProjectNormalizedScores,
  getEventNormalizedScores,
} = require("../services/normalizationService");

const normalizeScores = asyncHandler(async (req, res) => {
  const result = await normalizeEventScores(
    req.params.eventId,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Scores normalized successfully",
    data: result,
  });
});

const getProjectNormalizedScoresController =
  asyncHandler(async (req, res) => {
    const result =
      await getProjectNormalizedScores(
        req.params.projectId,
        req.user
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  });

const getEventNormalizedScoresController =
  asyncHandler(async (req, res) => {
    const result =
      await getEventNormalizedScores(
        req.params.eventId,
        req.user
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  });

module.exports = {
  normalizeScores,
  getProjectNormalizedScoresController,
  getEventNormalizedScoresController,
};