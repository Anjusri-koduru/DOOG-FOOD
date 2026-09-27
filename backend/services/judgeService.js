const JudgeAssignment = require("../models/JudgeAssignment");
const User = require("../models/User");
const Event = require("../models/Event");
const Project = require("../models/Project");
const Track = require("../models/Track");

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  return event;
};

const checkEventManager = (
  event,
  user
) => {
  if (
    user.role !== "admin" &&
    event.organizer.toString() !==
      user._id.toString()
  ) {
    const error = new Error(
      "You are not allowed to manage judges for this event"
    );

    error.statusCode = 403;
    throw error;
  }
};

const getJudge = async (judgeId) => {
  const judge =
    await User.findById(judgeId);

  if (!judge) {
    const error = new Error(
      "Judge not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (judge.role !== "judge") {
    const error = new Error(
      "Selected user does not have judge role"
    );

    error.statusCode = 400;
    throw error;
  }

  if (!judge.isActive) {
    const error = new Error(
      "Judge account is inactive"
    );

    error.statusCode = 400;
    throw error;
  }

  return judge;
};

const validateProject = async (
  projectId,
  eventId
) => {
  if (!projectId) {
    return null;
  }

  const project =
    await Project.findById(projectId);

  if (!project) {
    const error = new Error(
      "Project not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (
    project.event.toString() !==
    eventId.toString()
  ) {
    const error = new Error(
      "Project does not belong to this event"
    );

    error.statusCode = 400;
    throw error;
  }

  if (project.status !== "submitted") {
    const error = new Error(
      "Only submitted projects can be assigned to judges"
    );

    error.statusCode = 400;
    throw error;
  }

  return project;
};

const validateTrack = async (
  trackId,
  eventId
) => {
  if (!trackId) {
    return null;
  }

  const track =
    await Track.findById(trackId);

  if (!track) {
    const error = new Error(
      "Track not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (
    track.event.toString() !==
    eventId.toString()
  ) {
    const error = new Error(
      "Track does not belong to this event"
    );

    error.statusCode = 400;
    throw error;
  }

  return track;
};

const createAssignment = async (
  data,
  user
) => {
  const event = await getEvent(
    data.event
  );

  checkEventManager(event, user);

  if (!data.judge) {
    const error = new Error(
      "Judge is required"
    );

    error.statusCode = 400;
    throw error;
  }

  await getJudge(data.judge);

  const project =
    await validateProject(
      data.project,
      data.event
    );

  const track =
    await validateTrack(
      data.track,
      data.event
    );

  if (!project && !track) {
    const error = new Error(
      "Assignment must contain either a project or a track"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    project &&
    track &&
    project.track &&
    project.track.toString() !==
      track._id.toString()
  ) {
    const error = new Error(
      "Project does not belong to the selected track"
    );

    error.statusCode = 400;
    throw error;
  }

  const existingQuery = {
    event: data.event,
    judge: data.judge,
    status: {
      $ne: "cancelled",
    },
  };

  if (data.project) {
    existingQuery.project =
      data.project;
  } else {
    existingQuery.track =
      data.track;
  }

  const existing =
    await JudgeAssignment.findOne(
      existingQuery
    );

  if (existing) {
    const error = new Error(
      "This judge is already assigned"
    );

    error.statusCode = 409;
    throw error;
  }

  const assignment =
    await JudgeAssignment.create({
      event: data.event,
      judge: data.judge,
      project:
        data.project || null,
      track:
        data.track || null,
      assignedBy: user._id,
    });

  return getAssignmentById(
    assignment._id
  );
};

const getAssignmentById =
  async (assignmentId) => {
    const assignment =
      await JudgeAssignment.findById(
        assignmentId
      )
        .populate(
          "event",
          "title slug status"
        )
        .populate(
          "judge",
          "name email avatar"
        )
        .populate(
          "project",
          "title description status submittedAt"
        )
        .populate(
          "track",
          "name slug"
        )
        .populate(
          "assignedBy",
          "name email"
        );

    if (!assignment) {
      const error = new Error(
        "Judge assignment not found"
      );

      error.statusCode = 404;
      throw error;
    }

    return assignment;
  };

/*
 * Get all active judges.
 * Used by Admin → Judges.
 */
const getAllJudges = async () => {
  return User.find({
    role: "judge",
    isActive: true,
  })
    .select(
      "name email avatar bio college skills isActive createdAt lastLoginAt"
    )
    .sort({
      name: 1,
    });
};

const getEventAssignments =
  async (eventId, user) => {
    const event =
      await getEvent(eventId);

    checkEventManager(
      event,
      user
    );

    return JudgeAssignment.find({
      event: eventId,
      status: {
        $ne: "cancelled",
      },
    })
      .populate(
        "judge",
        "name email avatar"
      )
      .populate(
        "project",
        "title status submittedAt"
      )
      .populate(
        "track",
        "name slug"
      )
      .sort({
        createdAt: -1,
      });
  };

const getMyAssignments =
  async (judgeId) => {
    return JudgeAssignment.find({
      judge: judgeId,
      status: {
        $ne: "cancelled",
      },
    })
      .populate(
        "event",
        "title slug status submissionDeadline"
      )
      .populate(
        "project",
        "title description status submittedAt"
      )
      .populate(
        "track",
        "name slug"
      )
      .sort({
        createdAt: -1,
      });
  };

const updateAssignmentStatus =
  async (
    assignmentId,
    status,
    user
  ) => {
    const assignment =
      await JudgeAssignment.findById(
        assignmentId
      );

    if (!assignment) {
      const error = new Error(
        "Judge assignment not found"
      );

      error.statusCode = 404;
      throw error;
    }

    const isAssignedJudge =
      assignment.judge.toString() ===
      user._id.toString();

    const event =
      await getEvent(
        assignment.event
      );

    const isManager =
      user.role === "admin" ||
      event.organizer.toString() ===
        user._id.toString();

    if (
      !isAssignedJudge &&
      !isManager
    ) {
      const error = new Error(
        "You are not allowed to update this assignment"
      );

      error.statusCode = 403;
      throw error;
    }

    const allowedStatuses = [
      "assigned",
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      const error = new Error(
        "Invalid assignment status"
      );

      error.statusCode = 400;
      throw error;
    }

    assignment.status = status;

    await assignment.save();

    return getAssignmentById(
      assignment._id
    );
  };

const cancelAssignment =
  async (
    assignmentId,
    user
  ) => {
    const assignment =
      await JudgeAssignment.findById(
        assignmentId
      );

    if (!assignment) {
      const error = new Error(
        "Judge assignment not found"
      );

      error.statusCode = 404;
      throw error;
    }

    const event =
      await getEvent(
        assignment.event
      );

    checkEventManager(
      event,
      user
    );

    assignment.status =
      "cancelled";

    await assignment.save();

    return {
      message:
        "Judge assignment cancelled successfully",
    };
  };

const getJudgesForEvent =
  async (eventId, user) => {
    const event =
      await getEvent(eventId);

    checkEventManager(
      event,
      user
    );

    return User.find({
      role: "judge",
      isActive: true,
    }).select(
      "name email avatar bio college skills"
    );
  };

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