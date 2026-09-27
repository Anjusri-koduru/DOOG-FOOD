const asyncHandler = require("../utils/asyncHandler");
const rubricService = require("../services/rubricService");

const createRubric = asyncHandler(
  async (req, res) => {
    const rubric =
      await rubricService.createRubric(
        req.body,
        req.user
      );

    res.status(201).json({
      success: true,
      message: "Rubric created successfully",
      data: rubric,
    });
  }
);

const getRubricById = asyncHandler(
  async (req, res) => {
    const rubric =
      await rubricService.getRubricById(
        req.params.id
      );

    res.json({
      success: true,
      data: rubric,
    });
  }
);

const getRubricsByEvent = asyncHandler(
  async (req, res) => {
    const rubrics =
      await rubricService.getRubricsByEvent(
        req.params.eventId,
        req.query.includeInactive === "true"
      );

    res.json({
      success: true,
      data: rubrics,
    });
  }
);

const getRubricsByTrack = asyncHandler(
  async (req, res) => {
    const rubrics =
      await rubricService.getRubricsByTrack(
        req.params.trackId
      );

    res.json({
      success: true,
      data: rubrics,
    });
  }
);

const updateRubric = asyncHandler(
  async (req, res) => {
    const rubric =
      await rubricService.updateRubric(
        req.params.id,
        req.body,
        req.user
      );

    res.json({
      success: true,
      message: "Rubric updated successfully",
      data: rubric,
    });
  }
);

const deleteRubric = asyncHandler(
  async (req, res) => {
    const result =
      await rubricService.deleteRubric(
        req.params.id,
        req.user
      );

    res.json({
      success: true,
      ...result,
    });
  }
);

module.exports = {
  createRubric,
  getRubricById,
  getRubricsByEvent,
  getRubricsByTrack,
  updateRubric,
  deleteRubric,
};