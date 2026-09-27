const asyncHandler = require("../utils/asyncHandler");
const judgeService = require("../services/judgeService");

const createAssignment = asyncHandler(
  async (req, res) => {
    const assignment =
      await judgeService.createAssignment(
        req.body,
        req.user
      );

    res.status(201).json({
      success: true,
      message:
        "Judge assigned successfully",
      data: assignment,
    });
  }
);

const getAssignmentById =
  asyncHandler(async (req, res) => {
    const assignment =
      await judgeService.getAssignmentById(
        req.params.id
      );

    res.json({
      success: true,
      data: assignment,
    });
  });

const getAllJudges = asyncHandler(
  async (req, res) => {
    const judges =
      await judgeService.getAllJudges();

    res.json({
      success: true,
      data: judges,
    });
  }
);

const getEventAssignments =
  asyncHandler(async (req, res) => {
    const assignments =
      await judgeService.getEventAssignments(
        req.params.eventId,
        req.user
      );

    res.json({
      success: true,
      data: assignments,
    });
  });

const getMyAssignments =
  asyncHandler(async (req, res) => {
    const assignments =
      await judgeService.getMyAssignments(
        req.user._id
      );

    res.json({
      success: true,
      data: assignments,
    });
  });

const updateAssignmentStatus =
  asyncHandler(async (req, res) => {
    const assignment =
      await judgeService.updateAssignmentStatus(
        req.params.id,
        req.body.status,
        req.user
      );

    res.json({
      success: true,
      message:
        "Assignment status updated successfully",
      data: assignment,
    });
  });

const cancelAssignment =
  asyncHandler(async (req, res) => {
    const result =
      await judgeService.cancelAssignment(
        req.params.id,
        req.user
      );

    res.json({
      success: true,
      ...result,
    });
  });

const getJudgesForEvent =
  asyncHandler(async (req, res) => {
    const judges =
      await judgeService.getJudgesForEvent(
        req.params.eventId,
        req.user
      );

    res.json({
      success: true,
      data: judges,
    });
  });

module.exports = {
  createAssignment,
  getAssignmentById,
  getAllJudges,
  getEventAssignments,
  getMyAssignments,
  updateAssignmentStatus,
  cancelAssignment,
  getJudgesForEvent,
};