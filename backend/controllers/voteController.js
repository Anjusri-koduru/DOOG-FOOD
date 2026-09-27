const asyncHandler = require("../utils/asyncHandler");

const {
  createVote,
  removeVote,
  getMyVote,
  getProjectVoteCount,
  getEventVotingResults,
} = require("../services/votingService");

const createVoteController = asyncHandler(
  async (req, res) => {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const vote = await createVote(
      projectId,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Vote submitted successfully",
      data: vote,
    });
  }
);

const removeVoteController = asyncHandler(
  async (req, res) => {
    await removeVote(
      req.params.projectId,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Vote removed successfully",
    });
  }
);

const getMyVoteController = asyncHandler(
  async (req, res) => {
    const result = await getMyVote(
      req.params.projectId,
      req.user
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

const getProjectVoteCountController =
  asyncHandler(async (req, res) => {
    const result =
      await getProjectVoteCount(
        req.params.projectId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  });

const getEventVotingResultsController =
  asyncHandler(async (req, res) => {
    const results =
      await getEventVotingResults(
        req.params.eventId,
        req.user
      );

    res.status(200).json({
      success: true,
      data: results,
    });
  });

module.exports = {
  createVoteController,
  removeVoteController,
  getMyVoteController,
  getProjectVoteCountController,
  getEventVotingResultsController,
};