const asyncHandler = require("../utils/asyncHandler");

const projectService = require("../services/projectService");

const createProject = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.createProject(
        req.body,
        req.user
      );

    res.status(201).json({
      success: true,
      message:
        "Project created successfully",
      data: project,
    });
  }
);

const getProjectById = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.getProjectById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);

const getMyProject = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.getMyProject(
        req.user._id,
        req.query.eventId || null
      );

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);

const getAllProjects = asyncHandler(
  async (req, res) => {
    const projects =
      await projectService.getAllProjects();

    res.status(200).json({
      success: true,
      data: projects,
    });
  }
);

const getProjectsByEvent = asyncHandler(
  async (req, res) => {
    const projects =
      await projectService.getProjectsByEvent(
        req.params.eventId
      );

    res.status(200).json({
      success: true,
      data: projects,
    });
  }
);

const updateProject = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.updateProject(
        req.params.id,
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message:
        "Project updated successfully",
      data: project,
    });
  }
);

const submitProject = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.submitProject(
        req.params.id,
        req.user
      );

    res.status(200).json({
      success: true,
      message:
        "Project submitted successfully",
      data: project,
    });
  }
);

const withdrawProject = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.withdrawProject(
        req.params.id,
        req.user
      );

    res.status(200).json({
      success: true,
      message:
        "Project withdrawn successfully",
      data: project,
    });
  }
);

module.exports = {
  createProject,
  getProjectById,
  getMyProject,
  getAllProjects,
  getProjectsByEvent,
  updateProject,
  submitProject,
  withdrawProject,
};